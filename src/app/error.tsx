"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
        Error
      </p>
      <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
        Something Went Wrong
      </h1>
      <p className="text-ink-dim">
        일시적인 오류가 발생했습니다. 다시 시도해주세요.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => retry()}
          className="rounded-full bg-accent px-5 py-2.5 font-mono text-sm font-bold text-bg transition-opacity hover:opacity-90"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-full border border-ink/40 px-5 py-2.5 font-mono text-sm text-ink transition-colors hover:border-ink hover:bg-ink/10"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
