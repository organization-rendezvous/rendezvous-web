import { useState } from "react";

// ── 주석 아이템 ────────────────────────────────────────
export default function CommentItem({ comment, onUpdate, onDelete, onHover }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(comment.content);

  const save = async () => {
    await onUpdate(comment.comment_id, val);
    setEditing(false);
  };

  return (
    <div
      className="p-3 text-xs transition-colors border cursor-default bg-bg-elevated border-bg-border hover:border-yellow-primary/40"
      onMouseEnter={() =>
        onHover({ start: comment.start_offset, end: comment.end_offset })
      }
      onMouseLeave={() => onHover(null)}
    >
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full bg-bg-card border border-bg-border px-2 py-1.5 text-xs text-text-primary outline-none focus:border-yellow-primary/50 resize-none"
            rows={3}
          />
          <div className="flex gap-1">
            <button
              onClick={save}
              className="px-2 py-1 text-xs font-bold bg-yellow-primary text-bg-base font-display"
            >
              저장
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-2 py-1 text-xs border border-bg-border text-text-muted font-display"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-2 leading-relaxed text-text-primary">
            {comment.content}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="text-xs transition-colors text-text-muted hover:text-yellow-primary"
            >
              수정
            </button>
            <button
              onClick={() => onDelete(comment.comment_id)}
              className="text-[10px] text-text-muted hover:text-status-error transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
