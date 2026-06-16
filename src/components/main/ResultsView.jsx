import { TopicColumn } from "./TopicColumn";

export function ResultsView({ result, onSelectTrend, onReanalyze }) {
  const topics = result?.topics ?? [];

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between px-6 py-4 border-b border-bg-border">
        <div>
          <span className="section-label">분석 결과</span>
          <p className="text-xs text-text-muted mt-0.5">
            {result?.status === "partial_failed" &&
              "일부 주제 분석이 완료됐습니다"}
          </p>
        </div>
        <button
          onClick={onReanalyze}
          className="text-xs font-display text-text-secondary hover:text-yellow-primary transition-colors border border-bg-border hover:border-yellow-primary/50 px-3 py-1.5"
        >
          다시 분석
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="flex w-full gap-px bg-bg-border">
          {topics.map((topic) => (
            <TopicColumn
              key={topic.topic_id}
              topic={topic}
              onSelectTrend={onSelectTrend}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
