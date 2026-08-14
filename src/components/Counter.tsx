"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createScope, stagger } from "animejs";

type CounterProps = {
  label: string;
};

export default function Counter({ label }: CounterProps) {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title =
      count === 0 ? "React 연습" : `${count}번 눌렀어요 · React 연습`;
  }, [count]);

  useEffect(() => {
    const scope = createScope({ root: cardRef }).add(() => {
      animate(".reveal", {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 500,
        delay: stagger(120),
        ease: "outExpo",
      });
    });
    return () => scope.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-10 py-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <p className="reveal text-lg text-zinc-600 dark:text-zinc-400">
        {label}
      </p>
      <p className="reveal text-5xl font-bold tabular-nums text-black dark:text-white">
        {count}
      </p>
      <button
        onClick={() => setCount(count + 1)}
        className="reveal rounded-full bg-black px-6 py-3 text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        눌러보세요
      </button>
    </div>
  );
}
