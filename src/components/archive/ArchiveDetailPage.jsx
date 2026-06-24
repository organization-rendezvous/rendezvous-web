import { useState, useEffect, useRef } from "react";
import Toolbar from "./Toolbar";
import { ArchiveHeader } from "./sections/ArchiveHeader";
import { ArchiveContent } from "./sections/ArchiveContent";
import { ArchiveMemoPanel } from "./sections/ArchiveMemoPanel";
import { ArchiveSidebar } from "./sections/ArchiveSidebar";
import { CommentInput } from "./sections/CommentInput";
import { useArchiveDetail } from "./hooks/useArchiveDetail";
import { useMemoAutosave } from "./hooks/useMemoAutosave";
import { useTextSelection } from "./hooks/useTextSelection";

// ── 색상 맵 ───────────────────────────────────────────
const COLOR_MAP = {
  yellow: "#F5C518",
  red: "#EF4444",
  green: "#22C55E",
  blue: "#60A5FA",
};

export function ArchiveDetailPage({ archiveId, onBack }) {
  const [hoveredComment, setHoveredComment] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  const summaryRef = useRef(null);
  const detailRef = useRef(null);
  const aiCommentRef = useRef(null);
  const keywordsRef = useRef(null);

  // ──────────────────────────────────────────────
  // 데이터 관리
  // ──────────────────────────────────────────────

  const {
    data,
    loading,
    updateField,
    updateKeywords,
    addStyle,
    addComment,
    updateComment,
    deleteComment,
  } = useArchiveDetail(archiveId);

  // ──────────────────────────────────────────────
  // 메모 자동 저장
  // ──────────────────────────────────────────────

  const { memo, setMemo, memoSaving, handleMemoChange } =
    useMemoAutosave(archiveId);

  // 최초 데이터 로드 시 메모 동기화
  useEffect(() => {
    if (data?.memo != null) {
      setMemo(data.memo);
    }
  }, [data?.memo, setMemo]);

  // ──────────────────────────────────────────────
  // 텍스트 선택
  // ──────────────────────────────────────────────

  const {
    selection,
    setSelection,
    getSectionOffset,
    handleMouseUp,
    clearSelection,
  } = useTextSelection(data);

  // ──────────────────────────────────────────────
  // 스타일 적용
  // ──────────────────────────────────────────────

  const handleApplyStyle = async (styleOpts) => {
    if (!selection) return;

    try {
      await addStyle({
        start_offset: selection.start,
        end_offset: selection.end,
        ...styleOpts,
      });

      clearSelection();
    } catch {}
  };

  // ──────────────────────────────────────────────
  // 주석 추가
  // ──────────────────────────────────────────────

  const handleAddComment = async () => {
    if (!selection || !newComment.trim()) return;

    try {
      await addComment({
        start_offset: selection.start,
        end_offset: selection.end,
        content: newComment.trim(),
      });

      setNewComment("");
      setShowCommentInput(false);

      clearSelection();
    } catch {}
  };

  // ──────────────────────────────────────────────
  // 스타일 필터
  // ──────────────────────────────────────────────

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

  // ──────────────────────────────────────────────
  // 주석 Hover 범위
  // ──────────────────────────────────────────────

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

  // ──────────────────────────────────────────────
  // 로딩 / 에러
  // ──────────────────────────────────────────────

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
      <CommentInput
        visible={showCommentInput && selection}
        value={newComment}
        onChange={setNewComment}
        onAdd={handleAddComment}
        onCancel={() => setShowCommentInput(false)}
      />

      {/* 본문 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측 메모 */}
        <ArchiveMemoPanel
          memo={memo}
          memoSaving={memoSaving}
          onChange={handleMemoChange}
        />

        {/* 중앙 */}
        <div className="flex-1 px-8 py-6 overflow-y-auto">
          <ArchiveHeader
            topic={data.topic}
            title={data.title}
            savedAt={data.saved_at}
            selection={selection}
            onBack={onBack}
            onTitleSave={(value) => updateField("title", value)}
          />

          <ArchiveContent
            data={data}
            summaryRef={summaryRef}
            detailRef={detailRef}
            aiCommentRef={aiCommentRef}
            keywordsRef={keywordsRef}
            stylesFor={stylesFor}
            hoveredFor={hoveredFor}
            onMouseUp={handleMouseUp}
            onFieldUpdate={updateField}
            onKeywordsUpdate={updateKeywords}
            COLOR_MAP={COLOR_MAP}
          />
        </div>

        {/* 우측 주석 */}
        <ArchiveSidebar
          comments={data.comments}
          onUpdateComment={updateComment}
          onDeleteComment={deleteComment}
          onHoverComment={setHoveredComment}
        />
      </div>
    </div>
  );
}
