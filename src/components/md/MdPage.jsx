import { useMdExport } from "./hooks/useMdExport";

export function MdPage({ mdSettings }) {
  const { phase, fileName, downloadUrl, error, startExport, reset } =
    useMdExport();

  const downloadHref = downloadUrl ?? `/md/download/${fileName}`;

  const handleExport = () => {
    startExport({
      enabled_topics: mdSettings.sections ?? [],
      section_order: mdSettings.sections ?? [],
      result_limit: mdSettings.result_limit ?? 5,
      include_summary: mdSettings.include_summary ?? true,
      include_detail_summary: mdSettings.include_detail_summary ?? true,
      include_keywords: mdSettings.include_keywords ?? true,
      include_links: mdSettings.include_links ?? true,
      file_name_pattern: mdSettings.fileName,
      timezone: mdSettings.timezone ?? "Asia/Seoul",
      save_path: mdSettings.savePath,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 animate-fade-in">
      <div className="w-full max-w-md text-center">
        {/* ── idle / error ── */}
        {(phase === "idle" || phase === "error") && (
          <>
            <div className="mb-8">
              <div className="inline-flex flex-wrap items-center justify-center gap-1 mb-4">
                {(mdSettings.sections ?? mdSettings.enabled_topics ?? []).map(
                  (s) => (
                    <span
                      key={s}
                      className="text-xs px-2 py-0.5 border border-bg-border text-text-secondary font-display"
                    >
                      {s}
                    </span>
                  ),
                )}
              </div>
              <p className="text-sm leading-relaxed text-text-secondary">
                분석된 트렌드 데이터를 정리해
                <br />
                <span className="text-text-primary">
                  Markdown 파일로 내보냅니다
                </span>
              </p>
            </div>

            {phase === "error" && error && (
              <p className="mb-4 text-xs text-status-error">{error}</p>
            )}

            <button
              onClick={handleExport}
              className="px-8 py-4 text-sm font-bold tracking-wider transition-colors duration-150 bg-yellow-primary text-bg-base font-display hover:bg-yellow-text"
            >
              {phase === "error" ? "다시 생성" : "MD 생성"}
            </button>
          </>
        )}

        {/* ── loading ── */}
        {phase === "loading" && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <div className="inline-flex flex-wrap items-center justify-center gap-1 mb-4">
                {(mdSettings.sections ?? mdSettings.enabled_topics ?? []).map(
                  (s) => (
                    <span
                      key={s}
                      className="text-xs px-2 py-0.5 border border-yellow-primary/30 text-yellow-primary/60 font-display animate-pulse-slow"
                    >
                      {s}
                    </span>
                  ),
                )}
              </div>
              <p className="text-sm text-text-secondary">
                Markdown을 생성하고 있습니다...
              </p>
            </div>
            <div className="h-0.5 bg-bg-border overflow-hidden w-48 mx-auto">
              <div className="w-full h-full bg-yellow-primary animate-pulse-slow" />
            </div>
          </div>
        )}

        {/* ── ready ── */}
        {phase === "ready" && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 mb-4">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-status-success"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-xs font-semibold font-display text-status-success">
                  생성 완료
                </span>
              </div>
              <p className="text-sm leading-relaxed text-text-secondary">
                파일이 준비됐어요
                <br />
                <span className="text-text-primary">{fileName}</span>
              </p>
            </div>

            <button
              onClick={async () => {
                const res = await fetch(downloadUrl);
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="inline-block px-8 py-4 text-sm font-bold tracking-wider transition-colors duration-150 bg-yellow-primary text-bg-base font-display hover:bg-yellow-text"
            >
              다운로드
            </button>

            <div className="mt-6">
              <button
                onClick={reset}
                className="text-xs transition-colors text-text-muted hover:text-text-secondary font-display"
              >
                다시 생성
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
