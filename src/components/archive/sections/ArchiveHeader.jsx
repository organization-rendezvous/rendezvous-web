import EditableTitle from "../EditableTitle";

export function ArchiveHeader({
  topic,
  title,
  savedAt,

  selection,

  onBack,
  onTitleSave,
}) {
  return (
    <>
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
        보관함으로
      </button>

      <div className="mb-6">
        <span className="text-[10px] font-display text-yellow-primary border border-yellow-primary/30 px-1.5 py-0.5">
          {topic}
        </span>

        <EditableTitle value={title} onSave={onTitleSave} />

        <p className="text-xs text-text-muted">
          보관일 {new Date(savedAt).toLocaleDateString("ko-KR")}
        </p>
      </div>

      <p
        className={`text-[10px] mb-3 font-display transition-colors ${
          selection ? "text-yellow-primary" : "text-text-muted"
        }`}
      >
        {selection
          ? `${selection.end - selection.start}자 선택됨 · 툴바에서 서식/주석을 적용하세요`
          : "텍스트를 드래그하면 서식과 주석을 적용할 수 있어요"}
      </p>
    </>
  );
}
