import { useState, useEffect, useRef, useCallback } from "react";
import CommentItem from "./CommentItem";
import Toolbar from "./Toolbar";
import EditableStyledBlock from "./EditableStyledBlock";
import EditableTitle from "./EditableTitle";
import StyleableText from "./StyleableText"
import { api } from "../../api/index";

// ── 색상 맵 ───────────────────────────────────────────
const COLOR_MAP = {
  yellow: "#F5C518",
  red: "#EF4444",
  green: "#22C55E",
  blue: "#60A5FA",
};

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

  const summaryRef = useRef(null);
  const detailRef = useRef(null);
  const aiCommentRef = useRef(null);
  const keywordsRef = useRef(null);
  const memoTimer = useRef(null);

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
        offset += p.text.length + 2;
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

  const handleMemoChange = (val) => {
    setMemo(val);
    clearTimeout(memoTimer.current);
    memoTimer.current = setTimeout(async () => {
      setMemoSaving(true);
      await api.archive.archiveMemo(archiveId, val).catch(() => {});
      setMemoSaving(false);
    }, 1000);
  };

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

  const handleFieldUpdate = async (field, value) => {
    setData((d) => ({ ...d, [field]: value }));
    await api.archive
      .archiveUpdate(archiveId, { [field]: value })
      .catch(() => {});
  };

  // 키워드는 배열이므로 별도 처리
  const handleKeywordsUpdate = async (keywords) => {
    setData((d) => ({ ...d, keywords }));
    await api.archive.archiveUpdate(archiveId, { keywords }).catch(() => {});
  };

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
            {/* 제목 인라인 편집 */}
            <EditableTitle
              value={data.title}
              onSave={(val) => handleFieldUpdate("title", val)}
            />
            <p className="text-xs text-text-muted">
              보관일 {new Date(data.saved_at).toLocaleDateString("ko-KR")}
            </p>
          </div>

          {/* 선택 안내 */}
          <p
            className={`text-[10px] mb-3 font-display transition-colors ${
              selection ? "text-yellow-primary" : "text-text-muted"
            }`}
          >
            {selection
              ? `${selection.end - selection.start}자 선택됨 · 툴바에서 서식/주석을 적용하세요`
              : "텍스트를 드래그하면 서식과 주석을 적용할 수 있어요"}
          </p>

          {/* 요약 */}
          {data.summary && (
            <EditableStyledBlock
              label="요약"
              sectionKey="summary"
              value={data.summary}
              styles={stylesFor("summary")}
              hoveredComment={hoveredFor("summary")}
              textRef={summaryRef}
              onMouseUp={() => handleMouseUp("summary")}
              onSave={(val) => handleFieldUpdate("summary", val)}
            />
          )}

          {/* 상세 요약 */}
          {data.detail_summary && (
            <EditableStyledBlock
              label="상세 요약"
              sectionKey="detail"
              value={data.detail_summary}
              styles={stylesFor("detail")}
              hoveredComment={hoveredFor("detail")}
              textRef={detailRef}
              onMouseUp={() => handleMouseUp("detail")}
              onSave={(val) => handleFieldUpdate("detail_summary", val)}
            />
          )}

          {/* AI 한마디 */}
          {data.ai_comment && (
            <EditableStyledBlock
              label="AI 한마디"
              sectionKey="ai"
              value={data.ai_comment}
              styles={stylesFor("ai")}
              hoveredComment={hoveredFor("ai")}
              textRef={aiCommentRef}
              onMouseUp={() => handleMouseUp("ai")}
              onSave={(val) => handleFieldUpdate("ai_comment", val)}
              renderContent={() => (
                <div className="py-1 pl-4 border-l-2 border-yellow-primary">
                  <StyleableText
                    text={data.ai_comment}
                    styles={stylesFor("ai")}
                    hoveredComment={hoveredFor("ai")}
                    textRef={aiCommentRef}
                    onMouseUp={() => handleMouseUp("ai")}
                    sectionKey="ai"
                    COLOR_MAP={COLOR_MAP}
                  />
                </div>
              )}
            />
          )}

          {/* 키워드 */}
          {data.keywords?.length > 0 && (
            <EditableKeywords
              keywords={data.keywords}
              styles={stylesFor("keywords")}
              hoveredComment={hoveredFor("keywords")}
              textRef={keywordsRef}
              onMouseUp={() => handleMouseUp("keywords")}
              onSave={handleKeywordsUpdate}
            />
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
