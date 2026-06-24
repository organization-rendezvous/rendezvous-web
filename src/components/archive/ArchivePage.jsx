import { useState, useEffect } from "react";
import { api } from "../../api/index";
import { ArchiveCard } from "./ArchiveCard";

const TOPICS = [
  "전체",
  "기술",
  "AI",
  "개발도구",
  "보안",
  "사회",
  "국제",
  "문화/생활",
];

export function ArchivePage({ onSelectArchive }) {
  const [items, setItems] = useState([]);
  const [topic, setTopic] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const SIZE = 9;

  useEffect(() => {
    setLoading(true);
    api.archive
      .archiveList({ topic: topic || undefined, page, size: SIZE })
      .then((data) => {
        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [topic, page]);

  const totalPages = Math.max(1, Math.ceil(total / SIZE));

  const handleTopic = (t) => {
    setTopic(t === "전체" ? null : t);
    setPage(1);
  };

  return (
    <div className="max-w-5xl px-6 py-6 mx-auto animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold font-display text-text-primary">
            보관함
          </h2>
          <p className="text-xs text-text-muted mt-0.5">총 {total}개</p>
        </div>
      </div>

      {/* 토픽 필터 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TOPICS.map((t) => {
          const active = (t === "전체" && !topic) || t === topic;
          return (
            <button
              key={t}
              onClick={() => handleTopic(t)}
              className={`text-xs px-3 py-1.5 border font-display transition-colors ${
                active
                  ? "border-yellow-primary bg-yellow-muted text-yellow-primary"
                  : "border-bg-border text-text-secondary hover:border-yellow-primary/30 hover:text-text-primary"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <span className="text-sm text-text-secondary animate-pulse-slow">
            불러오는 중...
          </span>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <p className="text-sm text-text-secondary">보관된 뉴스가 없어요</p>
          <p className="text-xs text-text-muted">
            트렌드 상세 화면에서 북마크 버튼을 눌러 보관하세요
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ArchiveCard
              key={item.archive_id}
              item={item}
              onClick={onSelectArchive}
            />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs font-display border border-bg-border text-text-secondary
                       hover:border-yellow-primary/40 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 text-xs font-display border transition-colors ${
                p === page
                  ? "border-yellow-primary text-yellow-primary bg-yellow-muted"
                  : "border-bg-border text-text-secondary hover:border-yellow-primary/40 hover:text-text-primary"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-xs font-display border border-bg-border text-text-secondary
                       hover:border-yellow-primary/40 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
