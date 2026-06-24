import { useState, useEffect } from "react";
import StyleableText from "./StyleableText";

// ── 키워드 인라인 편집 ────────────────────────────────
export default function EditableKeywords({
  keywords,
  styles,
  hoveredComment,
  textRef,
  onMouseUp,
  onSave,
  COLOR_MAP,
}) {
  const [editing, setEditing] = useState(false);
  // 편집 시 쉼표 구분 문자열로
  const [draft, setDraft] = useState((keywords ?? []).join(", "));
  const keywordsText = (keywords ?? []).join(" ");

  useEffect(() => {
    if (!editing) setDraft((keywords ?? []).join(", "));
  }, [keywords, editing]);

  const save = () => {
    setEditing(false);
    const next = draft
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    onSave(next);
  };
  const cancel = () => {
    setEditing(false);
    setDraft((keywords ?? []).join(", "));
  };

  return (
    <div className="mb-6 group">
      <div className="flex items-center justify-between mb-2">
        <p className="section-label">키워드</p>
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
        <div>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            autoFocus
            placeholder="쉼표로 구분 (예: AI, 반도체, 미국)"
            className="w-full px-3 py-2 text-sm border outline-none bg-bg-card border-yellow-primary/30 text-text-primary focus:border-yellow-primary/60"
          />
          <p className="text-[10px] text-text-muted mt-1">
            쉼표로 키워드를 구분하세요
          </p>
        </div>
      ) : (
        <div
          ref={textRef}
          data-section="keywords"
          onMouseUp={onMouseUp}
          className="flex flex-wrap gap-2 select-text cursor-text"
          style={{ userSelect: "text" }}
        >
          {/* 서식 적용을 위해 전체 텍스트 기준으로 렌더링 후 키워드 뱃지처럼 표시 */}
          {(keywords ?? []).map((kw, idx) => {
            const kwStart = (keywords ?? [])
              .slice(0, idx)
              .reduce((acc, k) => acc + k.length + 1, 0); // +1 for space
            const kwEnd = kwStart + kw.length;
            const kwStyles = (styles ?? [])
              .filter((s) => s.start_offset < kwEnd && s.end_offset > kwStart)
              .map((s) => ({
                ...s,
                start_offset: Math.max(s.start_offset - kwStart, 0),
                end_offset: Math.min(s.end_offset - kwStart, kw.length),
              }));
            const kwHovered = hoveredComment
              ? hoveredComment.start < kwEnd && hoveredComment.end > kwStart
                ? {
                    start: Math.max(hoveredComment.start - kwStart, 0),
                    end: Math.min(hoveredComment.end - kwStart, kw.length),
                  }
                : null
              : null;

            return (
              <span
                key={kw + idx}
                className="inline-block px-2 py-1 text-xs border border-bg-border font-display"
              >
                <StyleableText
                  text={kw}
                  styles={kwStyles}
                  hoveredComment={kwHovered}
                  textRef={null}
                  onMouseUp={null}
                  sectionKey={null}
                  COLOR_MAP={COLOR_MAP}
                />
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
