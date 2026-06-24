import { useState, useEffect } from "react";
import { api } from "../../api/index";
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

function BookmarkButton({ trendId, title }) {
  const [isArchived, setIsArchived] = useState(false);
  const [archiveId, setArchiveId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!title) return;
    api.archive
      .archiveCheck(title)
      .then((data) => {
        setIsArchived(data.is_archived);
        setArchiveId(data.archive_id);
      })
      .catch(() => {});
  }, [title]);

  const toggle = async () => {
    setLoading(true);
    try {
      if (isArchived && archiveId) {
        await api.archive.archiveDelete(archiveId);
        setIsArchived(false);
        setArchiveId(null);
      } else {
        const res = await api.archive.archiveSave(trendId);
        setIsArchived(true);
        setArchiveId(res.archive_id);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={isArchived ? "보관 해제" : "보관하기"}
      className={`p-2 transition-colors duration-150 ${
        isArchived
          ? "text-yellow-primary"
          : "text-text-muted hover:text-yellow-primary"
      } disabled:opacity-40`}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill={isArchived ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}

export function TrendDetail({ trendId, onBack }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.trends
      .getTrend(trendId)
      .then(setDetail)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [trendId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-sm text-text-secondary animate-pulse-slow">
          불러오는 중...
        </span>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-sm text-status-error">
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
    <div className="max-w-2xl px-6 py-6 mx-auto animate-slide-up">
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
        <div className="flex flex-col items-center gap-1">
          <div className="text-lg rank-badge w-11 h-11">{detail.rank}</div>

          {detail.is_rising && (
            <span className="text-[10px] font-display font-bold px-1.5 py-0.5 bg-yellow-muted text-yellow-primary border border-yellow-primary/30 whitespace-nowrap mt-6">
              ↑ 급상승
            </span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold leading-tight font-display text-text-primary">
            {detail.title}
          </h1>

          <div className="flex items-center gap-1 mt-2">
            <span className="mr-2 text-sm font-semibold font-display text-yellow-primary">
              {detail.topic}
            </span>

            <span className="text-lg font-bold text-yellow-primary font-display">
              {detail.score.toFixed(1)}
            </span>
          </div>
        </div>
        {/* 보관 버튼 */}
        <BookmarkButton trendId={trendId} title={detail.title} />
      </div>

      {/* Summary */}
      <section className="mb-8">
        <p className="mb-3 section-label">요약</p>
        <div className="p-4 border bg-bg-card border-bg-border">
          <p className="text-sm leading-relaxed text-text-primary">
            {detail.summary}
          </p>
          {detail.detail_summary && (
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {detail.detail_summary}
            </p>
          )}
        </div>
      </section>

      {/* AI 한마디 */}
      {detail.ai_comment && (
        <section className="mb-8">
          <p className="mb-3 section-label">AI 한마디</p>
          <div className="py-1 pl-4 border-l-2 border-yellow-primary">
            <p className="text-sm italic leading-relaxed text-text-secondary">
              {detail.ai_comment}
            </p>
          </div>
        </section>
      )}

      {/* Keywords */}
      {detail.keywords?.length > 0 && (
        <section className="mb-8">
          <p className="mb-3 section-label">키워드</p>
          <div className="flex flex-wrap gap-2">
            {detail.keywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-1 text-xs transition-colors border border-bg-border text-text-secondary font-display hover:border-yellow-primary/40 hover:text-yellow-text"
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
          <p className="mb-3 section-label">점수 상세</p>
          <div className="p-4 border bg-bg-card border-bg-border">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="w-full sm:w-[200px] shrink-0 flex justify-center">
                <ScoreRadar scores={detail.scores} />
              </div>
              <div className="flex flex-col justify-center flex-1 w-full gap-3">
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
          <p className="mb-3 section-label">
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
