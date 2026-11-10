# Maestro E2E tests

Flows live in `.maestro/`: one flow per top-level file, shared steps in `.maestro/subflows/`. The sandbox has no device, so the user runs them on the Windows host, with Metro served by `pnpm android:start:dev`.

## Handing a run to the user

- All flows: `pnpm test:e2e`. The script clears `maestro-output/` first.
- One flow: delete `maestro-output/` yourself, then hand over `maestro test .maestro/<flow>.yaml --debug-output maestro-output --flatten-debug-output`.

Either way `maestro-output/` in the repo root holds only the latest run's debug output. Git ignores it, and the sandbox reads it like any repo file.

## Diagnosing a reported failure

When the user reports a failed flow, read its evidence in `maestro-output/<flow>/` before naming a cause. Done when the screenshot or the screen hierarchy shows the cause; the one-line failure the user pastes only names the step.

1. **Find the failed step** in `commands.json`, which holds every command with its `metadata.status` (`COMPLETED`, `FAILED`, `SKIPPED`) and `metadata.error.message`:
   ```sh
   node -e 'for (const x of JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))) { const k = Object.keys(x.command)[0]; console.log(k, JSON.stringify(x.command[k]).slice(0, 120), "=>", x.metadata?.status, x.metadata?.error?.message ?? "") }' maestro-output/<flow>/commands.json
   ```
2. **See the screen** at the failed step: `screenshots/step-<n>-*.png` (open it with Read) and `screen-hierarchy/step-<n>-*.json` (every element's text, resource id and bounds). Maestro saves both only for the failed step.
3. **Check the logs** when the screen gives no answer: `logs/device-logcat.txt` for crashes and JS errors, `logs/maestro.log` for Maestro's own steps.
