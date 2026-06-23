// ── News Card ─────────────────────────────────────────────────
export default function NewsCard({ card }) {
  const handleClick = () => {
    if (card.url) window.open(card.url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        background: "#141414",
        border: "1px solid #242424",
        borderRadius: 10,
        padding: "12px 14px",
        cursor: card.url ? "pointer" : "default",
        textAlign: "left",
        width: "100%",
        transition: "border-color 0.15s ease, background 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#3a3a3a";
        e.currentTarget.style.background = "#1a1a1a";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#242424";
        e.currentTarget.style.background = "#141414";
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "#222",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <i
          className={`ti ${card.source === "web" ? "ti-world" : "ti-news"}`}
          style={{ fontSize: 16, color: "#F5C518" }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#e8e8e8",
            marginBottom: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {card.title}
        </div>
        {card.summary && (
          <div
            style={{
              fontSize: 11,
              color: "#666",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {card.summary}
          </div>
        )}
        <div
          style={{
            fontSize: 10,
            color: "#444",
            marginTop: 4,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {card.source && (
            <span style={{ color: "#F5C518", opacity: 0.7 }}>
              {card.source}
            </span>
          )}
          {card.published_at && (
            <span>
              {new Date(card.published_at).toLocaleDateString("ko-KR")}
            </span>
          )}
        </div>
      </div>
      {card.url && (
        <i
          className="ti ti-external-link"
          style={{ fontSize: 13, color: "#444", flexShrink: 0, marginTop: 2 }}
        />
      )}
    </button>
  );
}
