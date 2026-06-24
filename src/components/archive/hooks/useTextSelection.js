import { useCallback, useState } from "react";

export function useTextSelection(data) {
  const [selection, setSelection] = useState(null);

  const getSectionOffset = useCallback(
    (sectionKey) => {
      if (!data) return 0;

      const parts = [];

      if (data.summary)
        parts.push({
          key: "summary",
          text: data.summary,
        });

      if (data.detail_summary)
        parts.push({
          key: "detail",
          text: data.detail_summary,
        });

      if (data.ai_comment)
        parts.push({
          key: "ai",
          text: data.ai_comment,
        });

      if (data.keywords?.length)
        parts.push({
          key: "keywords",
          text: data.keywords.join(" "),
        });

      let offset = 0;

      for (const part of parts) {
        if (part.key === sectionKey) {
          return offset;
        }

        offset += part.text.length + 2;
      }

      return 0;
    },
    [data],
  );

  const handleMouseUp = useCallback(
    (sectionKey, ref) => {
      const sel = globalThis.getSelection();

      if (!sel || sel.isCollapsed) {
        setSelection(null);
        return;
      }

      if (!ref?.current?.contains(sel.anchorNode)) {
        setSelection(null);
        return;
      }

      const range = sel.getRangeAt(0);

      const preRange = document.createRange();

      preRange.setStart(ref.current, 0);

      preRange.setEnd(range.startContainer, range.startOffset);

      const localStart = preRange.toString().length;

      const localEnd = localStart + range.toString().length;

      if (localStart >= localEnd) {
        setSelection(null);
        return;
      }

      const baseOffset = getSectionOffset(sectionKey);

      setSelection({
        sectionKey,
        start: baseOffset + localStart,
        end: baseOffset + localEnd,
      });
    },
    [getSectionOffset],
  );

  const clearSelection = () => {
    setSelection(null);
    globalThis.getSelection()?.removeAllRanges();
  };

  return {
    selection,
    setSelection,

    getSectionOffset,

    handleMouseUp,
    clearSelection,
  };
}
