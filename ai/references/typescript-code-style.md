# TypeScript Code Style

- Name a React component's file in PascalCase (`UserAvatar.tsx`); name every other source file and every folder in kebab-case (`date-format.ts`, `api-client/`). Files and folders whose names define routes under file-based routing are the exception: they follow the router's naming conventions, since renaming them would change the routes (`_layout.tsx`, `index.tsx`, `(tabs)/`, `[id].tsx`, `order-details.tsx`).
- Declare named functions, including hooks and React components, with the `function` keyword (`function formatPrice(amount: number): string { … }`), never as an arrow function assigned to a `const`. Arrow functions are for inline callbacks only.
- Omit the braces and `return` when an arrow function body is a single expression, except in React components; keep them where the implicit return would change behaviour, such as a `useEffect` callback, or where it would return a value from a `forEach` callback, such as `Map.set` or `Array.push`.
- Shorten an inline callback's parameter to the first letter of the last word in its name when the body is a single expression on one line. Keep the full name when the body spans multiple lines, when two parameters would collide on the same letter, when that letter is already bound in scope, or when the parameter is used as a JSX namespace.
- Add an explicit return type to every named function, except React components; inline callbacks may rely on inference. Omit it where the annotation would only restate an unspellable inferred type.
- When a returned promise is deliberately not awaited because it cannot reject, prefix the call with `void` (`void preloadCache()`) instead of leaving it bare or adding an empty `.catch`. A promise that can reject must be awaited or have its rejection handled.
- Use a `type` alias for React component props, never an `interface`.
- Always use single quotes, matching the Biome config's `quoteStyle`.
- Import a directory's `index` module by the directory alone — `<dir>`, never `<dir>/index`.
- Insert an empty line after a multi-line block statement (`if`, `for`, `while`, `do`/`while`, `switch`, `try`/`catch`), unless it is the last statement in its scope. Never insert one before a continuation keyword (`} else {`, `} catch {`, `} finally {`, `} while (…)`).
