import { useState, useEffect } from "react";

// ── 제목 인라인 편집 ──────────────────────────────────
export default function EditableTitle({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

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

  if (editing) {
    return (
      <div className="mt-2 mb-1">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
          className="w-full px-2 py-1 text-xl font-bold leading-tight border outline-none resize-none font-display bg-bg-card border-yellow-primary/30 text-text-primary focus:border-yellow-primary/60"
          rows={Math.max(2, draft.split("\n").length + 1)}
        />
        <div className="flex gap-2 mt-1">
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
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 mt-2 mb-1 group">
      <h1 className="flex-1 text-xl font-bold leading-tight font-display text-text-primary">
        {value}
      </h1>
      <button
        onClick={() => setEditing(true)}
        className="mt-1 text-xs transition-colors opacity-0 font-display text-text-muted hover:text-yellow-primary group-hover:opacity-100 shrink-0"
      >
        수정
      </button>
    </div>
  );
}
