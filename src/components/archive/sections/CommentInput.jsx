export function CommentInput({ visible, value, onChange, onAdd, onCancel }) {
  if (!visible) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b bg-bg-card border-bg-border animate-fade-in">
      <span className="text-[10px] text-text-muted font-display shrink-0">
        주석
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
        placeholder="주석 내용 입력 후 Enter..."
        autoFocus
        className="flex-1 bg-bg-elevated border border-bg-border px-3 py-1.5 text-xs text-text-primary outline-none focus:border-yellow-primary/50"
      />

      <button
        onClick={onAdd}
        className="px-3 py-1.5 bg-yellow-primary text-bg-base text-xs font-display font-bold hover:bg-yellow-text transition-colors"
      >
        추가
      </button>

      <button
        onClick={onCancel}
        className="text-xs text-text-muted hover:text-text-secondary"
      >
        취소
      </button>
    </div>
  );
}
