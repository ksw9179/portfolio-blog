import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
        404
      </p>
      <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
        Page Not Found
      </h1>
      <p className="text-ink-dim">찾으시는 페이지가 없거나 이동되었습니다.</p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-accent px-5 py-2.5 font-mono text-sm font-bold text-bg transition-opacity hover:opacity-90"
      >
        Back to Home
      </Link>
    </div>
  );
}
