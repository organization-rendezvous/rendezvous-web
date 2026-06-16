export function ScoreBar({ label, value, max = 100 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-text-secondary w-20 shrink-0">{label}</span>
      <div className="flex-1 score-bar-track">
        <div className="score-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-display text-yellow-primary w-10 text-right">
        {value.toFixed(0)}
      </span>
    </div>
  );
}
