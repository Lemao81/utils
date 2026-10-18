## General Notes

This file is shared across projects. Apart from current project descriptions, any technology it names only defines how to work *if* that technology is used; its mention is not a sign that this project uses it or should. Feature planning should reason from the actual code, its requirements and the decisions made with the user.

## Tooling

- Use pnpm as frontend package manager (`pnpm-lock.yaml`, `pnpm-workspace.yaml`).

## Agent Instructions

- In this sandbox, tools run from its own Linux `node_modules`, bind-mounted over the repo's shared one. Before the first tool run of a session, check `mountpoint -q node_modules`; when it fails, set the sandbox up per `docs/references/sandbox-node-modules.md` first.
- Run pnpm here only on the mounted `node_modules`, and install only with `pnpm install --frozen-lockfile`. To change dependencies, edit `package.json` and tell the user to run the install on the host; run the frozen install here too whenever the user reports an install on the host, or `[ pnpm-lock.yaml -nt node_modules/.modules.yaml ]` holds before a tool run.
- Leave `electron` and `electron-forge` to the host.
- If the project uses Biome: whenever you have edited files it checks, run `biome check --write` before handing back to the user.
- Fix every finding a check reports, whether from your own run or a failed pre-commit hook, in the code; after a hook failure, re-stage and retry the commit. Ask first before a suppression comment, a linter config change, `--no-verify`, a fix that changes behaviour, or an edit to files outside the commit.
- When a commit prints that a hook `was ignored because it's not set as executable`, run `chmod +x` on that hook, then `git hook run <hook>` to check the commit it skipped, and report both to the user.
- Never execute `git commit` on your own without explicit instruction. After explicit instruction, commit directly to main — this is a solo project and does not use feature branches.
- After executing a commit, stop. Never start the next task or planned commit automatically — wait for the user to say so.
- After creating a file that belongs in the repository, run `git add` on it right away so it is tracked rather than left untracked.
- When the entire user message is `coa`, treat it as the command `commit all`.
- When the entire user message is `moveon`, treat it as the command "Move on with the plan".
- When asked to print your last response to answers (`print last response to answers`), append that response as Markdown to `ANSWERS.md` in the repo root. Start the entry with a line holding the current timestamp (`## YYYY-MM-DD HH:MM`).

## Code Style

- General:
  - Never add comments, except tool-control directive comments when explicitly instructed — e.g. suppression/ignore/pragma comments for linters, formatters, type-checkers, or static analyzers.
- package.json:
    - Prefix script names with a short tag for the tool it runs, followed by a colon (`bm:check`, `db:migrate`, `docker:up`). Scripts for the core build toolchain and for tests keep plain names (`start`, `typecheck`, `test:e2e`).
- Markdown:
    - Never hard-wrap text. Write each paragraph, bullet point or table cell as one line, however long, and leave wrapping to the viewer. Line breaks belong only between separate elements (paragraphs, list items, headings, code blocks).

## References

- Writing TypeScript → read `docs/references/typescript-code-style.md` first.
- Writing C# → read `docs/references/csharp-code-style.md` first.
- Writing Cypress tests → read `docs/references/cypress-tests.md` first.
- Working with shadcn/ui → read `docs/references/shadcn.md` first.
- Adding or changing an API endpoint → read `docs/references/api-endpoints.md` first.
- Starting a feature or writing its issues and plan → read `docs/references/feature-start-issue-tracker.md` first.
- Moving on with the plan → read `docs/references/move-on-with-the-plan.md` first.

## Agent skills

### Agent documents

Before editing CLAUDE.md, AGENTS.md, a skill, or a doc one of them points to, load `writing-for-agents`.

### Commits

Before committing, load `commit-messages`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root, created lazily. See `docs/agents/domain.md`.
