import { trendsApi } from "./trends";
import { settingsApi } from "./settings";
import { mdApi } from "./md";
import { archiveApi } from "./archive";
import { chatApi } from "./chat";

export const api = {
  trends: trendsApi,
  settings: settingsApi,
  md: mdApi,
  archive: archiveApi,
  chat: chatApi,
};
