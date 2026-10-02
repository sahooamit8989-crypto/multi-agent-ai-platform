import { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const [open, setOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "⌂",
    },
    {
      name: "History",
      path: "/history",
      icon: "◷",
    },
  ];

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-indigo-500/10 text-indigo-400"
        : "text-slate-500 hover:bg-slate-900 hover:text-slate-300"
    }`;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 lg:block">
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col p-4">

          <div className="mb-4 px-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Workspace
            </p>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={linkClasses}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs font-semibold text-slate-300">
              Multi-Agent AI
            </p>

            <p className="mt-1 text-[11px] leading-5 text-slate-600">
              Your intelligent workspace for specialized AI agents.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-lg text-white shadow-xl shadow-black/30 lg:hidden"
        aria-label="Open navigation"
      >
        ☰
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        >
          {/* Mobile Sidebar */}
          <aside
            className="h-full w-72 border-r border-slate-800 bg-slate-950 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold">
                  AI
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Multi-Agent AI
                  </p>

                  <p className="text-[10px] text-slate-600">
                    Intelligent Workspace
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-900 hover:text-white"
                aria-label="Close navigation"
              >
                ×
              </button>
            </div>

            {/* Navigation */}
            <div className="mt-8">
              <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                Workspace
              </p>

              <nav className="space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={linkClasses}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm">
                      {item.icon}
                    </span>

                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Bottom */}
            <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-xs font-semibold text-slate-300">
                AI Workspace
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-600">
                Choose an agent and start working.
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;