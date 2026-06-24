import { useState, useEffect } from "react";
import StyleableText from "./StyleableText";

// ── 인라인 편집 가능한 텍스트 블록 (서식 적용 포함) ──
export default function EditableStyledBlock({
  label,
  sectionKey,
  value,
  styles,
  hoveredComment,
  textRef,
  onMouseUp,
  onSave,
  renderContent, // 커스텀 렌더 (없으면 기본 StyleableText)
  COLOR_MAP,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  // value가 외부에서 바뀔 때 draft 동기화 (편집 중 아닐 때)
  useEffect(() => {
    if (!editing) setDraft(value ?? "");
  }, [value, editing]);

  const save = () => {
    setEditing(false);
    onSave(draft);
  };
  const cancel = () => {
    setEditing(false);
    setDraft(value ?? "");
  };

  return (
    <div className="mb-6 group">
      <div className="flex items-center justify-between mb-2">
        {label && <p className="section-label">{label}</p>}
        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={save}
              className="text-xs font-display text-yellow-primary hover:text-yellow-text"
            >
              확인
            </button>
            <button
              onClick={cancel}
              className="text-xs font-display text-text-muted hover:text-text-secondary"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-xs transition-colors opacity-0 font-display text-text-muted hover:text-yellow-primary group-hover:opacity-100"
          >
            수정
          </button>
        )}
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
          className="w-full px-3 py-2 text-sm leading-relaxed border outline-none resize-none bg-bg-card border-yellow-primary/30 text-text-primary focus:border-yellow-primary/60"
          rows={Math.max(3, draft.split("\n").length + 1)}
        />
      ) : renderContent ? (
        renderContent()
      ) : (
        <div className="p-4 border bg-bg-card border-bg-border">
          <StyleableText
            text={value}
            styles={styles}
            hoveredComment={hoveredComment}
            textRef={textRef}
            onMouseUp={onMouseUp}
            sectionKey={sectionKey}
            COLOR_MAP={COLOR_MAP}
          />
        </div>
      )}
    </div>
  );
}
