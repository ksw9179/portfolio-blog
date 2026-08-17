import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  activities,
  certifications,
  education,
  projects,
} from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Education, Projects, Certifications, Activities.",
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-16 px-6 py-20">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Portfolio
        </p>
        <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
          Education · Projects · Certifications · Activities
        </h1>
      </div>

      <Section title="Education">
        <ul className="flex flex-col gap-3">
          {education.map((e, i) => (
            <li
              key={e.school}
              className={`flex flex-wrap items-baseline justify-between gap-2 ${
                i === 0
                  ? "border-b border-surface-2 pb-3 text-ink"
                  : "text-sm text-ink-dim"
              }`}
            >
              <span>{e.school}</span>
              <span className="font-mono text-xs text-ink-dim">
                {e.status}
                {e.period ? ` · ${e.period}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Projects">
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/portfolio/${p.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-surface-2 bg-surface p-5 transition-colors hover:border-accent-dim"
            >
              <span className="font-mono text-[11px] tracking-widest text-ink-dim uppercase">
                {p.status}
              </span>
              <h3 className="text-lg font-bold text-ink group-hover:text-accent">
                {p.title}
              </h3>
              <p className="text-sm text-ink-dim">{p.summary}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-ink-dim"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Certifications">
        <ul className="flex flex-col gap-2">
          {certifications.map((c) => (
            <li key={c.name} className="flex items-center gap-2 text-ink">
              <span className="text-accent">·</span>
              {c.name}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Activities">
        <ul className="flex flex-col gap-4">
          {activities.map((a) => (
            <li key={a.title} className="border-b border-surface-2 pb-4">
              <p className="text-ink">{a.title}</p>
              <p className="mt-1 font-mono text-xs text-ink-dim">
                {a.org} · {a.period}
              </p>
              <p className="mt-1 text-sm text-ink-dim">{a.description}</p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-t-2 border-ink pt-3 text-xl font-bold text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}
