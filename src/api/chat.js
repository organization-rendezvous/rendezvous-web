import { request } from "./core/request";

export const chatApi = {
  getSessions: () => request("/chat/sessions"),
  createSession: () =>
    request("/chat/sessions", {
      method: "POST",
      body: JSON.stringify({ title: null }),
    }),
  getSession: (id) => request(`/chat/sessions/${id}`),
  sendMessage: (id, message) =>
    request(`/chat/sessions/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  updateTitle: (id, title) =>
    request(`/chat/sessions/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),
  deleteSession: (id) => request(`/chat/sessions/${id}`, { method: "DELETE" }),
};
