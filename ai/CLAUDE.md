## General Notes

Most of this file is shared across projects. Apart from the sections that specifically describe the current project, any technology it names (languages, frameworks, libraries, test tools, linters) only defines how to work *if* that technology is used; its mention is not a sign that this project uses it or should. When planning or choosing technologies for a feature, reason from the project's actual code, its requirements and the decisions made with the user, never from what this file happens to mention.

## Agent Instructions

- Never execute `pnpm install`, `pnpm add`, `pnpm remove`, or any other command that installs/mutates dependencies. Edit `package.json` directly and tell the user to run the install themselves.
- After creating a file that belongs in the repository, run `git add` on it right away so it is tracked rather than left untracked. This stages the file only; it is not a commit and does not relax the rule below. Leave genuinely disposable files unstaged.
- Never execute `git commit` on your own without explicit instruction. After explicit instruction, execute without asking for additional confirmation.
- Commit directly to main — this is a solo project and does not use feature branches. Do not create a branch before committing just because main is the default branch. Committing is still only on instruction.
- After executing a commit, stop. Never start the next task or planned commit automatically — wait for the user to say so.
- In this sandbox, `node_modules` was installed on Windows: `pnpm` is unavailable, `.bin` shims fail, and platform-specific binaries (e.g. Biome's Linux CLI) are missing. Never attempt `npx <tool>`, `pnpm exec <tool>`, `pnpm <script>`, or login-shell fallbacks. To verify changes, run `node node_modules/typescript/bin/tsc --noEmit` (ignore pre-existing errors in unrelated files) and skip lint/format checks — the user runs `pnpm check` on the host.
- When the entire user message is `coa`, treat it as the command `commit all`.
- When the entire user message is `moveon`, treat it as the command "Move on with the plan".

## Code Style
- General:
  - Insert an empty line before `return`, unless it is the first statement in its block.
  - Always brace a control-flow body and put its statement on its own line — never `if (x) return`.
  - Never add comments, except tool-control directive comments when explicitly instructed — e.g. suppression/ignore/pragma comments for linters, formatters, type-checkers, or static analyzers.
  - Preserve a file's existing line endings; write new files with CRLF.
- C#:
  - Tests:
    - Structure tests with the Arrange-Act-Assert pattern, marking each section with an `// Arrange`, `// Act` or `// Assert` comment.
- TypeScript:
  - Name a React component's file in PascalCase (`UserAvatar.tsx`); name every other source file and every folder in kebab-case (`date-format.ts`, `api-client/`). Files and folders whose names define routes under file-based routing are the exception: they follow the router's naming conventions, since renaming them would change the routes (`_layout.tsx`, `index.tsx`, `(tabs)/`, `[id].tsx`, `order-details.tsx`).
  - Declare named functions, including hooks and React components, with the `function` keyword (`function formatPrice(amount: number): string { … }`), never as an arrow function assigned to a `const`. Arrow functions are for inline callbacks only.
  - Omit the braces and `return` when an arrow function body is a single expression, except in React components; keep them where the implicit return would change behaviour, such as a `useEffect` callback, or where it would return a value from a `forEach` callback, such as `Map.set` or `Array.push`.
  - Shorten an inline callback's parameter to the first letter of the last word in its name when the body is a single expression on one line. Keep the full name when the body spans multiple lines, when two parameters would collide on the same letter, when that letter is already bound in scope, or when the parameter is used as a JSX namespace.
  - Add an explicit return type to every named function, except React components; inline callbacks may rely on inference. Omit it where the annotation would only restate an unspellable inferred type.
  - When a returned promise is deliberately not awaited because it cannot reject, prefix the call with `void` (`void preloadCache();`) instead of leaving it bare or adding an empty `.catch`. A promise that can reject must be awaited or have its rejection handled.
  - Use a `type` alias for React component props, never an `interface`.
  - Always use single quotes, matching the Biome config's `quoteStyle`.
  - Import a directory's `index` module by the directory alone — `<dir>`, never `<dir>/index`.
  - Insert an empty line after a multi-line block statement (`if`, `for`, `while`, `do`/`while`, `switch`, `try`/`catch`), unless it is the last statement in its scope. Never insert one before a continuation keyword (`} else {`, `} catch {`, `} finally {`, `} while (…);`).
- Markdown:
    - Never hard-wrap text. Write each paragraph, bullet point or table cell as one line, however long, and leave wrapping to the viewer. Line breaks belong only between separate elements (paragraphs, list items, headings, code blocks).
- Cypress:
  - Select elements only via `cy.get('[data-cy=...]')`; add a `data-cy` attribute to every element a test targets.
  - Keep `it()` titles to a few words naming the main thing, not action→result sentences.

## Agent skills

### Starting a feature

1. `/grill-with-docs <idea>`: answer the numbered question rounds until every decision is settled. Resolved terms go into `CONTEXT.md`, decisions that are hard to reverse into `docs/adr/`.
2. `/to-spec`: confirm the proposed test seams; the conversation becomes `.scratch/<feature>/spec.md`.
3. `/to-tickets`: approve the tracer-bullet breakdown; it becomes one issue file per ticket with its blockers, and `plan.md` is written alongside (see below).
4. "Move on with the plan" implements it step by step.

Each stage is committed only when the user says so.

### Issue tracker

Issues, specs and plans live as local markdown files under `.scratch/<feature>/`; details in `docs/agents/issue-tracker.md`.

- Issues are sized by feature, never shrunk to fit one commit. Each has acceptance criteria and lists its work as numbered `## Steps`; one step is exactly one commit.
- `plan.md` has one heading per issue, linking its file, with its steps below as checkboxes (`- [ ] 1.1 Step title`) in execution order. 📦 marks a step that edits `package.json`; the user runs `pnpm install` before reviewing it.
- Decisions that must wait until work starts go under `## Open decisions (ask the user before starting)`.
- "Move on with the plan": take the next unticked step. At an issue's first step, ask its open decisions first and record the answers in the issue. Do only that step, tick it and stop without committing; the step and its tick are committed together on instruction. Set the issue's `Status:` to `resolved` when its last step is ticked.

### Commits

The repo includes a `commit-messages` skill (`.claude/skills/commit-messages/`, tracked in `skills-lock.json`). Use it whenever you commit. It enforces imperative, capitalized subjects, 72-character wrapping, a body that explains *why*, and atomic commits.

## Claude Code Status Line

On the first turn of a session, if `~/.claude/settings.json` has no `statusLine` entry, set one up without asking — it is pre-approved. Generate a status line command script in `~/.claude/` and register it in `settings.json` (merge; keep existing keys). The status line shows only:

- Context usage as a 20-character progress bar using `▓` (used) and `░` (free), followed by the percentage
- Bar and percentage colored by usage: green below 50%, yellow 50–79%, red 80% and above; the free part of the bar dimmed
- No padding

## Workflows

### Creating/Modifying API endpoints

When adding or changing an API endpoint:

1. Add or update its request in the related project's .http file, with a realistic sample body for POST, PUT and PATCH.
