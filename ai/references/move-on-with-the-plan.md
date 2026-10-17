# Move on with the plan

"Move on with the plan" works through a feature's `plan.md` one step per run; one step is exactly one commit. How the plan and its issues are written is in `feature-start-issue-tracker.md`.

1. **Pick** the first unticked step. At an issue's first step, ask the user the issue's open decisions and record the answers in the issue before writing code. Done when the step is named and its issue holds no open decision.
2. **Implement** that step and nothing beyond it. When it turns out too big for one commit, split it: narrow the step to the part this commit delivers, add the rest as new steps right after it, and increment the numbers of the steps that follow, in `plan.md` and the issue's `## Steps` alike. A 📦 step edits `package.json`; tell the user to run `pnpm install` on the host before reviewing it. Done when the step's checks pass.
3. **Tick** its box, and set the issue's `Status:` to `resolved` when this was its last step. Then stop and report the change: the step and its tick are committed together on the user's instruction.
4. **Finish** after committing the step, with a code block of `🟢 Finished: <step>`, `🟡 Next:     <next unticked step, or none>` and `🧩 Skills:   <skills loaded while implementing the step, except commit-messages, or none>`, steps as number and title, values aligned.
