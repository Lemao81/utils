const ESC = "\x1b[";
const RESET = `${ESC}0m`;
const fg = (code, text) => `${ESC}38;5;${code}m${text}${RESET}`;
const ansi = (code, text) => `${ESC}${code}m${text}${RESET}`;
const dim = (text) => `${ESC}2m${text}${RESET}`;

const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const band = (pct, [low, mid, high]) => (pct >= 80 ? high : pct >= 50 ? mid : low);

function formatSize(n) {
  if (n >= 1e6) return `${+(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}k`;
  return `${n}`;
}

function modelSegment(d) {
  const name = d.model?.display_name;
  const effort = d.effort?.level;
  const style = d.output_style?.name;
  const head = name ? fg(223, effort ? `${name} (${effort})` : name) : "";
  return [head, style].filter(Boolean).join(" ");
}

function contextSegment(d) {
  const cw = d.context_window ?? {};
  const pct = cw.used_percentage;
  const size = cw.context_window_size;
  const parts = [];
  if (isNum(pct)) {
    const color = band(pct, [32, 33, 31]);
    const filled = Math.min(20, Math.max(0, Math.round(pct / 5)));
    parts.push(
      ansi(color, "▓".repeat(filled)) + dim("░".repeat(20 - filled)) + ansi(color, `${Math.round(pct)}%`)
    );
  }
  if (isNum(size) && size > 0) parts.push(fg(248, `of ${formatSize(size)}`));
  return parts.join(" ");
}

function limitSegment(label, win) {
  const pct = win?.used_percentage;
  const value = isNum(pct) ? fg(band(pct, [114, 229, 210]), `${Math.round(pct)}%`) : dim("–");
  return `${label}: ${value}`;
}

function costSegment(d) {
  const usd = d.cost?.total_cost_usd;
  return isNum(usd) && usd > 0 ? fg(136, `$${usd.toFixed(2)}`) : dim("–");
}

function dirSegment(d) {
  const dir = d.workspace?.current_dir ?? d.cwd;
  if (!dir) return "";
  const name = dir.split(/[\\/]+/).filter(Boolean).pop();
  return name ? fg(253, name) : "";
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  let d = {};
  try {
    d = JSON.parse(raw);
  } catch {}
  const rl = d.rate_limits ?? {};
  const segments = [
    modelSegment(d),
    contextSegment(d),
    limitSegment("5h", rl.five_hour),
    limitSegment("7d", rl.seven_day),
    costSegment(d),
    dirSegment(d),
  ].filter(Boolean);
  process.stdout.write(segments.join(fg(250, " │ ")));
});
