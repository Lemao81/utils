## General Notes

This file is shared across projects. Apart from current project descriptions, any technology it names only defines how to work *if* that technology is used; its mention is not a sign that this project uses it or should. Feature planning should reason from the actual code, its requirements and the decisions made with the user.

## Tooling

- Use pnpm as frontend package manager (`pnpm-lock.yaml`, `pnpm-workspace.yaml`).

## Agent Instructions

- `node_modules` is installed on the Windows host and shared with this sandbox; that install also fetches the Linux native binaries. Never run `pnpm`, `npx`, `electron`, `electron-forge` or any install command here; call tools via `node_modules/.bin/<tool>`. To change dependencies, edit `package.json` and tell the user to run the install.
- If the project uses Biome: whenever you have edited files it checks, run `biome check --write` before handing back to the user, and fix whatever it still reports in the code; never silence a finding by suppression or by changing `biome.json` without asking.
- If the project uses shadcn/ui: never write component code yourself; to add or update components, give the user the `pnpm shadcn add <components>` command (with `--overwrite` for updates, naming any local edits it discards, since formatting makes `--diff` useless) and wait until they have run it. Then format the files and stage them by explicit path. Read-only CLI calls (`docs`, `search`, `view`, `--dry-run`) are fine.
- Never execute `git commit` on your own without explicit instruction. After explicit instruction, commit directly to main — this is a solo project and does not use feature branches.
- After executing a commit, stop. Never start the next task or planned commit automatically — wait for the user to say so.
- After creating a file that belongs in the repository, run `git add` on it right away so it is tracked rather than left untracked.
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
- package.json:
    - Prefix script names with a short tag for the tool it runs, followed by a colon (`bm:check`, `db:migrate`, `docker:up`). Scripts for the core build toolchain and for tests keep plain names (`start`, `typecheck`, `test:e2e`).
- Markdown:
    - Never hard-wrap text. Write each paragraph, bullet point or table cell as one line, however long, and leave wrapping to the viewer. Line breaks belong only between separate elements (paragraphs, list items, headings, code blocks).
- Cypress:
  - Select elements only via `cy.get('[data-cy=...]')`; add a `data-cy` attribute to every element a test targets.
  - Keep `it()` titles to a few words naming the main thing, not action→result sentences.
 
## TypeScript Code Style

Reference `docs/references/typescript-code-style.md` for detailed TypeScript code style guide.

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
- After committing a plan step, end with a code block of `🟢 Finished: <step>` and `🟡 Next:     <next unticked step, or none>`, steps as number and title, values aligned.

### Commits

The repo includes a `commit-messages` skill (`.claude/skills/commit-messages/`, tracked in `skills-lock.json`). Use it whenever you commit.

## Workflows

### Creating/Modifying API endpoints

When adding or changing an API endpoint:

1. Add or update its request in the related project's .http file, with a realistic sample body for POST, PUT and PATCH.
