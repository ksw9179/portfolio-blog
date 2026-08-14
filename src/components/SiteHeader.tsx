import Link from "next/link";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-2 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-mono text-sm font-bold tracking-widest text-ink uppercase"
        >
          SW<span className="text-accent">.</span>
        </Link>
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs tracking-widest text-ink-dim uppercase transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
