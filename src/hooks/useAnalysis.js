import { useState, useCallback, useRef, useEffect } from "react";
import { api } from "../api/index";

export function useAnalysis() {
  const [state, setState] = useState({
    phase: "idle", // idle | loading | analyzing | done | error
    jobId: null,
    jobStatus: null,
    result: null,
    error: null,
  });

  // cancelled ref — true이면 진행 중인 폴링을 즉시 중단
  const cancelledRef = useRef(false);
  const timeoutRef = useRef(null);

  const stopPolling = () => {
    cancelledRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // 컴포넌트 언마운트 시 폴링 정리
  useEffect(() => {
    return () => stopPolling();
  }, []);

  const loadLatest = useCallback(async () => {
    setState((s) => ({ ...s, phase: "loading" }));
    try {
      const result = await api.trends.getLatest();
      if (result) {
        setState({
          phase: "done",
          jobId: null,
          jobStatus: null,
          result,
          error: null,
        });
      } else {
        setState({
          phase: "idle",
          jobId: null,
          jobStatus: null,
          result: null,
          error: null,
        });
      }
    } catch {
      setState({
        phase: "idle",
        jobId: null,
        jobStatus: null,
        result: null,
        error: null,
      });
    }
  }, []);

  const startAnalysis = useCallback(async (settings) => {
    stopPolling();
    cancelledRef.current = false; // 새 분석 시작 시 리셋

    setState({
      phase: "analyzing",
      jobId: null,
      jobStatus: null,
      result: null,
      error: null,
    });

    try {
      const { job_id } = await api.trends.startAnalysis(settings);
      if (cancelledRef.current) return;

      setState((s) => ({ ...s, jobId: job_id }));

      // setInterval 대신 재귀 setTimeout — 이전 요청 완료 후 다음 요청 시작
      const poll = async () => {
        if (cancelledRef.current) return;

        try {
          const status = await api.trends.getJobStatus(job_id);
          if (cancelledRef.current) return;

          setState((s) => ({ ...s, jobStatus: status }));

          if (
            ["completed", "partial_failed", "failed"].includes(status.status)
          ) {
            // 완료 → 결과 조회 1회, 폴링 종료
            if (status.status !== "failed") {
              const result = await api.trends.getJobResult(job_id);
              if (!cancelledRef.current) {
                setState({
                  phase: "done",
                  jobId: job_id,
                  jobStatus: status,
                  result,
                  error: null,
                });
              }
            } else {
              if (!cancelledRef.current) {
                setState((s) => ({
                  ...s,
                  phase: "error",
                  error: "분석에 실패했습니다.",
                }));
              }
            }
            // 폴링 종료 — 다음 setTimeout 예약 안 함
          } else {
            // 아직 진행 중 → 1초 뒤 다시 폴링
            timeoutRef.current = setTimeout(poll, 1000);
          }
        } catch (e) {
          if (!cancelledRef.current) {
            setState((s) => ({ ...s, phase: "error", error: e.message }));
          }
        }
      };

      // 첫 폴링은 1초 뒤 시작
      timeoutRef.current = setTimeout(poll, 1000);
    } catch (e) {
      setState({
        phase: "error",
        jobId: null,
        jobStatus: null,
        result: null,
        error: e.message,
      });
    }
  }, []);

  return { ...state, loadLatest, startAnalysis };
}
