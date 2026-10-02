import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login submitted");

    setError("");
    setLoading(true);

    try {
      console.log("Calling login API...");

      const data = await loginUser(email, password);

      console.log("Login API response:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Token saved");

      navigate("/dashboard");

      console.log("Navigate called");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Section */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-10 lg:flex xl:p-16">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between">

            {/* Logo */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-bold backdrop-blur">
                  AI
                </div>

                <span className="text-xl font-bold">
                  MultiAgent
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-100">
                AI Workspace
              </p>

              <h1 className="text-4xl font-bold leading-tight xl:text-6xl">
                One workspace.
                <br />
                Multiple AI agents.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-indigo-100 xl:text-lg">
                Work with specialized AI agents for coding, research,
                writing, data analysis, and everyday tasks.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {["Coding", "Research", "Writing", "Data"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <p className="text-sm text-indigo-100/70">
              Intelligent tools. One simple workspace.
            </p>
          </div>
        </section>

        {/* Right Section */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold">
                AI
              </div>

              <span className="text-lg font-bold">
                MultiAgent
              </span>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                Sign in to continue to your AI workspace.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 pr-20 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 accent-indigo-600"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-slate-400"
                >
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                Create account
              </Link>
            </p>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-xs text-slate-600">
                AI-powered workspace
              </span>

              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <p className="text-center text-xs leading-5 text-slate-500">
              Your workspace gives you access to specialized AI agents
              designed for different tasks.
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;