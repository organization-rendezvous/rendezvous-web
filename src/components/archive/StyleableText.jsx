import StyledSpan from "./StyledSpan";

// ── offset 기반 텍스트 청크 분리 ──────────────────────
function applyStylesToText(text, styles, hoveredCommentOffsets) {
  if (!text) return [];
  if (!styles?.length && !hoveredCommentOffsets) {
    return [{ text, start: 0, end: text.length, styles: [], isHovered: false }];
  }

  const allStyles = styles ?? [];
  const events = new Set([0, text.length]);
  allStyles.forEach((s) => {
    events.add(s.start_offset);
    events.add(s.end_offset);
  });
  if (hoveredCommentOffsets) {
    events.add(hoveredCommentOffsets.start);
    events.add(hoveredCommentOffsets.end);
  }
  const sorted = [...events].sort((a, b) => a - b);

  return sorted.slice(0, -1).map((start, i) => {
    const end = sorted[i + 1];
    const activeStyles = allStyles.filter(
      (s) => s.start_offset <= start && s.end_offset >= end,
    );
    const isHovered = hoveredCommentOffsets
      ? hoveredCommentOffsets.start <= start && hoveredCommentOffsets.end >= end
      : false;
    return {
      text: text.slice(start, end),
      start,
      end,
      styles: activeStyles,
      isHovered,
    };
  });
}

// ── 서식 적용 가능한 텍스트 영역 ──────────────────────
export default function StyleableText({
  text,
  styles,
  hoveredComment,
  textRef,
  onMouseUp,
  sectionKey,
  COLOR_MAP,
}) {
  const chunks = applyStylesToText(text, styles, hoveredComment);
  return (
    <div
      ref={textRef}
      data-section={sectionKey}
      onMouseUp={onMouseUp}
      className="text-sm leading-relaxed whitespace-pre-wrap select-text text-text-primary cursor-text"
      style={{ userSelect: "text" }}
    >
      {chunks.map((chunk, i) => (
        <StyledSpan key={i} chunk={chunk} COLOR_MAP={COLOR_MAP} />
      ))}
    </div>
  );
}
