// ── Typing indicator ──────────────────────────────────────────
export default function TypingIndicator() {
  return (
    <div
      style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#F5C518",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className="ti ti-robot"
              style={{ fontSize: 12, color: "#000" }}
            />
          </div>
          <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>
            RENDEZVOUS
          </span>
        </div>
        <div
          style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "4px 16px 16px 16px",
            padding: "12px 16px",
            display: "flex",
            gap: 4,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#F5C518",
                animation: `bounce 1.2s ease infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
