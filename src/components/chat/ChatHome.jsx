import InputBar from "./InputBar";

// ── Chat Home (empty state) ───────────────────────────────────
export default function ChatHome({ onSend }) {
  const suggestions = [
    "오늘 주요 뉴스 알려줘",
    "최근 AI 트렌드는?",
    "개발 커뮤니티 분위기 어때?",
    "반도체 시장 요즘 어때?",
  ];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 32px 80px",
      }}
    >
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#F5C518",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <i className="ti ti-robot" style={{ fontSize: 24, color: "#000" }} />
        </div>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 300,
            color: "#e0e0e0",
            margin: "0 0 6px",
            letterSpacing: -0.5,
          }}
        >
          오늘의 뉴스를 확인해보세요
        </h2>
        <p style={{ fontSize: 13, color: "#444", margin: 0 }}>
          뉴스 기반 AI 어시스턴트입니다
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 32,
          width: "100%",
          maxWidth: 520,
        }}
      >
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSend(s)}
            style={{
              background: "#0e0e0e",
              border: "1px solid #1e1e1e",
              borderRadius: 10,
              padding: "12px 14px",
              color: "#666",
              cursor: "pointer",
              fontSize: 13,
              textAlign: "left",
              transition: "all 0.15s ease",
              lineHeight: 1.4,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#2a2a2a";
              e.currentTarget.style.color = "#aaa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1e1e1e";
              e.currentTarget.style.color = "#666";
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ width: "100%", maxWidth: 520 }}>
        <InputBar onSend={onSend} disabled={false} />
      </div>
    </div>
  );
}
