# Starting a feature

1. `/grill-with-docs <idea>`: answer the numbered question rounds until every decision is settled. Resolved terms go into `CONTEXT.md`, decisions that are hard to reverse into `docs/adr/`.
2. `/to-spec`: confirm the proposed test seams; the conversation becomes `.scratch/<feature>/spec.md`.
3. `/to-tickets`: approve the tracer-bullet breakdown; it becomes one issue file per ticket with its blockers, and `plan.md` is written alongside (see below).
4. "Move on with the plan" implements it step by step.
Each stage is committed only when the user says so.

# Issue tracker

Issues, specs and plans live as local markdown files under `.scratch/<feature>/`; details in `docs/agents/issue-tracker.md`.
- Issues are sized by feature, never shrunk to fit one commit. Each has acceptance criteria and lists its work as numbered `## Steps`; one step is exactly one commit.
- `plan.md` has one heading per issue, linking its file, with its steps below as checkboxes (`- [ ] 1.1 Step title`) in execution order. 📦 marks a step that edits `package.json`; the user runs `pnpm install` before reviewing it.
- Decisions that must wait until work starts go under `## Open decisions (ask the user before starting)`.
- "Move on with the plan": take the next unticked step. At an issue's first step, ask its open decisions first and record the answers in the issue. Do only that step, tick it and stop without committing; the step and its tick are committed together on instruction. Set the issue's `Status:` to `resolved` when its last step is ticked.
- After committing a plan step, end with a code block of `🟢 Finished: <step>` and `🟡 Next:     <next unticked step, or none>`, steps as number and title, values aligned.
