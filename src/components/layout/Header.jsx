const GearIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export function Header({ page, onNavigate, onSettings }) {
  const NAV = [
    { id: "trend", label: "트렌드" },
    { id: "md", label: "MD 생성" },
    { id: "weather", label: "날씨" },
    { id: "chat", label: "Chat" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-bg-base/95 backdrop-blur-sm border-bg-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* 로고 */}
        <span className="text-xl font-bold tracking-tight font-display text-text-primary">
          RENDE<span className="text-yellow-primary">ZVOUS</span>
        </span>

        {/* 탭 메뉴 */}
        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-1.5 text-xs font-display font-semibold tracking-wide transition-colors duration-150 ${
                page === item.id
                  ? "text-yellow-primary border-b-2 border-yellow-primary"
                  : "text-text-secondary hover:text-text-primary border-b-2 border-transparent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* 톱니바퀴 — 항상 표시, 페이지별로 다른 동작 */}
        <div className="w-[72px] flex justify-end">
          <button
            onClick={onSettings}
            className="p-2 transition-colors duration-150 text-text-secondary hover:text-yellow-primary"
            aria-label="설정"
          >
            <GearIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
