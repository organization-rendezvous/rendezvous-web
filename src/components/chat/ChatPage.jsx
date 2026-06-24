import { useState, useEffect, useCallback } from "react";
import { api } from "../../api/index";
import { toast } from "react-toastify";

import Sidebar from "./Sidebar";
import ChatRoom from "./ChatRoom";
import ChatHome from "./ChatHome";

export function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [isNewSession, setIsNewSession] = useState(false); // ← 추가

  useEffect(() => {
    api.chat
      .getSessions()
      .then((data) => setSessions(data.sessions ?? []))
      .catch(() => {});
  }, []);

  const refreshSessions = useCallback(() => {
    api.chat
      .getSessions()
      .then((data) => setSessions(data.sessions ?? []))
      .catch(() => {});
  }, []);

  const handleNew = async () => {
    setIsNewSession(false);
    setActiveId(null);
  };

  const handleHomeMessage = async (text) => {
    try {
      const session = await api.chat.createSession();
      setSessions((prev) => [session, ...prev]);
      setPendingMessage(text);
      setIsNewSession(true); // ← 새 세션 표시
      setActiveId(session.session_id);
    } catch {
      toast.error("채팅을 시작하지 못했습니다");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.chat.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.session_id !== id));
      if (activeId === id) setActiveId(null);
    } catch {
      toast.error("삭제에 실패했습니다");
    }
  };

  const handleRename = async (id, title) => {
    try {
      await api.chat.updateTitle(id, title);
      setSessions((prev) =>
        prev.map((s) => (s.session_id === id ? { ...s, title } : s)),
      );
    } catch {
      toast.error("제목 변경에 실패했습니다");
    }
  };

  const handleSessionUpdate = (id) => {
    refreshSessions();
  };

  // 사이드바에서 기존 세션 선택 시 isNew 해제
  const handleSelectSession = (id) => {
    setIsNewSession(false);
    setPendingMessage(null);
    setActiveId(id);
  };

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          height: "calc(100vh - 57px)",
          background: "#000",
          overflow: "hidden",
        }}
      >
        <Sidebar
          sessions={sessions}
          activeId={activeId}
          onSelect={handleSelectSession} // ← 변경
          onNew={handleNew}
          onDelete={handleDelete}
          onRename={handleRename}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {activeId ? (
            <ChatRoom
              key={activeId}
              sessionId={activeId}
              initialMessage={pendingMessage}
              onInitialMessageSent={() => setPendingMessage(null)}
              onSessionUpdate={handleSessionUpdate}
              chatApi={api.chat}
              isNew={isNewSession}
            />
          ) : (
            <ChatHome onSend={handleHomeMessage} />
          )}
        </div>
      </div>
    </>
  );
}
