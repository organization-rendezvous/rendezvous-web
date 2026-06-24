const API_BASE = "http://127.0.0.1:8000/api";

export async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let err = {};
    try {
      err = await res.json();
    } catch {}

    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }

  return res.json();
}
