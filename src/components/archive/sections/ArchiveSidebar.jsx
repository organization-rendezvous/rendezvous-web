import CommentItem from "../CommentItem";

export function ArchiveSidebar({
  comments,
  onUpdateComment,
  onDeleteComment,
  onHoverComment,
}) {
  return (
    <div className="flex flex-col w-64 overflow-y-auto border-l shrink-0 border-bg-border bg-bg-card">
      <div className="px-3 py-2 border-b border-bg-border">
        <span className="section-label">주석 · {comments?.length ?? 0}</span>
      </div>

      <div className="flex flex-col flex-1 gap-px">
        {!comments?.length ? (
          <div className="flex items-center justify-center flex-1 px-3">
            <p className="text-[10px] text-text-muted text-center leading-relaxed">
              텍스트를 드래그한 뒤
              <br />
              주석 버튼을 눌러 추가하세요
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-px p-2">
            {comments.map((c) => (
              <CommentItem
                key={c.comment_id}
                comment={c}
                onUpdate={onUpdateComment}
                onDelete={onDeleteComment}
                onHover={onHoverComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
