const STEP_LABELS = {
  pending: "대기 중",
  collecting: "데이터 수집 중",
  cleaning: "데이터 정제 중",
  clustering: "트렌드 후보 생성 중",
  scoring: "점수 계산 중",
  summarizing: "설명 생성 중",
  saving: "저장 중",
  completed: "완료",
  failed: "실패",
};

function TopicRow({ topic }) {
  const isCompleted = topic.status === "completed";
  const isFailed = topic.status === "failed";

  return (
    <div className="flex items-center justify-between py-3 border-b border-bg-border last:border-0">
      <span className="font-display font-medium text-sm text-text-primary">
        {topic.name}
      </span>
      <div className="flex items-center gap-2">
        {!isCompleted && !isFailed && (
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-primary animate-pulse-slow" />
        )}
        <span
          className={`text-xs font-display ${
            isCompleted
              ? "text-status-success"
              : isFailed
                ? "text-status-error"
                : "text-yellow-primary"
          }`}
        >
          {STEP_LABELS[topic.status] || topic.status}
        </span>
      </div>
    </div>
  );
}

export function AnalysisProgress({ jobStatus }) {
  const progress = jobStatus?.progress ?? 0;
  const topics = jobStatus?.topics ?? [];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="section-label">분석 진행 중</span>
            <span className="font-display font-bold text-yellow-primary text-sm">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="score-bar-track">
            <div className="score-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-bg-card border border-bg-border p-4">
          {topics.length > 0 ? (
            topics.map((t) => <TopicRow key={t.topic_id} topic={t} />)
          ) : (
            <div className="py-3 text-text-secondary text-sm text-center">
              분석 준비 중...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
