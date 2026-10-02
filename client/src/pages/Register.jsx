import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await registerUser(
        name.trim(),
        email.trim(),
        password
      );

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Registration Error:", error);

      setError(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Branding Section */}
        <div className="relative hidden overflow-hidden border-r border-slate-800 lg:flex lg:flex-col lg:justify-between">
          
          {/* Background Glow */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

          {/* Brand */}
          <div className="relative z-10 p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold shadow-lg shadow-indigo-600/20">
                AI
              </div>

              <div>
                <p className="text-base font-bold text-white">
                  Multi-Agent AI
                </p>

                <p className="text-xs text-slate-500">
                  Intelligent Workspace
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 px-10 pb-20">
            <div className="max-w-xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                AI-powered workspace
              </div>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Build, research and create with specialized AI agents.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-500">
                Create one account and access specialized AI agents for
                coding, research, writing, data analysis and general tasks.
              </p>

              {/* Features */}
              <div className="mt-8 grid grid-cols-2 gap-3">

                {[
                  ["⌘", "Specialized Agents"],
                  ["⚡", "Fast AI Responses"],
                  ["◷", "Chat History"],
                  ["▥", "Organized Workspace"],
                ].map(([icon, title]) => (
                  <div
                    key={title}
                    className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-sm text-indigo-400">
                      {icon}
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-300">
                      {title}
                    </p>
                  </div>
                ))}

              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 px-10 pb-8 text-xs text-slate-700">
            © 2026 Multi-Agent AI Platform
          </div>
        </div>

        {/* Register Section */}
        <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-12">

          <div className="w-full max-w-md">

            {/* Mobile Brand */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold">
                AI
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Multi-Agent AI
                </p>

                <p className="text-[11px] text-slate-600">
                  Intelligent Workspace
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-indigo-400">
                Get started
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Start using your AI-powered workspace today.
              </p>
            </div>

            {/* Form Card */}
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 shadow-2xl shadow-black/10 sm:p-6">

              {/* Error */}
              {error && (
                <div className="mb-5 flex gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xs text-red-400">
                    !
                  </div>

                  <p className="text-sm leading-5 text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="mb-5 flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs text-emerald-400">
                    ✓
                  </div>

                  <p className="text-sm leading-5 text-emerald-400">
                    {success}
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Confirm password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Terms */}
                <p className="text-xs leading-5 text-slate-600">
                  By creating an account, you agree to use the platform
                  responsibly and securely.
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>

              {/* Login */}
              <div className="mt-6 border-t border-slate-800 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?
                </p>

                <Link
                  to="/login"
                  className="mt-1 inline-block text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
                >
                  Sign in
                </Link>
              </div>
            </div>

            {/* Bottom Note */}
            <p className="mt-6 text-center text-xs text-slate-700">
              Your account gives you access to all available AI agents.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;