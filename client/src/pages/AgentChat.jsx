import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAgentById,
  createChat,
  executeAgent,
} from "../services/api";

function AgentChat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [agent, setAgent] = useState(null);
  const [chatId, setChatId] = useState(null);

  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  // ============================
  // LOAD AGENT ONLY
  // ============================
  useEffect(() => {
    const loadAgent = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAgentById(id);

        if (!data?.success || !data?.agent) {
          throw new Error(
            data?.message || "Unable to load agent"
          );
        }

        setAgent(data.agent);

        // IMPORTANT:
        // Do NOT create a chat here.
        //
        // Chat will be created only when
        // the user sends the first message.
        setChatId(null);
        setMessages([]);
      } catch (err) {
        console.error("Load Agent Error:", err);

        setError(
          err?.message ||
            "Unable to load this AI agent."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAgent();
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
  // FOCUS TEXTAREA
  // ============================
  useEffect(() => {
    if (!loading && !error) {
      textareaRef.current?.focus();
    }
  }, [loading, error]);

  // ============================
  // CREATE CHAT ONLY WHEN
  // FIRST MESSAGE IS SENT
  // ============================
  const ensureChatExists = async () => {
    if (chatId) {
      return chatId;
    }

    const chatResponse = await createChat(
      agent._id,
      "New Chat"
    );

    if (
      !chatResponse?.success ||
      !chatResponse?.chat
    ) {
      throw new Error(
        chatResponse?.message ||
          "Unable to create chat"
      );
    }

    const newChatId = chatResponse.chat._id;

    setChatId(newChatId);

    return newChatId;
  };

  // ============================
  // SEND MESSAGE
  // ============================
  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    if (!agent || sending) {
      return;
    }

    try {
      setSending(true);
      setError("");

      /*
       * IMPORTANT:
       *
       * If this is the first message,
       * create the chat here.
       *
       * Therefore simply opening the
       * agent does NOT create history.
       */
      const activeChatId =
        await ensureChatExists();

      // Show user message immediately
      const temporaryUserMessage = {
        role: "user",
        content: trimmedMessage,
        createdAt: new Date().toISOString(),
      };

      setMessages((previous) => [
        ...previous,
        temporaryUserMessage,
      ]);

      // Clear input
      setMessage("");

      // Send message to backend
      const response = await executeAgent(
        agent._id,
        activeChatId,
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

      // Add AI response
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
  // SHIFT + ENTER = NEW LINE
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
  // AGENT ICON
  // ============================
  const getAgentIcon = () => {
    switch (agent?.type) {
      case "coding":
        return "</>";

      case "research":
        return "⌕";

      case "writing":
        return "✎";

      case "data":
        return "▦";

      default:
        return "✦";
    }
  };

  // ============================
  // AGENT DESCRIPTION
  // ============================
  const getAgentDescription = () => {
    if (agent?.description) {
      return agent.description;
    }

    switch (agent?.type) {
      case "coding":
        return "Build, debug and understand code.";

      case "research":
        return "Analyze topics and organize information.";

      case "writing":
        return "Create clear and professional content.";

      case "data":
        return "Analyze data and solve data problems.";

      default:
        return "Your general-purpose AI assistant.";
    }
  };

  // ============================
  // LOADING STATE
  // ============================
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center px-4">
          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-300">
              Loading AI agent...
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Preparing your workspace
            </p>

          </div>
        </div>
      </div>
    );
  }

  // ============================
  // ERROR STATE
  // ============================
  if (error && !agent) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center px-4">

          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-lg text-red-400">
              !
            </div>

            <h2 className="mt-4 text-lg font-semibold text-white">
              Unable to open agent
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Back to Dashboard
            </button>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-slate-950">

      {/* =================================
          HEADER
      ================================== */}
      <div className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">

          {/* Back + Agent */}
          <div className="flex min-w-0 items-center gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
              aria-label="Back to dashboard"
            >
              ←
            </button>

            {/* Agent Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-sm font-bold text-indigo-400 ring-1 ring-indigo-500/20">
              {getAgentIcon()}
            </div>

            {/* Agent Info */}
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold text-white sm:text-base">
                {agent?.name || "AI Agent"}
              </h1>

              <p className="truncate text-xs text-slate-600">
                {getAgentDescription()}
              </p>
            </div>

          </div>

          {/* Chat Status */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <span
              className={`h-2 w-2 rounded-full ${
                chatId
                  ? "bg-emerald-400"
                  : "bg-slate-600"
              }`}
            />

            <span className="text-xs text-slate-600">
              {chatId
                ? "Conversation active"
                : "New conversation"}
            </span>
          </div>

        </div>
      </div>

      {/* =================================
          CHAT AREA
      ================================== */}
      <div className="flex-1">
        <div className="mx-auto flex min-h-[calc(100vh-13rem)] w-full max-w-5xl flex-col px-4 sm:px-6">

          {/* Empty State */}
          {messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center py-16">

              <div className="w-full max-w-xl text-center">

                {/* Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-xl font-bold text-indigo-400">
                  {getAgentIcon()}
                </div>

                <h2 className="mt-6 text-xl font-bold text-white sm:text-2xl">
                  {agent?.name || "AI Agent"}
                </h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                  {getAgentDescription()}
                </p>

                {/* Important history message */}
                <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-left">
                  <span className="text-sm text-indigo-400">
                    ✦
                  </span>

                  <p className="text-xs leading-5 text-slate-500">
                    This conversation will appear in
                    History after you send your first
                    message.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="flex-1 space-y-6 py-6">

              {messages.map((item, index) => {
                const isUser =
                  item.role === "user";

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
                          : "flex-row"
                      }`}
                    >

                      {/* Avatar */}
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                          isUser
                            ? "bg-slate-800 text-slate-400"
                            : "bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20"
                        }`}
                      >
                        {isUser
                          ? "You"
                          : "AI"}
                      </div>

                      {/* Message */}
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

              {/* AI typing */}
              {sending && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-[10px] font-bold text-indigo-400 ring-1 ring-indigo-500/20">
                      AI
                    </div>

                    <div className="rounded-2xl rounded-tl-md border border-slate-800 bg-slate-900 px-4 py-3">

                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" />
                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500"
                          style={{
                            animationDelay:
                              "150ms",
                          }}
                        />
                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500"
                          style={{
                            animationDelay:
                              "300ms",
                          }}
                        />
                      </div>

                    </div>

                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />

            </div>
          )}

          {/* Error while sending */}
          {error && agent && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
              <div className="flex items-start gap-3">

                <span className="text-sm text-red-400">
                  !
                </span>

                <div>
                  <p className="text-xs font-medium text-red-400">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-400/70">
                    {error}
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* =================================
          INPUT AREA
      ================================== */}
      <div className="sticky bottom-0 border-t border-slate-800 bg-slate-950/95 backdrop-blur">

        <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6">

          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/70 transition focus-within:border-indigo-500/40">

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={sending}
              rows={1}
              placeholder={`Message ${agent?.name || "AI Agent"}...`}
              className="max-h-40 min-h-[56px] w-full resize-none bg-transparent px-4 py-4 pr-14 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={
                sending ||
                !message.trim() ||
                !agent
              }
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-600"
              aria-label="Send message"
            >
              {sending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
              ) : (
                "↑"
              )}
            </button>

          </div>

          {/* Input Footer */}
          <div className="mt-2 flex items-center justify-between px-1">

            <p className="text-[10px] text-slate-700">
              Shift + Enter for a new line
            </p>

            <p className="text-[10px] text-slate-700">
              AI responses may contain errors
            </p>

          </div>

        </div>
      </div>

    </div>
  );
}

export default AgentChat;