const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "오늘";
  if (d === 1) return "어제";
  return `${d}일 전`;
};

export function ArchiveCard({ item, onClick }) {
  return (
    <div
      onClick={() => onClick(item)}
      className="relative flex flex-col gap-2 p-4 transition-all duration-150 border cursor-pointer bg-bg-card border-bg-border hover:border-yellow-primary/50 hover:bg-bg-elevated group"
    >
      {/* 왼쪽 보더 hover 효과 */}
      <div className="absolute left-0 top-0 bottom-0 w-0 bg-yellow-primary group-hover:w-0.5 transition-all duration-200" />

      {/* 토픽 + 날짜 */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-display text-yellow-primary border border-yellow-primary/30 px-1.5 py-0.5">
          {item.topic}
        </span>
        <span className="text-[10px] text-text-muted">
          {timeAgo(item.saved_at)}
        </span>
      </div>

      {/* 제목 */}
      <h3 className="text-sm font-semibold leading-snug font-display text-text-primary line-clamp-2">
        {item.title}
      </h3>

      {/* 요약 */}
      {item.summary && (
        <p className="text-xs leading-relaxed text-text-secondary line-clamp-3">
          {item.summary}
        </p>
      )}

      {/* 키워드 */}
      {item.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1 mt-auto">
          {item.keywords.slice(0, 4).map((kw) => (
            <span key={kw} className="text-[10px] text-text-muted font-display">
              #{kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
