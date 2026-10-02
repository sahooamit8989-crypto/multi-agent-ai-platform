import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "";

  const getInitial = () => {
    return userName.charAt(0).toUpperCase();
  };

  const getPageTitle = () => {
    if (location.pathname === "/dashboard") {
      return "Dashboard";
    }

    if (location.pathname === "/history") {
      return "Chat History";
    }

    if (location.pathname.startsWith("/agents/")) {
      return "AI Agent";
    }

    if (location.pathname.startsWith("/chats/")) {
      return "Conversation";
    }

    return "AI Workspace";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    setOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LEFT SIDE */}
        <div className="flex min-w-0 items-center gap-3">

          {/* Logo + Brand */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-[11px] font-bold text-white">
              AI
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold text-white">
                Multi-Agent AI
              </p>

              <p className="text-[10px] text-slate-600">
                Intelligent Workspace
              </p>
            </div>
          </button>

          {/* Divider */}
          <div className="hidden h-6 w-px bg-slate-800 sm:block" />

          {/* Page Title */}
          <p className="hidden truncate text-sm font-medium text-slate-400 md:block">
            {getPageTitle()}
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative">

          {/* ONLY AVATAR BUTTON */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-sm font-semibold text-indigo-400 transition hover:border-slate-700 hover:bg-slate-800"
            aria-label="Open user menu"
          >
            {getInitial()}
          </button>

          {/* USER DROPDOWN */}
          {open && (
            <>
              {/* Outside click */}
              <button
                type="button"
                aria-label="Close user menu"
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />

              <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/30">

                {/* User Information */}
                <div className="border-b border-slate-800 p-4">
                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-semibold text-indigo-400 ring-1 ring-indigo-500/20">
                      {getInitial()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {userName}
                      </p>

                      {userEmail && (
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {userEmail}
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                {/* Account Status */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3 py-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                    <span className="text-xs font-medium text-emerald-400">
                      Account active
                    </span>
                  </div>
                </div>

                {/* Logout */}
                <div className="border-t border-slate-800 p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                      ↪
                    </span>

                    <span>Sign out</span>
                  </button>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;