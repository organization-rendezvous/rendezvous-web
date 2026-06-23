import { useRef, useState } from "react";

// ── Input Bar ─────────────────────────────────────────────────
export default function InputBar({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");

    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div style={{ padding: "16px 24px 24px", borderTop: "1px solid #1a1a1a" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: 14,
          padding: "10px 12px 10px 16px",
          transition: "border-color 0.15s ease",
        }}
        onFocusCapture={(e) => (e.currentTarget.style.borderColor = "#444")}
        onBlurCapture={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="뉴스에 대해 질문해보세요..."
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: "#e0e0e0",
            fontSize: 14,
            resize: "none",
            lineHeight: 1.5,
            fontFamily: "inherit",
            paddingTop: 4,
            marginBottom: 6,
          }}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: value.trim() && !disabled ? "#F5C518" : "#1e1e1e",
            border: "none",
            cursor: value.trim() && !disabled ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.15s ease",
          }}
        >
          <i
            className="ti ti-arrow-up"
            style={{
              fontSize: 16,
              color: value.trim() && !disabled ? "#000" : "#333",
            }}
          />
        </button>
      </div>
    </div>
  );
}
