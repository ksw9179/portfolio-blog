"use client";

import { useEffect, useRef } from "react";
import { animate, createScope, stagger } from "animejs";

export type ActivityItem = {
  id: string;
  kind: string;
  repo: string;
  message: string;
  url: string;
  date: string;
};

export default function ActivityList({ items }: { items: ActivityItem[] }) {
  const rootRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      rootRef.current
        ?.querySelectorAll(".activity-item")
        .forEach((el) => ((el as HTMLElement).style.opacity = "1"));
      return;
    }

    const scope = createScope({ root: rootRef }).add(() => {
      animate(".activity-item", {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 400,
        delay: stagger(60),
        ease: "outQuad",
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <ul ref={rootRef} className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.id} className="activity-item opacity-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-baseline gap-3 rounded-xl border border-surface-2 bg-surface px-4 py-3 transition-colors hover:border-accent-dim"
          >
            <span className="shrink-0 rounded-full border border-surface-2 px-2 py-0.5 font-mono text-[10px] text-accent uppercase">
              {item.kind}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-ink group-hover:text-accent">
              {item.message}
            </span>
            <span className="shrink-0 font-mono text-[11px] text-ink-dim">
              {item.repo.split("/")[1]}
            </span>
            <span className="shrink-0 font-mono text-[11px] text-ink-dim">
              {new Date(item.date).toLocaleDateString("ko-KR")}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
