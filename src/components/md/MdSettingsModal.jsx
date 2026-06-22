import { api } from "../../api/client";

const SECTION_OPTIONS = ["사건사고", "개발", "AI", "사회", "국제", "문화/생활"];

const PATH_PRESETS = ["~/Documents", "~/Downloads", "~/Desktop"];

export function MdSettingsModal({ settings, onChange, onClose }) {
  const safeSettings = {
    sections: [],
    fileName: "daily-briefing",
    savePath: "~/Downloads",
    ...settings,
  };

  const savePath = safeSettings.savePath;
  const isPreset = PATH_PRESETS.includes(savePath);

  const updateSettings = (patch) => {
    onChange({
      ...safeSettings,
      ...patch,
    });
  };

  const handleSave = async () => {
    const payload = {
      enabled_topics: safeSettings.sections ?? [],
      section_order: safeSettings.section_order ?? safeSettings.sections ?? [],

      result_limit: safeSettings.result_limit ?? 5,
      include_summary: safeSettings.include_summary ?? true,
      include_detail_summary: safeSettings.include_detail_summary ?? true,
      include_keywords: safeSettings.include_keywords ?? true,
      include_links: safeSettings.include_links ?? true,

      file_name_pattern: safeSettings.fileName ?? "daily-briefing-{date}",
      timezone: safeSettings.timezone ?? "Asia/Seoul",

      save_path: savePath ?? "~/Downloads",
    };

    const res = await api.saveMdSettings("personal-user", payload);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-bg-card border border-bg-border w-full max-w-sm mx-4 p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-text-primary">MD 생성 설정</h3>

          <button onClick={onClose} className="text-text-muted">
            ✕
          </button>
        </div>

        {/* 파일명 */}
        <div className="mb-6">
          <p className="mb-2 section-label">파일 이름</p>

          <div className="flex items-center gap-2">
            <input
              value={safeSettings.fileName}
              onChange={(e) => updateSettings({ fileName: e.target.value })}
              className="flex-1 px-3 py-2 text-xs border bg-bg-elevated border-bg-border text-text-primary"
            />
            <span className="text-xs text-text-muted">.md</span>
          </div>

          <p className="text-[10px] text-text-muted mt-1">
            → {safeSettings.fileName}.md
          </p>
        </div>

        {/* 저장 경로 */}
        <div className="mb-6">
          <p className="mb-2 section-label">저장 경로</p>

          <div className="flex flex-col gap-1.5">
            {PATH_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => updateSettings({ savePath: p })}
                className={`flex items-center gap-2 text-xs px-3 py-2 border text-left ${
                  savePath === p
                    ? "border-yellow-primary bg-yellow-muted text-yellow-primary"
                    : "border-bg-border text-text-secondary"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    savePath === p ? "bg-yellow-primary" : "bg-bg-border"
                  }`}
                />
                {p}
              </button>
            ))}
          </div>

          {/* custom input */}
          <div className="mt-3">
            <p className="mb-1 text-xs text-text-muted">직접 입력</p>

            <input
              value={savePath ?? ""}
              onChange={(e) => updateSettings({ savePath: e.target.value })}
              placeholder="/Users/me/Documents/reports"
              className="w-full px-3 py-2 text-xs border bg-bg-elevated border-yellow-primary/30 text-text-primary"
            />
          </div>
        </div>

        {/* 포함 섹션 */}
        <div className="mb-6">
          <p className="mb-2 section-label">포함 섹션</p>

          <div className="flex flex-wrap gap-1.5">
            {SECTION_OPTIONS.map((s) => {
              const active = (safeSettings.sections ?? []).includes(s);

              return (
                <button
                  key={s}
                  onClick={() => {
                    const current = safeSettings.sections ?? [];

                    const next = active
                      ? current.filter((x) => x !== s)
                      : [...current, s];

                    updateSettings({ sections: next });
                  }}
                  className={`text-xs px-2.5 py-1 border ${
                    active
                      ? "border-yellow-primary bg-yellow-muted text-yellow-primary"
                      : "border-bg-border text-text-muted"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* 저장 */}
        <button
          onClick={handleSave}
          className="w-full py-2.5 bg-yellow-primary text-bg-base font-bold text-xs"
        >
          확인
        </button>
      </div>
    </div>
  );
}
