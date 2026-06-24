import { request } from "./core/request";

export const settingsApi = {
  getSettings: (userId = "personal-user") =>
    request(`/settings?user_id=${userId}`),

  saveSettings: (settings) =>
    request("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
};
