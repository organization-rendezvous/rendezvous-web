import { useEffect, useState } from "react";
import { Header } from "./components/layout/Header";
import { EmptyState } from "./components/main/EmptyState";
import { ResultsView } from "./components/main/ResultsView";
import { AnalysisProgress } from "./components/analysis/AnalysisProgress";
import { TrendDetail } from "./components/detail/TrendDetail";
import { SettingsPanel } from "./components/settings/SettingsPanel";
import { useAnalysis } from "./hooks/useAnalysis";
import { api } from "./api/client";

export default function App() {
  const { phase, jobStatus, result, error, loadLatest, startAnalysis } =
    useAnalysis();
  const [selectedTrendId, setSelectedTrendId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadLatest();
    api
      .getSettings()
      .then(setSettings)
      .catch(() => {});
  }, []);

  const handleAnalyze = () => {
    if (settings) {
      startAnalysis({
        topics: [...settings.enabled_topics, ...settings.custom_topics],
        period: settings.period,
        result_limit: settings.result_limit,
        sources: settings.enabled_sources,
      });
    } else {
      startAnalysis();
    }
  };

  const lastAnalyzedAt = result?.topics?.[0]?.trends?.[0] ? null : null;

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-body">
      <Header
        onSettings={() => setShowSettings(true)}
        lastAnalyzedAt={lastAnalyzedAt}
      />

      <main>
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
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-status-error/10 border border-status-error/40 text-status-error text-xs px-4 py-2 font-display">
            {error}
          </div>
        )}
      </main>

      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          onSaved={() =>
            api
              .getSettings()
              .then(setSettings)
              .catch(() => {})
          }
        />
      )}
    </div>
  );
}
