import { request } from "./core/request";

export const trendsApi = {
  startAnalysis: (params = {}) =>
    request("/trends/analyze", {
      method: "POST",
      body: JSON.stringify({
        user_id: "personal-user",
        topics: ["기술", "AI", "개발도구"],
        period: "24h",
        result_limit: 5,
        sources: ["rss", "official_blog", "news"],
        ...params,
      }),
    }),

  getJobStatus: (jobId) => request(`/trends/jobs/${jobId}`),

  getJobResult: (jobId) => request(`/trends/jobs/${jobId}/result`),

  getLatest: (userId = "personal-user") =>
    request(`/trends/latest?user_id=${userId}`).catch((e) => {
      if (e.message.includes("404") || e.message.includes("NOT_FOUND")) {
        return null;
      }
      throw e;
    }),

  getTrend: (trendId) => request(`/trends/${trendId}`),
};
