import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getChatById,
  executeAgent,
} from "../services/api";

function ChatView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // ============================
  // LOAD EXISTING CHAT
  // ============================
  useEffect(() => {
    const loadChat = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getChatById(id);

        if (!data?.success || !data?.chat) {
          throw new Error(
            data?.message || "Unable to load conversation"
          );
        }

        setChat(data.chat);
        setMessages(data.chat.messages || []);
      } catch (err) {
        console.error("Load Chat Error:", err);

        setError(
          err?.message ||
            "Unable to load this conversation."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadChat();
    }
  }, [id]);

  // ============================
  // AUTO SCROLL
  // ============================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  // ============================
  // SEND MESSAGE
  // ============================
  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || sending || !chat) {
      return;
    }

    const agentId =
      typeof chat.agentId === "object"
        ? chat.agentId._id
        : chat.agentId;

    if (!agentId) {
      setError("Agent information is missing.");
      return;
    }

    try {
      setSending(true);
      setError("");

      const userMessage = {
        role: "user",
        content: trimmedMessage,
        createdAt: new Date().toISOString(),
      };

      setMessages((previous) => [
        ...previous,
        userMessage,
      ]);

      setMessage("");

      const response = await executeAgent(
        agentId,
        chat._id,
        trimmedMessage
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to generate AI response"
        );
      }

      const assistantContent =
        response?.result?.response ||
        response?.result?.text ||
        "I could not generate a response.";

      const assistantMessage = {
        role: "assistant",
        content: assistantContent,
        createdAt: new Date().toISOString(),
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (err) {
      console.error("Send Message Error:", err);

      setError(
        err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  };

  // ============================
  // ENTER TO SEND
  // ============================
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!sending) {
        handleSend();
      }
    }
  };

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Loading conversation...
          </p>
        </div>
      </div>
    );
  }

  // ============================
  // ERROR
  // ============================
  if (error && !chat) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            !
          </div>

          <h2 className="mt-4 text-lg font-semibold text-white">
            Unable to open conversation
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/history")}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const agent = chat?.agentId;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-slate-950">

      {/* HEADER */}
      <div className="border-b border-slate-800">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">

          <button
            type="button"
            onClick={() => navigate("/history")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ←
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 font-bold text-indigo-400">
            AI
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-white sm:text-base">
              {chat?.title || "Conversation"}
            </h1>

            <p className="text-xs text-slate-600">
              {agent?.name || "AI Agent"}
            </p>
          </div>

        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">

          <div className="space-y-6 py-6">

            {messages.map((item, index) => {
              const isUser = item.role === "user";

              return (
                <div
                  key={`${item.role}-${index}`}
                  className={`flex ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[90%] gap-3 sm:max-w-[80%] ${
                      isUser
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                        isUser
                          ? "bg-slate-800 text-slate-400"
                          : "bg-indigo-500/10 text-indigo-400"
                      }`}
                    >
                      {isUser ? "You" : "AI"}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        isUser
                          ? "rounded-tr-md bg-indigo-600 text-white"
                          : "rounded-tl-md border border-slate-800 bg-slate-900 text-slate-300"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">
                        {item.content}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}

            {sending && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-[10px] font-bold text-indigo-400">
                  AI
                </div>

                <div className="rounded-2xl rounded-tl-md border border-slate-800 bg-slate-900 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500"
                      style={{
                        animationDelay: "150ms",
                      }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500"
                      style={{
                        animationDelay: "300ms",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className="sticky bottom-0 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6">

          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/70 focus-within:border-indigo-500/40">

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={sending}
              rows={1}
              placeholder="Continue this conversation..."
              className="min-h-[56px] max-h-40 w-full resize-none bg-transparent px-4 py-4 pr-14 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={
                sending || !message.trim()
              }
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600"
            >
              {sending ? "..." : "↑"}
            </button>

          </div>

          <p className="mt-2 px-1 text-[10px] text-slate-700">
            Shift + Enter for a new line
          </p>

        </div>
      </div>

    </div>
  );
}

export default ChatView;