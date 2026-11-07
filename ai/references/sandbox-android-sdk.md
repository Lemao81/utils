# Sandbox Android SDK

## Why

Native code in an Expo project (`modules/*/android`, Gradle files) only fails once it is compiled, and the host build is otherwise the first compile. The sandbox therefore keeps its own Android SDK and JDK 17 on the VM disk, so the agent can compile Android code before handing it back. Device builds stay on the host. Gradle's build state in the shared folder (`android/.gradle`, `android/build`, `modules/*/android/build` and the like) holds absolute paths and caches of the machine that wrote it, so the sandbox keeps its own copy on the VM disk and bind-mounts it over the shared folders, as with `node_modules`. The mounts live only in the VM's mount table; the host keeps its own build state underneath.

Everything below lives on the VM disk and survives sandbox restarts; only recreating the sandbox removes it.

Gradle downloads from `services.gradle.org`, `dl.google.com`, `repo.maven.apache.org` and `plugins.gradle.org`, and Maven Central redirects React Native's AARs to `repo.reactnative.dev`. When a Gradle run fails with "Approval required" for one of them, ask the user to run `sbx policy allow network <host>` on the host.

## Check

`[ -x "$ANDROID_HOME/cmdline-tools/latest/bin/android" ]` succeeding means the setup is complete, because the environment step comes last. Otherwise run every setup step below; each is safe to repeat. The sandbox `node_modules` must be set up first: step 3 reads versions from it.

## Setup

1. **JDK 17.** The React Native Gradle plugin asks for a Java 17 toolchain, and Gradle finds JDKs under `/usr/lib/jvm` without downloading one:

   ```sh
   sudo apt-get update && sudo apt-get install -y openjdk-17-jdk-headless
   ```

   Done when `ls -d /usr/lib/jvm/java-17-*` lists a directory.

2. **Command-line tools.** Take the newest `commandlinetools-linux-*_latest.zip` from Google's repository index and unpack it as `cmdline-tools/latest`:

   ```sh
   export ANDROID_HOME="$HOME/android-sdk"
   zip=$(curl -s https://dl.google.com/android/repository/repository2-3.xml | grep -oE 'commandlinetools-linux-[0-9]+_latest\.zip' | sort -t- -k3 -n | tail -1)
   tmp=$(mktemp -d)
   curl -so "$tmp/tools.zip" "https://dl.google.com/android/repository/$zip"
   unzip -q "$tmp/tools.zip" -d "$tmp"
   rm -rf "$ANDROID_HOME/cmdline-tools/latest"
   mkdir -p "$ANDROID_HOME/cmdline-tools"
   mv "$tmp/cmdline-tools" "$ANDROID_HOME/cmdline-tools/latest"
   rm -rf "$tmp"
   ```

   The tools ship the Android CLI (`android`); `sdkmanager` is deprecated and forwards to it. Done when `"$ANDROID_HOME/cmdline-tools/latest/bin/android" --version` prints a version.

3. **SDK packages.** The compile SDK and build-tools versions come from React Native's version catalog. From the repo root:

   ```sh
   export ANDROID_HOME="$HOME/android-sdk"
   toml=node_modules/react-native/gradle/libs.versions.toml
   compile_sdk=$(sed -n 's/^compileSdk = "\(.*\)"/\1/p' "$toml")
   build_tools=$(sed -n 's/^buildTools = "\(.*\)"/\1/p' "$toml")
   "$ANDROID_HOME/cmdline-tools/latest/bin/android" --sdk="$ANDROID_HOME" sdk install "platforms/android-$compile_sdk" "build-tools/$build_tools"
   ```

   The CLI accepts the SDK license itself and writes `licenses/android-sdk-license`; with it in place, Gradle installs any further SDK packages a library asks for on its own. Done when `"$ANDROID_HOME/cmdline-tools/latest/bin/android" --sdk="$ANDROID_HOME" sdk list` shows both packages as installed.

4. **Gradle state script.** Create `~/bin/mount-sandbox-gradle-state.sh`. It creates each missing build folder before mounting over it, so a sandbox Gradle run never writes into the shared folders, and it picks up new modules by itself:

   ```sh
   #!/bin/sh
   repo="$1"
   state="$HOME/gradle-state/$(basename "$repo")"

   [ -d "$repo/android/app" ] || exit 0

   targets="android/.gradle android/.kotlin android/build android/app/build android/app/.cxx"
   for module in "$repo"/modules/*/android; do
     [ -d "$module" ] && targets="$targets ${module#"$repo/"}/build"
   done

   for target in $targets; do
     mountpoint -q "$repo/$target" && continue
     source_dir="$state/$(echo "$target" | tr / _)"
     mkdir -p "$repo/$target" "$source_dir"
     sudo -n mount --bind "$source_dir" "$repo/$target"
   done
   ```

   The script stays in the sandbox; it is not part of the repo. Done when running it with the repo root makes `mountpoint -q android/.gradle` succeed.

5. **Environment.** Append to `/etc/sandbox-persistent.sh` once, with the repo root filled in, so every later command finds the SDK and the mounts come back after every sandbox restart:

   ```sh
   export ANDROID_HOME="$HOME/android-sdk"
   export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
   sh "$HOME/bin/mount-sandbox-gradle-state.sh" <repo root> >/dev/null 2>&1
   ```

   Done when the check above succeeds in a new command.

## Keeping it current

After an Expo SDK upgrade, rerun step 3: React Native's version catalog may name a newer compile SDK or build-tools version. After the host deletes `android/` (`expo prebuild --clean`), the old mounts point at removed folders: `sudo umount` each path listed by `findmnt -rn -o TARGET | grep "$PWD/\(android\|modules\)/"`, and the next command mounts the new ones.
