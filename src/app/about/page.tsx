import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "경희대학교에서 AI와 생명공학을 함께 공부하는 김선우(Seonwoo Kim)를 소개합니다.",
};

const INTERESTS = ["AI / ML", "Bioinformatics", "Biotechnology", "Data Analysis"];

const ABOUT_POINTS = [
  "경희대학교에서 AI와 생명공학을 함께 공부",
  "Top-Down method와 Bottom-up method를 융합하는 방식 선호",
  "NumPy만으로 역전파 알고리즘 직접 구현",
  "자동미분(autograd) 엔진을 처음부터 설계·구현",
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6 py-20">
      <div className="flex flex-col items-start gap-2">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          About
        </p>
        <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
          김선우(Seonwoo Kim)
        </h1>
      </div>

      <div className="grid gap-10 sm:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-surface-2">
          <Image
            src="/images/profile.jpg"
            alt="김선우(Seonwoo Kim)"
            width={1000}
            height={1250}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-2.5 text-lg text-ink-dim">
            {ABOUT_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <span className="mt-1 text-accent">·</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs tracking-[0.3em] text-ink-dim uppercase">
              Interests
            </p>
            <ul className="flex flex-wrap gap-2">
              {INTERESTS.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-surface-2 bg-surface px-3 py-1 font-mono text-xs text-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
