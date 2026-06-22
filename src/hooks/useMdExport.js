import { useState, useCallback } from "react";
import { api } from "../api/client";

export function useMdExport() {
  const [state, setState] = useState({
    phase: "idle", // idle | loading | ready | error
    fileName: null,
    downloadUrl: null,
    error: null,
  });

  const startExport = useCallback(async (settings) => {
    setState({
      phase: "loading",
      fileName: null,
      downloadUrl: null,
      error: null,
    });

    try {
      // 1. settings 먼저 저장
      await api.saveMdSettings("personal-user", settings);

      // 2. export 실행
      const data = await api.mdExport("personal-user", settings);

      setState({
        phase: "ready",
        fileName: data.file_name,
        downloadUrl: `http://127.0.0.1:8000/api${data.download_url}`,
        error: null,
      });
    } catch (e) {
      setState({
        phase: "error",
        fileName: null,
        downloadUrl: null,
        error: e.message,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ phase: "idle", fileName: null, downloadUrl: null, error: null });
  }, []);

  return { ...state, startExport, reset };
}
