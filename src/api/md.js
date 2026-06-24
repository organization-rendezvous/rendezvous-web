import { request } from "./core/request";

export const mdApi = {
  mdExport: (userId, payload) =>
    request(`/md/export?user_id=${userId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMdSettings: (userId) => request(`/md/${userId}`),

  saveMdSettings: (userId, settings) =>
    request(`/md/${userId}`, {
      method: "POST",
      body: JSON.stringify(settings),
    }),
};
