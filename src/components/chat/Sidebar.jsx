import { useState } from "react";

// ── Sidebar ───────────────────────────────────────────────────
export default function Sidebar({
  sessions,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onRename,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  const startEdit = (e, session) => {
    e.stopPropagation();
    setEditingId(session.session_id);
    setEditValue(session.title ?? "");
  };

  const commitEdit = async (id) => {
    if (editValue.trim()) await onRename(id, editValue.trim());
    setEditingId(null);
  };

  return (
    <div
      style={{
        width: 240,
        flexShrink: 0,
        background: "#080808",
        borderRight: "1px solid #1a1a1a",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* New chat button */}
      <div style={{ padding: "16px 12px 12px" }}>
        <button
          onClick={onNew}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "1px solid #2a2a2a",
            borderRadius: 8,
            padding: "9px 12px",
            color: "#aaa",
            cursor: "pointer",
            fontSize: 13,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#F5C518";
            e.currentTarget.style.color = "#F5C518";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#2a2a2a";
            e.currentTarget.style.color = "#aaa";
          }}
        >
          <i className="ti ti-plus" style={{ fontSize: 15 }} />새 채팅
        </button>
      </div>

      {/* Session list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px" }}>
        {sessions.length === 0 && (
          <div
            style={{
              fontSize: 12,
              color: "#333",
              textAlign: "center",
              marginTop: 24,
            }}
          >
            채팅 내역이 없어요
          </div>
        )}
        {sessions.map((s) => {
          const isActive = s.session_id === activeId;
          return (
            <div
              key={s.session_id}
              onClick={() => onSelect(s.session_id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 8,
                padding: "8px 10px",
                cursor: "pointer",
                background: isActive
                  ? "#1a1a1a"
                  : hoveredId === s.session_id
                    ? "#111"
                    : "none",
                marginBottom: 2,
                transition: "background 0.12s ease",
                position: "relative",
              }}
              onMouseEnter={() => setHoveredId(s.session_id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <i
                className="ti ti-message"
                style={{
                  fontSize: 14,
                  color: isActive ? "#F5C518" : "#444",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                {editingId === s.session_id ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => commitEdit(s.session_id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit(s.session_id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: "#222",
                      border: "1px solid #F5C518",
                      borderRadius: 4,
                      color: "#fff",
                      fontSize: 12,
                      padding: "2px 6px",
                      width: "100%",
                      outline: "none",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      fontSize: 12,
                      color: isActive ? "#e0e0e0" : "#666",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.title ?? "새 채팅"}
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexShrink: 0,
                  opacity: hoveredId === s.session_id ? 1 : 0,
                  transform:
                    hoveredId === s.session_id
                      ? "translateX(0)"
                      : "translateX(4px)",
                  transition: "opacity 0.12s ease, transform 0.12s ease",
                  pointerEvents: hoveredId === s.session_id ? "auto" : "none",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => startEdit(e, s)}
                  style={{
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid #2a2a2a",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F5C518"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </button>

                <button
                  onClick={() => onDelete(s.session_id)}
                  style={{
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid #2a2a2a",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F5C518"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
