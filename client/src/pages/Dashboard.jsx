import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getAgents } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAgents();

        setAgents(data.agents || []);
      } catch (error) {
        console.error("Fetch Agents Error:", error);

        setError(
          error.message || "Unable to load AI agents."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
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

  const getAgentColor = (type) => {
    const colors = {
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
      colors[type] ||
      "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
    );
  };

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        agent.description
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        selectedType === "all" ||
        agent.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [agents, search, selectedType]);

  const agentTypes = [
    {
      value: "all",
      label: "All Agents",
    },
    {
      value: "coding",
      label: "Coding",
    },
    {
      value: "research",
      label: "Research",
    },
    {
      value: "writing",
      label: "Writing",
    },
    {
      value: "data",
      label: "Data",
    },
    {
      value: "general",
      label: "General",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 p-6 sm:p-8 lg:p-10">

              {/* Background Glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />

              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  AI Workspace
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  What do you want to accomplish?
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  Choose a specialized AI agent and start working on
                  your next task. Each agent is designed for a different
                  type of work.
                </p>
              </div>
            </section>

            {/* Stats */}
            <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5">
                <p className="text-xs font-medium text-slate-500">
                  Available Agents
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {agents.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5">
                <p className="text-xs font-medium text-slate-500">
                  Agent Types
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {new Set(
                    agents.map((agent) => agent.type)
                  ).size}
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:col-span-1 sm:p-5">
                <p className="text-xs font-medium text-slate-500">
                  Platform Status
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <span className="text-sm font-semibold text-emerald-400">
                    All Systems Active
                  </span>
                </div>
              </div>
            </section>

            {/* Agent Section */}
            <section className="mt-8">

              {/* Section Header */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                <div>
                  <p className="text-sm font-medium text-indigo-400">
                    Your AI Agents
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    Choose an agent
                  </h2>
                </div>

                {/* Search */}
                <div className="relative w-full lg:w-80">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                    ⌕
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search agents..."
                    className="h-11 w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {agentTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setSelectedType(type.value)
                    }
                    className={`shrink-0 rounded-xl px-4 py-2 text-xs font-medium transition ${
                      selectedType === type.value
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map(
                    (item) => (
                      <div
                        key={item}
                        className="h-56 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
                      />
                    )
                  )}
                </div>
              )}

              {/* Empty Search */}
              {!loading &&
                !error &&
                filteredAgents.length === 0 && (
                  <div className="mt-6 flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 px-6">
                    <div className="text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-lg text-slate-500">
                        ⌕
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-white">
                        No agents found
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        Try another search or category.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setSelectedType("all");
                        }}
                        className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>
                )}

              {/* Agent Cards */}
              {!loading &&
                filteredAgents.length > 0 && (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredAgents.map((agent) => (
                      <button
                        key={agent._id}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/agents/${agent._id}`
                          )
                        }
                        className="group flex min-h-[250px] flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900 hover:shadow-xl hover:shadow-black/10"
                      >
                        {/* Top */}
                        <div className="flex items-start justify-between gap-4">

                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-bold ${getAgentColor(
                              agent.type
                            )}`}
                          >
                            {getAgentIcon(
                              agent.type
                            )}
                          </div>

                          <span className="rounded-full border border-slate-800 bg-slate-950 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                            {agent.type}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="mt-5 flex-1">
                          <h3 className="text-lg font-semibold text-white transition group-hover:text-indigo-300">
                            {agent.name}
                          </h3>

                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                            {agent.description}
                          </p>
                        </div>

                        {/* Bottom */}
                        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">

                          <span className="text-xs font-medium text-slate-600">
                            Specialized AI
                          </span>

                          <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 transition group-hover:gap-2.5">
                            Start Chat
                            <span>→</span>
                          </span>

                        </div>
                      </button>
                    ))}
                  </div>
                )}

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;