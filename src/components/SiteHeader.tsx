import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import Avatar from "@/components/Avatar";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/log", label: "Log" },
];

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: {
    username: string;
    avatar_url: string | null;
    role: string;
  } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, avatar_url, role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-surface-2 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-mono text-sm font-bold tracking-widest text-ink uppercase"
        >
          KSW&apos;s BLOG
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
          {user ? (
            <>
              <Link
                href="/write"
                className="font-mono text-xs tracking-widest text-ink-dim uppercase transition-colors hover:text-accent"
              >
                Write
              </Link>
              {profile?.role === "admin" && (
                <Link
                  href="/admin/reports"
                  className="font-mono text-xs tracking-widest text-ink-dim uppercase transition-colors hover:text-accent"
                >
                  Admin
                </Link>
              )}
              <form action={logout}>
                <button
                  type="submit"
                  className="font-mono text-xs tracking-widest text-ink-dim uppercase transition-colors hover:text-accent"
                >
                  Logout
                </button>
              </form>
              {profile && (
                <Avatar
                  username={profile.username}
                  avatarUrl={profile.avatar_url}
                  size={28}
                />
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="font-mono text-xs tracking-widest text-ink-dim uppercase transition-colors hover:text-accent"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
