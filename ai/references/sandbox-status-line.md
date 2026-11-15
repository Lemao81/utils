# Sandbox status line

## Why

The sandbox image registers `/usr/local/bin/sbx-claude-hook claude-status` as Claude Code's `statusLine` command. That hook forwards the session JSON to the sandbox app (session titles, cost, context) and prints nothing, so the terminal shows no status line. Claude Code runs a single `statusLine` command, so the sandbox replaces it with a wrapper that feeds the image's hook first and then renders the status line specified below.

## Check

The setup is complete when `jq -r .statusLine.command ~/.claude/settings.json` prints `~/.claude/statusline.sh` (as an absolute path) and that file is executable. Otherwise run every setup step below; each is safe to repeat.

## Setup

1. **Previous command.** Read `.statusLine.command` from `~/.claude/settings.json`. Unless it already names `statusline.sh`, it is the command the wrapper keeps feeding; on the current image that is `/usr/local/bin/sbx-claude-hook claude-status`.

2. **Renderer.** Write `~/.claude/statusline-render.py`: it reads the session JSON on stdin and prints the line from the spec below (`python3` is in the image).

3. **Wrapper.** Write `~/.claude/statusline.sh` and make it executable. It reads stdin once, pipes it to the previous command with that command's output discarded, then pipes it to the renderer:

   ```sh
   #!/bin/sh
   input=$(cat)
   printf '%s' "$input" | <previous command> >/dev/null 2>&1
   printf '%s' "$input" | python3 "$HOME/.claude/statusline-render.py"
   ```

   The image's hook detaches its network work and returns at once, so it never delays the render.

4. **Register.** Merge into `~/.claude/settings.json`, keeping every other key: `"statusLine": { "type": "command", "command": "<absolute path of ~/.claude/statusline.sh>", "padding": 0 }`.

Done when the check above succeeds and both fixtures below render exactly as shown (colors aside).

## Spec

Single line, segments joined by the separator, e.g. `Opus 5.5 (high) default │ ▓▓░░░░░░░░░░░░░░░░░░12% of 1M │ 5h: 8% │ 7d: 1% │ $1.23 │ ImageCreator`. Colors are 256-color codes unless noted.

- Separator ` │ ` (box-drawing `│`) in light grey 250.
- Model display name and effort in parentheses, pale gold 223; then output style in default color.
- Context bar: 20 chars, `▓` used, `░` free (dimmed), percentage directly after; standard ANSI green <50%, yellow 50–79%, red ≥80%.
- `of <size>` for the context window size (`1M`, `1.5M`, `200k`), grey 248.
- `5h: <n>%` and `7d: <n>%` rate limits, percentages only, colored by the same thresholds in 114 / 229 / 210. Until a window's usage is known (Claude Code sends it only after the first API response of a session), show a dimmed `–` in place of `<n>%`, e.g. `5h: –`.
- Session cost right after the rate limits: `$<amount>` with two decimals, darkish yellow 136. While no cost is known yet (missing or 0), show a dimmed `–` instead.
- Current directory name (last path segment), light grey 253.
- Omit any segment without data, including its separator, except the rate limits and the session cost, which show the placeholder instead.
- No padding.

## Session JSON fields

| Segment | Field |
| --- | --- |
| Model | `model.display_name` |
| Effort | `effort.level` |
| Output style | `output_style.name` |
| Context percentage | `context_window.used_percentage` |
| Context size | `context_window.context_window_size` |
| Rate limits | `rate_limits.five_hour.used_percentage`, `rate_limits.seven_day.used_percentage` |
| Cost | `cost.total_cost_usd` (the client-side estimate at API list prices) |
| Directory | `workspace.current_dir` |

## Fixtures

Full session:

```sh
echo '{"model":{"display_name":"Opus 5.5"},"effort":{"level":"high"},"output_style":{"name":"default"},"context_window":{"used_percentage":12,"context_window_size":1000000},"rate_limits":{"five_hour":{"used_percentage":8},"seven_day":{"used_percentage":1}},"cost":{"total_cost_usd":1.234},"workspace":{"current_dir":"/c/MyProjects/ImageCreator"}}' | ~/.claude/statusline.sh
```

`Opus 5.5 (high) default │ ▓▓░░░░░░░░░░░░░░░░░░12% of 1M │ 5h: 8% │ 7d: 1% │ $1.23 │ ImageCreator`

Fresh session, before the first API response:

```sh
echo '{"model":{"display_name":"Opus 5.5"},"workspace":{"current_dir":"/c/MyProjects/ImageCreator"}}' | ~/.claude/statusline.sh
```

`Opus 5.5 │ 5h: – │ 7d: – │ – │ ImageCreator`
