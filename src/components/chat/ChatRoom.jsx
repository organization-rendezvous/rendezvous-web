import { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import TypingIndicator from "./TypingIndicator";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";

export default function ChatRoom({
  sessionId,
  onSessionUpdate,
  chatApi,
  initialMessage = null,
  onInitialMessageSent = null,
  isNew = false, // ← 새로 만든 세션 여부
}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(!isNew); // 새 세션이면 로딩 스킵
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const initialSentRef = useRef(false);

  useEffect(() => {
    // 새 세션이면 서버에서 불러올 메시지가 없으니 스킵
    if (!sessionId || isNew) return;
    setLoading(true);
    chatApi
      .getSession(sessionId)
      .then((data) => setMessages(data.messages ?? []))
      .catch(() => toast.error("대화 내역을 불러오지 못했습니다"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleSend = useCallback(
    async (text) => {
      const userMsg = {
        message_id: Date.now(),
        role: "user",
        content: text,
        news_cards: [],
      };
      setMessages((prev) => [...prev, userMsg]);
      setSending(true);

      try {
        const res = await chatApi.sendMessage(sessionId, text);
        const aiMsg = { ...res.message, news_cards: res.news_cards ?? [] };
        setMessages((prev) => [...prev, aiMsg]);
        onSessionUpdate(sessionId);
      } catch {
        toast.error("메시지 전송에 실패했습니다. 다시 시도해주세요");
        setMessages((prev) =>
          prev.filter((m) => m.message_id !== userMsg.message_id),
        );
      } finally {
        setSending(false);
      }
    },
    [sessionId, chatApi, onSessionUpdate],
  );

  // 초기 메시지 자동 전송
  useEffect(() => {
    if (!initialMessage || loading || initialSentRef.current) return;
    initialSentRef.current = true;
    handleSend(initialMessage);
    onInitialMessageSent?.();
  }, [initialMessage, loading, handleSend]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#333",
          fontSize: 14,
        }}
      >
        불러오는 중...
      </div>
    );
  }

  return (
    <>
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 32px 16px" }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.message_id} msg={msg} />
        ))}
        {sending && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
      <InputBar onSend={handleSend} disabled={sending} />
    </>
  );
}
