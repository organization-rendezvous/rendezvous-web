import { TrendCard } from "./TrendCard";

export function TopicColumn({ topic, onSelectTrend }) {
  return (
    <div className="flex flex-col flex-1 min-w-[260px]">
      <div className="px-3 py-3 mb-0 border-b border-yellow-primary/30">
        <span className="text-base font-bold font-display text-text-primary">
          {topic.name}
        </span>
        <span className="ml-2 text-xs text-text-muted">
          TOP {topic.trends.length}
        </span>
      </div>
      <div className="flex flex-col gap-px bg-bg-border">
        {topic.trends.map((trend) => (
          <TrendCard
            key={trend.trend_id}
            trend={trend}
            onClick={onSelectTrend}
          />
        ))}
      </div>
    </div>
  );
}
