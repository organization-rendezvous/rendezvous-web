import { useEffect, useState } from "react";
import { api } from "../../../api/index";

export function useArchiveDetail(archiveId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api.archive
      .archiveDetail(archiveId)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [archiveId]);

  const updateField = async (field, value) => {
    setData((d) => ({ ...d, [field]: value }));

    await api.archive
      .archiveUpdate(archiveId, { [field]: value })
      .catch(() => {});
  };

  const updateKeywords = async (keywords) => {
    setData((d) => ({ ...d, keywords }));

    await api.archive.archiveUpdate(archiveId, { keywords }).catch(() => {});
  };

  const addStyle = async (style) => {
    const saved = await api.archive.archiveStyleAdd(archiveId, style);

    setData((d) => ({
      ...d,
      styles: [...(d.styles ?? []), saved],
    }));

    return saved;
  };

  const addComment = async (comment) => {
    const saved = await api.archive.archiveCommentAdd(archiveId, comment);

    setData((d) => ({
      ...d,
      comments: [...(d.comments ?? []), saved],
    }));

    return saved;
  };

  const updateComment = async (commentId, content) => {
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

  const deleteComment = async (commentId) => {
    await api.archive
      .archiveCommentDelete(archiveId, commentId)
      .catch(() => {});

    setData((d) => ({
      ...d,
      comments: d.comments.filter((c) => c.comment_id !== commentId),
    }));
  };

  return {
    data,
    setData,
    loading,

    updateField,
    updateKeywords,

    addStyle,

    addComment,
    updateComment,
    deleteComment,
  };
}
