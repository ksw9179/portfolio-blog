"use client";

import { useEffect, useRef } from "react";
import { animate, createScope, stagger } from "animejs";

type Day = { date: string; contributionCount: number };
type Week = { contributionDays: Day[] };

function levelOf(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

const LEVEL_BG = [
  "bg-surface-2",
  "bg-accent/25",
  "bg-accent/50",
  "bg-accent/75",
  "bg-accent",
];

export default function ContributionGrid({
  weeks,
  total,
}: {
  weeks: Week[];
  total: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      rootRef.current
        ?.querySelectorAll(".contrib-cell")
        .forEach((el) => ((el as HTMLElement).style.opacity = "1"));
      return;
    }

    const scope = createScope({ root: rootRef }).add(() => {
      animate(".contrib-cell", {
        opacity: [0, 1],
        scale: [0.3, 1],
        duration: 400,
        delay: stagger(3),
        ease: "outQuad",
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex flex-col gap-3">
      <p className="font-mono text-xs text-ink-dim">
        {total.toLocaleString()} contributions in the last year
      </p>
      <div className="flex gap-[3px] overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.contributionDays.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.contributionCount}`}
                className={`contrib-cell h-2.5 w-2.5 rounded-sm opacity-0 ${
                  LEVEL_BG[levelOf(day.contributionCount)]
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
