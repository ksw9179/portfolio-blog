"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthField from "@/components/AuthField";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-6 py-32">
      <div className="flex flex-col gap-2 text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Login
        </p>
        <h1 className="text-3xl font-black text-ink">로그인</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          label="이메일"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />
        <AuthField
          label="비밀번호"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />

        {error && <p className="font-mono text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-accent px-5 py-3 font-mono text-sm font-bold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-dim">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
