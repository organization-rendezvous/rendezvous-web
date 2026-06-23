import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import NewsCard from "./NewsCard";

// ── Message Bubble ────────────────────────────────────────────
export default function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const cards = msg.news_cards ?? [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: 20,
      }}
    >
      {!isUser && (
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
      )}

      <div
        style={{
          maxWidth: "72%",
          background: isUser ? "#F5C518" : "#1a1a1a",
          border: isUser ? "none" : "1px solid #2a2a2a",
          borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
          padding: "10px 14px",
          fontSize: 14,
          color: isUser ? "#000" : "#e0e0e0",
          lineHeight: 1.6,
          fontWeight: isUser ? 500 : 400,
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
      </div>

      {cards.length > 0 && (
        <div
          style={{
            width: "72%",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: 10,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#444",
              letterSpacing: 1,
              marginBottom: 2,
            }}
          >
            관련 뉴스
          </div>
          {cards.map((card) => (
            <NewsCard key={card.card_id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
