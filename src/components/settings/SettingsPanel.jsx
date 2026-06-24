import { useState, useEffect } from "react";
import { api } from "../../api/index";

const TOPIC_OPTIONS = ["개발", "AI", "문화/생활", "사회", "국제"];
const PERIOD_OPTIONS = [
  { value: "24h", label: "최근 24시간" },
  { value: "7d", label: "최근 7일" },
  { value: "30d", label: "최근 30일" },
];
const LIMIT_OPTIONS = [5, 10, 20];
const SOURCE_OPTIONS = ["rss", "official_blog", "news", "reddit", "youtube"];

export function SettingsPanel({ onClose, onSaved }) {
  const [settings, setSettings] = useState(null);
  const [customTopic, setCustomTopic] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.settings
      .getSettings()
      .then(setSettings)
      .catch(() => {});
  }, []);

  if (!settings) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/90">
        <span className="text-sm text-text-secondary animate-pulse-slow">
          불러오는 중...
        </span>
      </div>
    );
  }

  const toggle = (key, value) => {
    setSettings((s) => {
      const arr = s[key];
      return {
        ...s,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const addCustomTopic = () => {
    const t = customTopic.trim();
    if (!t || settings.custom_topics.includes(t)) return;
    setSettings((s) => ({ ...s, custom_topics: [...s.custom_topics, t] }));
    setCustomTopic("");
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.settings.saveSettings(settings);
      onSaved?.();
      onClose();
    } catch (e) {
      alert("저장 실패: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const Chip = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 border font-display transition-colors duration-150 ${
        active
          ? "border-yellow-primary bg-yellow-muted text-yellow-primary"
          : "border-bg-border text-text-secondary hover:border-yellow-primary/40 hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg-base/95 backdrop-blur-sm animate-fade-in">
      <div className="max-w-lg px-6 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold font-display text-text-primary">
            설정
          </h2>
          <button
            onClick={onClose}
            className="transition-colors text-text-secondary hover:text-yellow-primary"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Topics */}
        <section className="mb-8">
          <p className="mb-3 section-label">주제</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {TOPIC_OPTIONS.map((t) => (
              <Chip
                key={t}
                active={settings.enabled_topics.includes(t)}
                onClick={() => toggle("enabled_topics", t)}
              >
                {t}
              </Chip>
            ))}
          </div>
          {settings.custom_topics?.map((t) => (
            <Chip
              key={t}
              active={settings.enabled_topics.includes(t)}
              onClick={() => toggle("enabled_topics", t)}
            >
              {t} ✕
            </Chip>
          ))}
          <div className="flex gap-2 mt-3">
            <input
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomTopic()}
              placeholder="직접 입력..."
              className="flex-1 bg-bg-card border border-bg-border px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-yellow-primary/50"
            />
            <button
              onClick={addCustomTopic}
              className="text-xs px-3 py-1.5 border border-bg-border text-text-secondary hover:border-yellow-primary/40 hover:text-yellow-primary transition-colors"
            >
              추가
            </button>
          </div>
        </section>

        {/* Period */}
        <section className="mb-8">
          <p className="mb-3 section-label">분석 기간</p>
          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((o) => (
              <Chip
                key={o.value}
                active={settings.period === o.value}
                onClick={() => setSettings((s) => ({ ...s, period: o.value }))}
              >
                {o.label}
              </Chip>
            ))}
          </div>
        </section>

        {/* Result limit */}
        <section className="mb-8">
          <p className="mb-3 section-label">결과 개수</p>
          <div className="flex gap-2">
            {LIMIT_OPTIONS.map((n) => (
              <Chip
                key={n}
                active={settings.result_limit === n}
                onClick={() => setSettings((s) => ({ ...s, result_limit: n }))}
              >
                Top {n}
              </Chip>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section className="mb-10">
          <p className="mb-3 section-label">데이터 출처</p>
          <div className="flex flex-wrap gap-2">
            {SOURCE_OPTIONS.map((s) => (
              <Chip
                key={s}
                active={settings.enabled_sources.includes(s)}
                onClick={() => toggle("enabled_sources", s)}
              >
                {s}
              </Chip>
            ))}
          </div>
        </section>

        <button
          onClick={save}
          disabled={saving}
          className="w-full py-3 text-sm font-bold transition-colors bg-yellow-primary text-bg-base font-display hover:bg-yellow-text disabled:opacity-50"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
