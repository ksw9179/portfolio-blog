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
        <h1 className="text-2xl font-black text-ink">이메일을 확인해주세요</h1>
        <p className="text-ink-dim">
          {email}로 인증 메일을 보냈습니다. 메일의 링크를 클릭하면 가입이
          완료됩니다.
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
        <h1 className="text-3xl font-black text-ink">회원가입</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField label="아이디" value={username} onChange={setUsername} required />
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
          minLength={6}
        />

        {error && <p className="font-mono text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-accent px-5 py-3 font-mono text-sm font-bold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "가입 중..." : "가입하기"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-dim">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-accent hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
