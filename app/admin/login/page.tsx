
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setLoading(false);
      setError(error?.message ?? "Unable to sign in. Please try again.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError || !profile || !["owner", "admin", "manager", "photographer", "videographer", "editor"].includes(profile.role)) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("This account does not have an authorised studio role.");
      return;
    }

    setLoading(false);
    router.replace(["owner", "admin"].includes(profile.role) ? "/admin" : "/staff");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f1e9] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-5 border border-[#d8cdbb] bg-white p-8 shadow-sm"
      >
        <p className="text-xs tracking-[0.25em] text-[#9b815c]">
          CHIRAG PHOTOGRAPHY
        </p>

        <h1 className="text-3xl">Studio Login</h1>

        <p className="text-sm text-gray-500">
          Sign in to access your photography management workspace.
        </p>

        <label className="block text-sm">
          Email address
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border border-gray-300 p-3"
            placeholder="Enter your email"
          />
        </label>

        <label className="block text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-gray-300 p-3"
            placeholder="Enter your password"
          />
        </label>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black p-3 text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <Link
          href="/"
          className="block pt-2 text-center text-sm text-[#8b7658] underline-offset-4 transition hover:text-black hover:underline"
        >
          ← Back to website
        </Link>
      </form>
    </main>
  );
}
