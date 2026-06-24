import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "../../api/index";

// ── 색상 맵 ───────────────────────────────────────────
const COLOR_MAP = {
  yellow: "#F5C518",
  red: "#EF4444",
  green: "#22C55E",
  blue: "#60A5FA",
};

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

function StyledSpan({ chunk }) {
  const styles = chunk.styles ?? [];
  const isBold = styles.some((s) => s.style_type === "bold");
  const isUnderline = styles.some((s) => s.style_type === "underline");
  const highlight = styles.find((s) => s.style_type === "highlight");
  const color = styles.find((s) => s.style_type === "color");

  const style = {
    fontWeight: isBold ? 700 : undefined,
    textDecoration: isUnderline ? "underline" : undefined,
    backgroundColor: chunk.isHovered
      ? "rgba(245,197,24,0.25)"
      : highlight
        ? (COLOR_MAP[highlight.style_value] ?? highlight.style_value) + "64"
        : undefined,
    color: color
      ? (COLOR_MAP[color.style_value] ?? color.style_value)
      : undefined,
    outline: chunk.isHovered ? "1px solid rgba(245,197,24,0.5)" : undefined,
  };

  return <span style={style}>{chunk.text}</span>;
}

// ── 인라인 편집 가능한 텍스트 블록 ────────────────────
function EditableBlock({ label, value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  const save = () => {
    setEditing(false);
    onChange(draft);
  };
  const cancel = () => {
    setEditing(false);
    setDraft(value ?? "");
  };

  if (editing) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="section-label">{label}</p>
          <div className="flex gap-2">
            <button
              onClick={save}
              className="text-[10px] font-display text-yellow-primary hover:text-yellow-text"
            >
              저장
            </button>
            <button
              onClick={cancel}
              className="text-[10px] font-display text-text-muted hover:text-text-secondary"
            >
              취소
            </button>
          </div>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
          className="w-full px-3 py-2 text-sm leading-relaxed border outline-none resize-none bg-bg-card border-yellow-primary/30 text-text-primary focus:border-yellow-primary/60"
          rows={Math.max(3, draft.split("\n").length + 1)}
        />
      </div>
    );
  }

  return (
    <div className="mb-6 group">
      <div className="flex items-center justify-between mb-2">
        <p className="section-label">{label}</p>
        <button
          onClick={() => setEditing(true)}
          className="text-[10px] font-display text-text-muted hover:text-yellow-primary transition-colors opacity-0 group-hover:opacity-100"
        >
          수정
        </button>
      </div>
      <div className="p-4 border bg-bg-card border-bg-border">
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-text-primary">
          {value}
        </p>
      </div>
    </div>
  );
}

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

function Toolbar({ onApply, onComment, hasSelection }) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b bg-bg-card border-bg-border">
      <span className="text-[10px] text-text-muted font-display mr-1">
        서식
      </span>

      {/* 굵게 */}
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

      {/* 밑줄 */}
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

      {/* 하이라이트 */}
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

      {/* 글자색 */}
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

      {/* 주석 */}
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

// ── 주석 아이템 ────────────────────────────────────────
function CommentItem({ comment, onUpdate, onDelete, onHover }) {
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
              className="px-2 py-1 bg-yellow-primary text-bg-base text-[10px] font-display font-bold"
            >
              저장
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-2 py-1 border border-bg-border text-text-muted text-[10px] font-display"
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
              className="text-[10px] text-text-muted hover:text-yellow-primary transition-colors"
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

// ── 서식 적용 가능한 텍스트 영역 ──────────────────────
function StyleableText({
  text,
  styles,
  hoveredComment,
  textRef,
  onMouseUp,
  sectionKey,
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
        <StyledSpan key={i} chunk={chunk} />
      ))}
    </div>
  );
}

