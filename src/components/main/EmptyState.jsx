const PERIOD_LABEL = {
  "24h": "최근 24시간",
  "7d": "최근 7일",
  "30d": "최근 30일",
};

export function EmptyState({ onAnalyze, settings, isLoading }) {
  const allTopics = settings
    ? [...(settings.enabled_topics ?? []), ...(settings.custom_topics ?? [])]
    : ["개발", "AI", "문화/생활", "사회", "국제"];

  const periodLabel = settings
    ? (PERIOD_LABEL[settings.period] ?? settings.period)
    : "최근 24시간";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 animate-fade-in">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <div className="inline-flex flex-wrap items-center justify-center gap-1 mb-4">
            {allTopics.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 border border-bg-border text-text-secondary font-display"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">
            AI가 수집한 정보를 분석해
            <br />
            <span className="text-text-primary">
              지금 무엇이 주목받는지
            </span>{" "}
            알려드립니다
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className="px-8 py-4 text-sm font-bold tracking-wider transition-colors duration-150 bg-yellow-primary text-bg-base font-display hover:bg-yellow-text disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "불러오는 중..." : "오늘의 트렌드 확인하기"}
        </button>

        <div className="flex flex-col gap-1 mt-6 text-xs text-text-muted">
          <span>분석 기간 · {periodLabel}</span>
          <span>결과 · Top {settings?.result_limit ?? 5}</span>
          {settings?.enabled_sources?.length > 0 && (
            <span>출처 · {settings.enabled_sources.join(", ")}</span>
          )}
        </div>
      </div>
    </div>
  );
}
