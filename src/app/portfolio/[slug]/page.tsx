import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/portfolio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
    twitter: { title: project.title, description: project.summary },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-20">
      <Link
        href="/portfolio"
        className="w-fit font-mono text-xs tracking-widest text-ink-dim uppercase transition-colors hover:text-accent"
      >
        ← Portfolio
      </Link>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-accent-dim px-3 py-1 font-mono text-xs text-accent uppercase">
            {project.status}
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
          {project.title}
        </h1>
        <p className="text-lg text-ink-dim">{project.summary}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-full border border-surface-2 bg-surface px-3 py-1 font-mono text-xs text-ink"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        <Detail label="Problem" text={project.problem} />
        <Detail label="Approach" text={project.approach} />
        <Detail label="Result" text={project.result} />
      </div>

      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-mono text-sm font-bold text-bg transition-opacity hover:opacity-90"
        >
          View on GitHub →
        </a>
      )}
    </div>
  );
}

function Detail({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
        {label}
      </p>
      <p className="leading-relaxed text-ink-dim">{text}</p>
    </div>
  );
}
