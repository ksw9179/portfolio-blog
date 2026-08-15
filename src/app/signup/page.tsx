"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthField from "@/components/AuthField";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-4 px-6 py-32 text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Signup
        </p>
        <h1 className="text-2xl font-black text-ink">Check your email</h1>
        <p className="text-ink-dim">
          We sent a confirmation link to {email}. Click it to finish signing
          up.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-6 py-32">
      <div className="flex flex-col gap-2 text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Signup
        </p>
        <h1 className="text-3xl font-black text-ink">Sign Up</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          label="Username"
          value={username}
          onChange={setUsername}
          required
        />
        <AuthField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />
        <AuthField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
          minLength={6}
        />

        {error && <p className="font-mono text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-accent px-5 py-3 font-mono text-sm font-bold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-dim">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
