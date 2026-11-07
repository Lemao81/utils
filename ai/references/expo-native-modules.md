# Expo native modules

## Compile check

After editing a module's Android code (`modules/<name>/android`: Kotlin, manifest, `build.gradle`), compile it before handing back:

```sh
cd android && bash gradlew :<name>:compileDebugKotlin
```

Done when it ends with `BUILD SUCCESSFUL`. A run that fails with "Approval required" for a host needs that host allowed; see the network note in `sandbox-android-sdk.md`. Device builds stay on the host.

## Depending on another Expo package

Packages whose `expo-module.config.json` has an `android.publication` entry are linked as prebuilt AARs, so `project(':<package>')` does not exist. In the module's `build.gradle`, depend on the published artifact, read from that entry, and fall back to the Gradle project when the package is built from source:

```groovy
def publication = new groovy.json.JsonSlurper().parse(
  new File(
    providers.exec {
      workingDir(projectDir)
      commandLine("node", "--print", "require.resolve('<package>/expo-module.config.json')")
    }.standardOutput.asText.get().trim()
  )
).android.publication

dependencies {
  implementation findProject(':<project>') ?: "${publication.groupId}:${publication.artifactId}:${publication.version}"
}
```

`<package>` is the npm name; `<project>` is that name without a leading `@` and with `/` replaced by `-`.
