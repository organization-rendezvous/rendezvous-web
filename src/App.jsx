import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Header } from "./components/layout/Header";
import { EmptyState } from "./components/main/EmptyState";
import { ResultsView } from "./components/main/ResultsView";
import { AnalysisProgress } from "./components/analysis/AnalysisProgress";
import { TrendDetail } from "./components/detail/TrendDetail";
import { SettingsPanel } from "./components/settings/SettingsPanel";
import { MdPage } from "./components/md/MdPage";
import { WeatherPage } from "./components/weather/WeatherPage";
import { MdSettingsModal } from "./components/md/MdSettingsModal";
import { useAnalysis } from "./hooks/useAnalysis";
import { api } from "./api/client";

const TODAY = new Date().toISOString().slice(0, 10);

const DEFAULT_MD_SETTINGS = {
  fileName: `daily-briefing-${TODAY}`,
  savePath: "~/Downloads",
  sections: [],
};

export default function App() {
  const { phase, jobStatus, result, error, loadLatest, startAnalysis } =
    useAnalysis();
  const [page, setPage] = useState("trend");
  const [selectedTrendId, setSelectedTrendId] = useState(null);
  const [settings, setSettings] = useState(null);
  const [showTrendSettings, setShowTrendSettings] = useState(false);
  const [showMdSettings, setShowMdSettings] = useState(false);
  const [mdSettings, setMdSettings] = useState({
    ...DEFAULT_MD_SETTINGS,
    sections: DEFAULT_MD_SETTINGS.sections ?? [],
  });

  useEffect(() => {
    loadLatest();

    api
      .getSettings()
      .then(setSettings)
      .catch(() => {
        toast.error("세팅을 불러오는데에 실패하였습니다");
      });

    api
      .getMdSettings("personal-user")
      .then((data) => {
        if (!data) return;
        setMdSettings({
          fileName: data.file_name_pattern ?? "daily-briefing-{date}",
          savePath: data.save_path ?? "~/Desktop",
          sections: data.enabled_topics ?? [],
          section_order: data.section_order ?? [],
          result_limit: data.result_limit ?? 5,
          include_summary: data.include_summary ?? true,
          include_detail_summary: data.include_detail_summary ?? true,
          include_keywords: data.include_keywords ?? true,
          include_links: data.include_links ?? true,
          timezone: data.timezone ?? "Asia/Seoul",
          save_path: data.save_path ?? "~/Downloads",
        });
      })
      .catch(() => {});
  }, []);

  const handleMdSettingsChange = (next) => {
    setMdSettings(next);
  };

  const handleAnalyze = () => {
    if (settings) {
      startAnalysis({
        topics: [...settings.enabled_topics, ...(settings.custom_topics ?? [])],
        period: settings.period,
        result_limit: settings.result_limit,
        sources: settings.enabled_sources,
      });
    } else {
      toast.error("세팅을 불러오는데에 실패하였습니다");
    }
  };

  const handleNavigate = (target) => {
    if (target === "trend") setSelectedTrendId(null);
    setPage(target);
  };

  const handleSettings = () => {
    if (page === "trend") setShowTrendSettings(true);
    else if (page === "md") setShowMdSettings(true);
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-body">
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover={false}
        theme="dark"
      />

      <Header
        page={page}
        onNavigate={handleNavigate}
        onSettings={handleSettings}
      />

      <main>
        {page === "trend" && (
          <>
            {selectedTrendId ? (
              <TrendDetail
                trendId={selectedTrendId}
                onBack={() => setSelectedTrendId(null)}
              />
            ) : phase === "analyzing" ? (
              <AnalysisProgress jobStatus={jobStatus} />
            ) : phase === "done" && result ? (
              <ResultsView
                result={result}
                onSelectTrend={(trend) => setSelectedTrendId(trend.trend_id)}
                onReanalyze={handleAnalyze}
              />
            ) : (
              <EmptyState
                onAnalyze={handleAnalyze}
                settings={settings}
                isLoading={phase === "loading"}
              />
            )}
            {phase === "error" && error && (
              <div className="fixed px-4 py-2 text-xs -translate-x-1/2 border bottom-4 left-1/2 bg-status-error/10 border-status-error/40 text-status-error font-display">
                {error}
              </div>
            )}
          </>
        )}

        {page === "md" && <MdPage mdSettings={mdSettings} />}
        {page === "weather" && <WeatherPage />}
      </main>

      {showTrendSettings && (
        <SettingsPanel
          onClose={() => setShowTrendSettings(false)}
          onSaved={() => {
            api
              .getSettings()
              .then(setSettings)
              .catch(() => {});
            setShowTrendSettings(false);
          }}
        />
      )}

      {showMdSettings && (
        <MdSettingsModal
          settings={mdSettings}
          onChange={handleMdSettingsChange}
          onClose={() => setShowMdSettings(false)}
        />
      )}
    </div>
  );
}
