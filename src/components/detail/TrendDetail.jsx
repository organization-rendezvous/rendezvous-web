import { useState, useEffect } from "react";
import { api } from "../../api/client";
import { ScoreBar } from "./ScoreBar";
import { ScoreRadar } from "./ScoreRadar";
import { LinkCard } from "./LinkCard";

const SCORE_LABELS = {
  mention_score: "언급량",
  growth_score: "급상승",
  diversity_score: "출처 다양성",
  influence_score: "영향력",
  recency_score: "최신성",
  ai_importance_score: "AI 중요도",
};

export function TrendDetail({ trendId, onBack }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .getTrend(trendId)
      .then(setDetail)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [trendId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-text-secondary text-sm animate-pulse-slow">
          불러오는 중...
        </span>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-status-error text-sm">
          {error ?? "데이터를 불러올 수 없습니다"}
        </p>
        <button
          onClick={onBack}
          className="text-xs text-text-secondary hover:text-yellow-primary"
        >
          ← 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="animate-slide-up max-w-2xl mx-auto px-6 py-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-yellow-primary transition-colors mb-6"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        목록으로
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="rank-badge text-lg w-11 h-11">{detail.rank}</div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-display text-text-muted">
              {detail.topic}
            </span>
            {detail.is_rising && (
              <span className="text-[10px] font-display font-bold px-1.5 py-0.5 bg-yellow-muted text-yellow-primary border border-yellow-primary/30">
                ↑ 급상승
              </span>
            )}
          </div>
          <h1 className="font-display font-bold text-2xl text-text-primary leading-tight">
            {detail.title}
          </h1>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-yellow-primary font-display font-bold text-lg">
              {detail.score.toFixed(1)}
            </span>
            <span className="text-text-muted text-xs">점</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <section className="mb-8">
        <p className="section-label mb-3">요약</p>
        <div className="bg-bg-card border border-bg-border p-4">
          <p className="text-sm text-text-primary leading-relaxed">
            {detail.summary}
          </p>
          {detail.detail_summary && (
            <p className="text-sm text-text-secondary leading-relaxed mt-2">
              {detail.detail_summary}
            </p>
          )}
        </div>
      </section>

      {/* AI 한마디 */}
      {detail.ai_comment && (
        <section className="mb-8">
          <p className="section-label mb-3">AI 한마디</p>
          <div className="border-l-2 border-yellow-primary pl-4 py-1">
            <p className="text-sm text-text-secondary italic leading-relaxed">
              {detail.ai_comment}
            </p>
          </div>
        </section>
      )}

      {/* Keywords */}
      {detail.keywords?.length > 0 && (
        <section className="mb-8">
          <p className="section-label mb-3">키워드</p>
          <div className="flex flex-wrap gap-2">
            {detail.keywords.map((kw) => (
              <span
                key={kw}
                className="text-xs px-2 py-1 border border-bg-border text-text-secondary font-display hover:border-yellow-primary/40 hover:text-yellow-text transition-colors"
              >
                {kw}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Score breakdown */}
      {detail.scores && (
        <section className="mb-8">
          <p className="section-label mb-3">점수 상세</p>
          <div className="bg-bg-card border border-bg-border p-4">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {/* Radar chart */}
              <div className="w-full sm:w-[200px] shrink-0 flex justify-center">
                <ScoreRadar scores={detail.scores} />
              </div>
              {/* Bar list */}
              <div className="flex-1 w-full flex flex-col gap-3 justify-center">
                {Object.entries(SCORE_LABELS).map(([key, label]) => (
                  <ScoreBar
                    key={key}
                    label={label}
                    value={detail.scores[key] ?? 0}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Links */}
      {detail.links?.length > 0 && (
        <section className="mb-8">
          <p className="section-label mb-3">
            관련 자료 · {detail.links.length}
          </p>
          <div className="flex flex-col gap-px bg-bg-border">
            {detail.links.map((link, i) => (
              <LinkCard key={i} link={link} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
