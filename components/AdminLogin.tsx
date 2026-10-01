"use client";

import { type FormEvent, useState } from "react";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Unable to sign in.");
      }

      window.location.href = "/admin";
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1120] px-5 py-10 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#111827] p-7 shadow-2xl shadow-slate-950/40">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">EarnPouch</p>
          <h1 className="mt-2 text-2xl font-bold">Admin access</h1>
          <p className="mt-2 text-sm text-slate-400">Use your site admin credentials to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            Username
            <input
              className="mt-2 block min-h-11 w-full rounded border border-slate-700 bg-[#0f172a] px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Password
            <input
              className="mt-2 block min-h-11 w-full rounded border border-slate-700 bg-[#0f172a] px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="rounded border border-red-800 bg-red-950/50 px-3 py-2 text-sm text-red-200">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 w-full items-center justify-center rounded bg-amber-400 px-4 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
