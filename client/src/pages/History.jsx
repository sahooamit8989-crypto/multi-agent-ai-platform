import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import {
  getChats,
  deleteChat,
} from "../services/api";

function History() {
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getChats();

        setChats(data.chats || []);
      } catch (error) {
        console.error("Fetch Chats Error:", error);
        setError(
          error.message || "Unable to load chat history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const getAgentIcon = (type) => {
    const icons = {
      coding: "</>",
      research: "⌕",
      writing: "✎",
      data: "▥",
      general: "✦",
    };

    return icons[type] || "✦";
  };

  const getAgentStyle = (type) => {
    const styles = {
      coding:
        "bg-blue-500/10 text-blue-400 border-blue-500/20",
      research:
        "bg-violet-500/10 text-violet-400 border-violet-500/20",
      writing:
        "bg-pink-500/10 text-pink-400 border-pink-500/20",
      data:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      general:
        "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    };

    return (
      styles[type] ||
      "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  const filteredChats = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return chats;
    }

    return chats.filter((chat) => {
      const title =
        chat.title?.toLowerCase() || "";

      const agent =
        chat.agentId?.name?.toLowerCase() || "";

      const type =
        chat.agentId?.type?.toLowerCase() || "";

      return (
        title.includes(value) ||
        agent.includes(value) ||
        type.includes(value)
      );
    });
  }, [chats, search]);

  const totalMessages = chats.reduce(
    (total, chat) =>
      total + (chat.messages?.length || 0),
    0
  );

  const handleDelete = async (chatId) => {
    const confirmed = window.confirm(
      "Delete this conversation permanently?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(chatId);
      setError("");

      await deleteChat(chatId);

      setChats((previous) =>
        previous.filter(
          (chat) => chat._id !== chatId
        )
      );
    } catch (error) {
      console.error("Delete Chat Error:", error);

      setError(
        error.message || "Unable to delete chat."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

            {/* Header */}
            <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 p-6 sm:p-8">

              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Workspace
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Chat History
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Continue your previous conversations with
                  your AI agents.
                </p>
              </div>
            </section>

            {/* Stats */}
            <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5">
                <p className="text-xs text-slate-500">
                  Conversations
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {chats.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5">
                <p className="text-xs text-slate-500">
                  Total Messages
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {totalMessages}
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:col-span-1 sm:p-5">
                <p className="text-xs text-slate-500">
                  Active Workspace
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">
                    Ready
                  </span>
                </div>
              </div>
            </section>

            {/* Toolbar */}
            <section className="mt-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-xl font-bold">
                    Your conversations
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {filteredChats.length}{" "}
                    conversation
                    {filteredChats.length !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>

                <div className="relative w-full sm:w-80">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                    ⌕
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search conversations..."
                    className="h-11 w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="mt-6 space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-28 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
                  />
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading &&
              !error &&
              chats.length === 0 && (
                <div className="mt-6 flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/40 px-6">
                  <div className="max-w-md text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl text-indigo-400">
                      ◷
                    </div>

                    <h2 className="mt-5 text-xl font-bold">
                      No conversations yet
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Start a conversation with one of your
                      AI agents and it will appear here.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/dashboard")
                      }
                      className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                    >
                      Explore AI Agents
                    </button>
                  </div>
                </div>
              )}

            {/* No Search Results */}
            {!loading &&
              !error &&
              chats.length > 0 &&
              filteredChats.length === 0 && (
                <div className="mt-6 flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/40 px-6">
                  <div className="text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-lg text-slate-500">
                      ⌕
                    </div>

                    <h3 className="mt-4 font-semibold">
                      No matching conversations
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Try searching for another title or agent.
                    </p>

                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              )}

            {/* Chat List */}
            {!loading &&
              filteredChats.length > 0 && (
                <section className="mt-6 space-y-3">

                  {filteredChats.map((chat) => {
                    const agentType =
                      chat.agentId?.type || "general";

                    return (
                      <div
                        key={chat._id}
                        className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-slate-700 hover:bg-slate-900 sm:p-5"
                      >
                        <div className="flex items-start gap-4">

                          {/* Agent Icon */}
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${getAgentStyle(
                              agentType
                            )}`}
                          >
                            {getAgentIcon(
                              agentType
                            )}
                          </div>

                          {/* Content */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/chats/${chat._id}`
                              )
                            }
                            className="min-w-0 flex-1 text-left"
                          >
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">

                              <h3 className="truncate text-base font-semibold text-white transition group-hover:text-indigo-300">
                                {chat.title ||
                                  "New Chat"}
                              </h3>

                              <span className="w-fit rounded-full border border-slate-800 bg-slate-950 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                {agentType}
                              </span>
                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                              {chat.agentId?.name ||
                                "AI Agent"}
                            </p>

                            {/* Last Message */}
                            {chat.messages?.length >
                              0 && (
                              <p className="mt-3 line-clamp-1 text-sm text-slate-600">
                                {
                                  chat.messages[
                                    chat.messages
                                      .length - 1
                                  ]?.content
                                }
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                              <span>
                                {chat.messages?.length ||
                                  0}{" "}
                                messages
                              </span>

                              <span>•</span>

                              <span>
                                {formatDate(
                                  chat.updatedAt
                                )}
                              </span>

                              <span>•</span>

                              <span>
                                {formatTime(
                                  chat.updatedAt
                                )}
                              </span>
                            </div>
                          </button>

                          {/* Actions */}
                          <div className="flex shrink-0 items-center">

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  chat._id
                                )
                              }
                              disabled={
                                deletingId ===
                                chat._id
                              }
                              className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId ===
                              chat._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/chats/${chat._id}`
                                )
                              }
                              className="hidden rounded-lg px-3 py-2 text-xs font-semibold text-indigo-400 transition hover:bg-indigo-500/10 sm:block"
                            >
                              Open →
                            </button>

                          </div>
                        </div>
                      </div>
                    );
                  })}

                </section>
              )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default History;