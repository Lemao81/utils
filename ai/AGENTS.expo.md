# Expo HAS CHANGED

This project is pinned to Expo SDK 57 (RN 0.86). Read the exact versioned
docs before writing any code — do not answer from memory.

Use the `expo` MCP server: `search_documentation` to find pages, `read_documentation` to read
them. Search returns `/versions/latest/` URLs; rewrite `latest` → `v57.0.0` before reading, so
the content stays pinned to this project's SDK even after SDK 58 ships. Non-SDK pages
(`/router/`, `/eas/`, guides) are unversioned and can be read as returned.

# Expo skills

- Working in `modules/` → load `expo:expo-module` and read `docs/references/expo-native-modules.md` first.
- Working on screens or components (`src/app`, `src/components`) → load `expo:expo-ui` and `expo:expo-native-ui` first.

The bundled `expo:*` skills don't know this project's SDK pin — when a skill's example conflicts
with the v57 docs, `AGENTS.md` wins. Confirm any API against the versioned docs before using it.
