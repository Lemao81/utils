# TypeScript Code Style

- Name every folder in kebab-case (`api-client/`); folders that define routes under file-based routing follow the router's conventions (`(tabs)/`).
- Shorten an inline callback's parameter to the first letter of the last word in its name when the body is a single expression on one line. Keep the full name when the body spans multiple lines, when two parameters would collide on the same letter, when that letter is already bound in scope, or when the parameter is used as a JSX namespace.
- When a returned promise is deliberately not awaited because it cannot reject, prefix the call with `void` (`void preloadCache()`) instead of leaving it bare or adding an empty `.catch`. A promise that can reject must be awaited or have its rejection handled.
- Name the type a React context holds after the context plus a `Value` suffix: `LessonMoveContext` holds a `LessonMoveContextValue`.
