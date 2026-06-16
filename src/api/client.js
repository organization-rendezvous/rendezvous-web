const API_BASE = "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  health: () => request("/health"),

  startAnalysis: (params = {}) =>
    request("/trends/analyze", {
      method: "POST",
      body: JSON.stringify({
        user_id: "personal-user",
        topics: ["개발", "AI", "문화/생활", "사회", "국제"],
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
      if (e.message.includes("404") || e.message.includes("NOT_FOUND"))
        return null;
      throw e;
    }),

  getTrend: (trendId) => request(`/trends/${trendId}`),

  getSettings: (userId = "personal-user") =>
    request(`/settings?user_id=${userId}`),
  saveSettings: (settings) =>
    request("/settings", { method: "PUT", body: JSON.stringify(settings) }),
};
