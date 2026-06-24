import { request } from "./core/request";

export const archiveApi = {
  // 보관 여부 확인
  archiveCheck: (title) =>
    request(`/archive/news/check?title=${encodeURIComponent(title)}`).catch(
      () => ({ is_archived: false, archive_id: null }),
    ),

  // 뉴스 보관
  archiveSave: (trendId) =>
    request("/archive/news", {
      method: "POST",
      body: JSON.stringify({ trend_id: trendId }),
    }),

  // 보관 해제
  archiveDelete: (archiveId) =>
    request(`/archive/news/${archiveId}`, {
      method: "DELETE",
    }),

  // 보관함 목록
  archiveList: ({ topic, page = 1, size = 9 } = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });

    if (topic) {
      params.set("topic", topic);
    }

    return request(`/archive/news?${params.toString()}`);
  },

  // 보관 뉴스 상세
  archiveDetail: (archiveId) => request(`/archive/news/${archiveId}`),

  // 메모 수정
  archiveMemo: (archiveId, memo) =>
    request(`/archive/news/${archiveId}/memo`, {
      method: "PATCH",
      body: JSON.stringify({ memo }),
    }),

  // 내용 수정
  archiveUpdate: (archiveId, fields) =>
    request(`/archive/news/${archiveId}/content`, {
      method: "PATCH",
      body: JSON.stringify(fields),
    }),

  // 스타일 추가
  archiveStyleAdd: (archiveId, style) =>
    request(`/archive/news/${archiveId}/styles`, {
      method: "POST",
      body: JSON.stringify(style),
    }),

  // 스타일 삭제
  archiveStyleDelete: (archiveId, styleId) =>
    request(`/archive/news/${archiveId}/styles/${styleId}`, {
      method: "DELETE",
    }),

  // 주석 생성
  archiveCommentAdd: (archiveId, comment) =>
    request(`/archive/news/${archiveId}/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
    }),

  // 주석 수정
  archiveCommentUpdate: (archiveId, commentId, content) =>
    request(`/archive/news/${archiveId}/comments/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    }),

  // 주석 삭제
  archiveCommentDelete: (archiveId, commentId) =>
    request(`/archive/news/${archiveId}/comments/${commentId}`, {
      method: "DELETE",
    }),
};
