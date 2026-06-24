// ── 툴바 ──────────────────────────────────────────────
const HIGHLIGHT_COLORS = [
  { value: "yellow", label: "노랑", hex: "#F5C518" },
  { value: "red", label: "빨강", hex: "#EF4444" },
  { value: "green", label: "초록", hex: "#22C55E" },
  { value: "blue", label: "파랑", hex: "#60A5FA" },
];

const TEXT_COLORS = [
  { value: "yellow", label: "노랑", hex: "#F5C518" },
  { value: "red", label: "빨강", hex: "#EF4444" },
  { value: "green", label: "초록", hex: "#22C55E" },
  { value: "blue", label: "파랑", hex: "#60A5FA" },
];

export default function Toolbar({ onApply, onComment, hasSelection }) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b bg-bg-card border-bg-border">
      <span className="text-[10px] text-text-muted font-display mr-1">
        서식
      </span>

      <button
        onClick={() => onApply({ style_type: "bold", style_value: null })}
        className={`px-3 py-1.5 text-sm font-bold border font-display transition-colors ${
          hasSelection
            ? "border-bg-border text-text-secondary hover:border-yellow-primary/50 hover:text-yellow-primary"
            : "border-bg-border text-text-muted cursor-not-allowed opacity-40"
        }`}
        title="굵게"
      >
        B
      </button>

      <button
        onClick={() => onApply({ style_type: "underline", style_value: null })}
        className={`px-3 py-1.5 text-sm underline border font-display transition-colors ${
          hasSelection
            ? "border-bg-border text-text-secondary hover:border-yellow-primary/50 hover:text-yellow-primary"
            : "border-bg-border text-text-muted cursor-not-allowed opacity-40"
        }`}
        title="밑줄"
      >
        U
      </button>

      <div className="w-px h-5 mx-1 bg-bg-border" />

      <span className="text-[10px] text-text-muted font-display">
        하이라이트
      </span>
      {HIGHLIGHT_COLORS.map((c) => (
        <button
          key={c.value}
          onClick={() =>
            onApply({ style_type: "highlight", style_value: c.value })
          }
          className={`w-6 h-6 border transition-colors ${hasSelection ? "hover:border-yellow-primary/50" : "cursor-not-allowed opacity-40"} border-bg-border`}
          style={{ backgroundColor: c.hex + "60" }}
          title={`${c.label} 하이라이트`}
        />
      ))}

      <div className="w-px h-5 mx-1 bg-bg-border" />

      <span className="text-[10px] text-text-muted font-display">글자색</span>
      {TEXT_COLORS.map((c) => (
        <button
          key={c.value}
          onClick={() => onApply({ style_type: "color", style_value: c.value })}
          className={`w-6 h-6 border transition-colors ${hasSelection ? "hover:border-yellow-primary/50" : "cursor-not-allowed opacity-40"} border-bg-border flex items-center justify-center`}
          title={`${c.label} 글자색`}
        >
          <span
            className="text-xs font-bold font-display"
            style={{ color: c.hex }}
          >
            A
          </span>
        </button>
      ))}

      <div className="w-px h-5 mx-1 bg-bg-border" />

      <button
        onClick={onComment}
        className={`px-3 py-1.5 text-[10px] border font-display transition-colors ${
          hasSelection
            ? "border-bg-border text-text-secondary hover:border-yellow-primary/50 hover:text-yellow-primary"
            : "border-bg-border text-text-muted cursor-not-allowed opacity-40"
        }`}
      >
        주석 추가
      </button>
    </div>
  );
}
