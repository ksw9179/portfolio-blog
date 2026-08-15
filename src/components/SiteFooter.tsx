export default function SiteFooter() {
  return (
    <footer className="border-t border-surface-2 px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center">
        <p className="font-mono text-xs text-ink-dim">
          © {new Date().getFullYear()} 김선우(Seonwoo Kim). All rights reserved.
        </p>
        <a
          href="https://github.com/ksw9179"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-ink-dim transition-colors hover:text-accent"
        >
          github.com/ksw9179
        </a>
      </div>
    </footer>
  );
}
