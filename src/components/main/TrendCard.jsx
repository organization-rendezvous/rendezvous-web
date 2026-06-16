export function TrendCard({ trend, onClick }) {
  return (
    <div className="trend-card" onClick={() => onClick(trend)}>
      <div className="flex items-start gap-3">
        <div className="rank-badge">{trend.rank}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-semibold text-sm text-text-primary truncate">
              {trend.title}
            </h3>
            {trend.is_rising && (
              <span className="shrink-0 text-[10px] font-display font-bold px-1.5 py-0.5 bg-yellow-muted text-yellow-primary border border-yellow-primary/30">
                ↑ 급상승
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
            {trend.summary}
          </p>
          <div className="mt-2 flex items-center gap-1">
            <div className="h-0.5 bg-yellow-primary/20 flex-1 max-w-[80px]">
              <div
                className="h-full bg-yellow-primary/60"
                style={{ width: `${Math.min(trend.score, 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-display text-yellow-dim">
              {trend.score.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