// ── 메인 ──────────────────────────────────────────────
export function ArchiveDetailPage({ archiveId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memo, setMemo] = useState("");
  const [memoSaving, setMemoSaving] = useState(false);
  const [selection, setSelection] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [hoveredComment, setHoveredComment] = useState(null);

  // 각 텍스트 영역별 ref
  const summaryRef = useRef(null);
  const detailRef = useRef(null);
  const aiCommentRef = useRef(null);
  const keywordsRef = useRef(null);
  const memoTimer = useRef(null);

  // section별 텍스트 누적 offset 계산 (서버 offset과 맞추기 위해)
  const getSectionOffset = useCallback(
    (sectionKey) => {
      if (!data) return 0;
      const parts = [];
      if (data.summary) parts.push({ key: "summary", text: data.summary });
      if (data.detail_summary)
        parts.push({ key: "detail", text: data.detail_summary });
      if (data.ai_comment) parts.push({ key: "ai", text: data.ai_comment });
      if (data.keywords?.length)
        parts.push({ key: "keywords", text: data.keywords.join(" ") });

      let offset = 0;
      for (const p of parts) {
        if (p.key === sectionKey) return offset;
        offset += p.text.length + 2; // +2 for \n\n separator
      }
      return 0;
    },
    [data],
  );

  useEffect(() => {
    setLoading(true);
    api.archive
      .archiveDetail(archiveId)
      .then((d) => {
        setData(d);
        setMemo(d.memo ?? "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [archiveId]);

  // 메모 디바운스 저장
  const handleMemoChange = (val) => {
    setMemo(val);
    clearTimeout(memoTimer.current);
    memoTimer.current = setTimeout(async () => {
      setMemoSaving(true);
      await api.archive.archiveMemo(archiveId, val).catch(() => {});
      setMemoSaving(false);
    }, 1000);
  };

  // 텍스트 선택 감지 — 어떤 section ref 안에서 드래그했는지 판단
  const handleMouseUp = useCallback(
    (sectionKey) => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setSelection(null);
        return;
      }

      const refs = {
        summary: summaryRef,
        detail: detailRef,
        ai: aiCommentRef,
        keywords: keywordsRef,
      };
      const ref = refs[sectionKey];
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
        start: baseOffset + localStart,
        end: baseOffset + localEnd,
        sectionKey,
      });
    },
    [getSectionOffset],
  );

  // 스타일 적용
  const handleApplyStyle = async (styleOpts) => {
    if (!selection) return;
    try {
      const style = await api.archive.archiveStyleAdd(archiveId, {
        start_offset: selection.start,
        end_offset: selection.end,
        ...styleOpts,
      });
      setData((d) => ({ ...d, styles: [...(d.styles ?? []), style] }));
      setSelection(null);
      window.getSelection()?.removeAllRanges();
    } catch {}
  };

  // 주석 추가
  const handleAddComment = async () => {
    if (!selection || !newComment.trim()) return;
    try {
      const comment = await api.archive.archiveCommentAdd(archiveId, {
        start_offset: selection.start,
        end_offset: selection.end,
        content: newComment.trim(),
      });
      setData((d) => ({ ...d, comments: [...(d.comments ?? []), comment] }));
      setNewComment("");
      setShowCommentInput(false);
      setSelection(null);
      window.getSelection()?.removeAllRanges();
    } catch {}
  };

  const handleUpdateComment = async (commentId, content) => {
    await api.archive
      .archiveCommentUpdate(archiveId, commentId, content)
      .catch(() => null);
    setData((d) => ({
      ...d,
      comments: d.comments.map((c) =>
        c.comment_id === commentId ? { ...c, content } : c,
      ),
    }));
  };

  const handleDeleteComment = async (commentId) => {
    await api.archive
      .archiveCommentDelete(archiveId, commentId)
      .catch(() => {});
    setData((d) => ({
      ...d,
      comments: d.comments.filter((c) => c.comment_id !== commentId),
    }));
  };

  // 내용 수정 �핸들러
  const handleFieldUpdate = async (field, value) => {
    setData((d) => ({ ...d, [field]: value }));
    await api.archive
      .archiveUpdate(archiveId, { [field]: value })
      .catch(() => {});
  };

  // section별 styles 필터
  const stylesFor = (sectionKey) => {
    if (!data?.styles?.length) return [];
    const base = getSectionOffset(sectionKey);
    const text =
      sectionKey === "summary"
        ? data.summary
        : sectionKey === "detail"
          ? data.detail_summary
          : sectionKey === "ai"
            ? data.ai_comment
            : (data.keywords?.join(" ") ?? "");
    const end = base + (text?.length ?? 0);
    return (data.styles ?? [])
      .filter((s) => s.start_offset >= base && s.end_offset <= end)
      .map((s) => ({
        ...s,
        start_offset: s.start_offset - base,
        end_offset: s.end_offset - base,
      }));
  };

  // 주석 hover 시 해당 section의 로컬 offset으로 변환
  const hoveredFor = (sectionKey) => {
    if (!hoveredComment) return null;
    const base = getSectionOffset(sectionKey);
    const text =
      sectionKey === "summary"
        ? data?.summary
        : sectionKey === "detail"
          ? data?.detail_summary
          : sectionKey === "ai"
            ? data?.ai_comment
            : (data?.keywords?.join(" ") ?? "");
    const sectionEnd = base + (text?.length ?? 0);
    if (hoveredComment.start >= base && hoveredComment.end <= sectionEnd) {
      return {
        start: hoveredComment.start - base,
        end: hoveredComment.end - base,
      };
    }
    return null;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-sm text-text-secondary animate-pulse-slow">
          불러오는 중...
        </span>
      </div>
    );

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-sm text-status-error">불러올 수 없습니다</p>
        <button
          onClick={onBack}
          className="text-xs text-text-secondary hover:text-yellow-primary"
        >
          ← 돌아가기
        </button>
      </div>
    );

  return (
    <div
      className="flex flex-col bg-bg-base animate-fade-in"
      style={{ height: "calc(100vh - 57px)" }}
    >
      {/* 툴바 */}
      <Toolbar
        onApply={handleApplyStyle}
        onComment={() => selection && setShowCommentInput((v) => !v)}
        hasSelection={!!selection}
      />

      {/* 주석 입력 */}
      {showCommentInput && selection && (
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-bg-card border-bg-border animate-fade-in">
          <span className="text-[10px] text-text-muted font-display shrink-0">
            주석
          </span>
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            placeholder="주석 내용 입력 후 Enter..."
            autoFocus
            className="flex-1 bg-bg-elevated border border-bg-border px-3 py-1.5 text-xs text-text-primary outline-none focus:border-yellow-primary/50"
          />
          <button
            onClick={handleAddComment}
            className="px-3 py-1.5 bg-yellow-primary text-bg-base text-[10px] font-display font-bold hover:bg-yellow-text transition-colors"
          >
            추가
          </button>
          <button
            onClick={() => setShowCommentInput(false)}
            className="text-[10px] text-text-muted hover:text-text-secondary"
          >
            취소
          </button>
        </div>
      )}

      {/* 3단 레이아웃 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측: 메모 */}
        <div className="flex flex-col w-56 border-r shrink-0 border-bg-border bg-bg-card">
          <div className="flex items-center justify-between px-3 py-2 border-b border-bg-border">
            <span className="section-label">메모</span>
            {memoSaving && (
              <span className="text-[10px] text-text-muted animate-pulse-slow">
                저장 중...
              </span>
            )}
          </div>
          <textarea
            value={memo}
            onChange={(e) => handleMemoChange(e.target.value)}
            placeholder="이 뉴스에 대한 메모를 남기세요..."
            className="flex-1 w-full px-3 py-3 text-xs leading-relaxed bg-transparent outline-none resize-none text-text-secondary placeholder:text-text-muted"
          />
        </div>

        {/* 중앙: 본문 */}
        <div className="flex-1 px-8 py-6 overflow-y-auto">
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

          {/* 토픽 + 제목 */}
          <div className="mb-6">
            <span className="text-[10px] font-display text-yellow-primary border border-yellow-primary/30 px-1.5 py-0.5">
              {data.topic}
            </span>
            <h1 className="mt-2 mb-1 text-xl font-bold leading-tight font-display text-text-primary">
              {data.title}
            </h1>
            <p className="text-xs text-text-muted">
              보관일 {new Date(data.saved_at).toLocaleDateString("ko-KR")}
            </p>
          </div>

          {/* 선택 안내 */}
          <p
            className={`text-[10px] mb-3 font-display transition-colors ${selection ? "text-yellow-primary" : "text-text-muted"}`}
          >
            {selection
              ? `${selection.end - selection.start}자 선택됨 · 툴바에서 서식/주석을 적용하세요`
              : "텍스트를 드래그하면 서식과 주석을 적용할 수 있어요"}
          </p>

          {/* 요약 */}
          {data.summary && (
            <div className="mb-6 group">
              <div className="flex items-center justify-between mb-2">
                <p className="section-label">요약</p>
                <button
                  onClick={() => {
                    const next = prompt("요약 수정:", data.summary);
                    if (next !== null) handleFieldUpdate("summary", next);
                  }}
                  className="text-[10px] font-display text-text-muted hover:text-yellow-primary transition-colors opacity-0 group-hover:opacity-100"
                >
                  수정
                </button>
              </div>
              <div className="p-4 border bg-bg-card border-bg-border">
                <StyleableText
                  text={data.summary}
                  styles={stylesFor("summary")}
                  hoveredComment={hoveredFor("summary")}
                  textRef={summaryRef}
                  onMouseUp={() => handleMouseUp("summary")}
                  sectionKey="summary"
                />
              </div>
            </div>
          )}

          {/* 상세 요약 */}
          {data.detail_summary && (
            <div className="mb-6 group">
              <div className="flex items-center justify-between mb-2">
                <p className="section-label">상세 요약</p>
                <button
                  onClick={() => {
                    const next = prompt("상세 요약 수정:", data.detail_summary);
                    if (next !== null)
                      handleFieldUpdate("detail_summary", next);
                  }}
                  className="text-[10px] font-display text-text-muted hover:text-yellow-primary transition-colors opacity-0 group-hover:opacity-100"
                >
                  수정
                </button>
              </div>
              <div className="p-4 border bg-bg-card border-bg-border">
                <StyleableText
                  text={data.detail_summary}
                  styles={stylesFor("detail")}
                  hoveredComment={hoveredFor("detail")}
                  textRef={detailRef}
                  onMouseUp={() => handleMouseUp("detail")}
                  sectionKey="detail"
                />
              </div>
            </div>
          )}

          {/* AI 한마디 */}
          {data.ai_comment && (
            <div className="mb-6 group">
              <div className="flex items-center justify-between mb-2">
                <p className="section-label">AI 한마디</p>
                <button
                  onClick={() => {
                    const next = prompt("AI 한마디 수정:", data.ai_comment);
                    if (next !== null) handleFieldUpdate("ai_comment", next);
                  }}
                  className="text-[10px] font-display text-text-muted hover:text-yellow-primary transition-colors opacity-0 group-hover:opacity-100"
                >
                  수정
                </button>
              </div>
              <div className="py-1 pl-4 border-l-2 border-yellow-primary">
                <StyleableText
                  text={data.ai_comment}
                  styles={stylesFor("ai")}
                  hoveredComment={hoveredFor("ai")}
                  textRef={aiCommentRef}
                  onMouseUp={() => handleMouseUp("ai")}
                  sectionKey="ai"
                />
              </div>
            </div>
          )}

          {/* 키워드 */}
          {data.keywords?.length > 0 && (
            <div className="mb-6">
              <p className="mb-2 section-label">키워드</p>
              <div
                className="flex flex-wrap gap-2"
                ref={keywordsRef}
                onMouseUp={() => handleMouseUp("keywords")}
              >
                {data.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-1 text-xs border border-bg-border text-text-secondary font-display"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 관련 링크 (서식 미적용) */}
          {data.links?.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 section-label">관련 자료</p>
              <div className="flex flex-col gap-px bg-bg-border">
                {data.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 transition-colors bg-bg-card hover:bg-bg-elevated"
                  >
                    <p className="text-xs transition-colors text-text-primary hover:text-yellow-text">
                      {link.title}
                    </p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {link.source_name}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 우측: 주석 */}
        <div className="flex flex-col w-64 overflow-y-auto border-l shrink-0 border-bg-border bg-bg-card">
          <div className="px-3 py-2 border-b border-bg-border">
            <span className="section-label">
              주석 · {data.comments?.length ?? 0}
            </span>
          </div>
          <div className="flex flex-col flex-1 gap-px">
            {!data.comments?.length ? (
              <div className="flex items-center justify-center flex-1 px-3">
                <p className="text-[10px] text-text-muted text-center leading-relaxed">
                  텍스트를 드래그한 뒤<br />
                  주석 버튼을 눌러 추가하세요
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-px p-2">
                {data.comments.map((c) => (
                  <CommentItem
                    key={c.comment_id}
                    comment={c}
                    onUpdate={handleUpdateComment}
                    onDelete={handleDeleteComment}
                    onHover={setHoveredComment}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
