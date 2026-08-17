import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-surface-2 px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center">
        <p className="font-mono text-xs text-ink-dim">
          © {new Date().getFullYear()} 김선우(Seonwoo Kim). All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/ksw9179"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-ink-dim transition-colors hover:text-accent"
          >
            github.com/ksw9179
          </a>
          <Link
            href="/privacy"
            className="rounded-full border border-ink/40 px-3 py-1 font-mono text-xs text-ink transition-colors hover:border-ink hover:bg-ink/10"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
