export function ArchiveMemoPanel({ memo, memoSaving, onChange }) {
  return (
    <div className="flex flex-col w-56 border-r shrink-0 border-bg-border bg-bg-card">
      <div className="flex items-center justify-between px-3 py-2 border-b border-bg-border">
        <span className="section-label">메모</span>

        {memoSaving && (
          <span className="text-[10px] text-text-muted animate-pulse-slow">
            저장 중...
          </span>
        )}
      </div>

      <textarea
        value={memo}
        onChange={(e) => onChange(e.target.value)}
        placeholder="이 뉴스에 대한 메모를 남기세요..."
        className="flex-1 w-full px-3 py-3 text-xs leading-relaxed bg-transparent outline-none resize-none text-text-secondary placeholder:text-text-muted"
      />
    </div>
  );
}
