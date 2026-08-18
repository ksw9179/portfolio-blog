"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, stagger, svg } from "animejs";
import NeuralBackground from "@/components/NeuralBackground";
import RobotBust from "@/components/RobotBust";

const HUD_LINES = ["[ SCANNING... ]", "IDENTITY CONFIRMED"];

// 스캔 시퀀스가 시작되기까지, 로봇이 등장하는 데 걸리는 시간(ms)
const SCAN_START = 1250;

// 로봇 흉상의 왼팔(화면 기준) 인사 동작 — 기본 각도(8deg)에서 들어올려 흔들었다가 복귀
const WAVE_ROTATE = ["8deg", "115deg", "90deg", "125deg", "90deg", "8deg"];
const WAVE_DURATION = 1700;

export default function HeroScan() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      const root = rootRef.current;
      if (root) {
        root
          .querySelectorAll(
            ".reveal, .bracket, .scanline, .hud-flicker, .robot, .robot-bust"
          )
          .forEach((el) => {
            (el as HTMLElement).style.opacity = "1";
            (el as HTMLElement).style.transform = "none";
          });
      }
      return;
    }

    const scope = createScope({ root: rootRef }).add(() => {
      // 로봇 아이콘의 선(안테나/머리 윤곽/귀/입)을 그려지는 상태로 미리 감춤
      const robotStrokes = svg.createDrawable(".robot-stroke");

      const tl = createTimeline({ defaults: { ease: "outExpo" } });

      // 1. 로봇 등장 — 아이콘 틀은 빠르게 나타나고, 그 위에 선이 천천히 그려짐
      //    (동시에 진행하면 두 효과가 묻혀서 선 그려지는 게 잘 안 보였음)
      tl.add(
        ".robot",
        {
          opacity: [0, 1],
          scale: [0.85, 1],
          translateY: [8, 0],
          duration: 200,
          ease: "outQuad",
        },
        0
      )
        .add(
          robotStrokes,
          { draw: ["0 0", "0 1"], duration: 550, delay: stagger(80) },
          120
        )
        .add(
          ".robot-eye",
          { opacity: [1, 0.3, 1], duration: 260 },
          900
        )
        // 2. 스캔 라인 시작 — 3초 동안 천천히 훑고 지나가며 잘 보이게
        .add(
          ".scanline",
          {
            translateY: ["0%", "100%"],
            duration: 3000,
            ease: "inOutQuad",
          },
          SCAN_START
        )
        .add(
          ".hud-flicker-1",
          { opacity: [0, 1, 1, 0], duration: 550 },
          SCAN_START + 150
        )
        .add(
          ".bracket",
          { opacity: [0, 1, 0.6], scale: [0.85, 1], duration: 450 },
          SCAN_START + 550
        )
        .add(
          ".hud-flicker-2",
          { opacity: [0, 1, 1, 0], duration: 650 },
          SCAN_START + 1000
        )
        .add(
          ".reveal",
          {
            opacity: [0, 1],
            translateY: [14, 0],
            duration: 650,
            delay: stagger(100),
          },
          SCAN_START + 1150
        )
        .add(
          ".scanline",
          { opacity: [1, 0], duration: 500 },
          SCAN_START + 2800
        )
        // 3. 로봇 흉상은 처음부터 함께 등장 (작은 와이어프레임 로봇 아이콘과 동시)
        .add(
          ".robot-bust",
          {
            opacity: [0, 1],
            scale: [0.85, 1],
            translateX: [24, 0],
            duration: 700,
          },
          0
        )
        // 4. 등장 직후, 손을 흔들며 인사
        .add(
          ".wave-arm",
          { rotate: WAVE_ROTATE, duration: WAVE_DURATION, ease: "inOutSine" },
          850
        );
    });

    return () => scope.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative w-full overflow-hidden">
      <NeuralBackground />
      <RobotBust />

      <div
        className="scanline pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          boxShadow: "0 0 20px 2px var(--color-accent)",
        }}
      />

      <div className="flex min-h-[85vh] flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <svg
          className="robot h-16 w-16 translate-y-2 scale-90 text-accent opacity-0"
          style={{ filter: "drop-shadow(0 0 14px var(--color-accent-dim))" }}
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line className="robot-stroke" x1="36" y1="6" x2="36" y2="16" stroke="currentColor" strokeWidth="2" />
          <circle cx="36" cy="4" r="3" fill="currentColor" />
          <rect className="robot-stroke" x="14" y="16" width="44" height="36" rx="10" stroke="currentColor" strokeWidth="2" />
          <line className="robot-stroke" x1="14" y1="28" x2="8" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line className="robot-stroke" x1="58" y1="28" x2="64" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle className="robot-eye" cx="27" cy="34" r="4" fill="currentColor" />
          <circle className="robot-eye" cx="45" cy="34" r="4" fill="currentColor" />
          <line className="robot-stroke" x1="24" y1="45" x2="48" y2="45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        <p className="hud-flicker hud-flicker-1 font-mono text-xs tracking-[0.35em] text-accent uppercase opacity-0">
          {HUD_LINES[0]}
        </p>

        <div className="relative w-fit">
          <span className="bracket absolute -top-4 -left-4 h-6 w-6 scale-[0.85] border-t-2 border-l-2 border-accent opacity-0" />
          <span className="bracket absolute -top-4 -right-4 h-6 w-6 scale-[0.85] border-t-2 border-r-2 border-accent opacity-0" />
          <span className="bracket absolute -bottom-4 -left-4 h-6 w-6 scale-[0.85] border-b-2 border-l-2 border-accent opacity-0" />
          <span className="bracket absolute -right-4 -bottom-4 h-6 w-6 scale-[0.85] border-r-2 border-b-2 border-accent opacity-0" />

          <h1 className="text-6xl leading-[0.95] font-black tracking-tight text-ink sm:text-8xl">
            <span className="reveal inline-block translate-y-[14px] text-accent opacity-0 [text-shadow:0_0_40px_var(--color-accent-dim)]">
              SW
            </span>{" "}
            <span className="reveal inline-block translate-y-[14px] opacity-0">
              makes
            </span>{" "}
            <span className="reveal inline-block translate-y-[14px] text-accent opacity-0 [text-shadow:0_0_40px_var(--color-accent-dim)]">
              Vision
            </span>
          </h1>
        </div>

        <p className="hud-flicker hud-flicker-2 font-mono text-xs tracking-[0.3em] text-accent uppercase opacity-0">
          {HUD_LINES[1]}
        </p>

        <p className="reveal mt-2 max-w-md translate-y-[14px] text-lg text-ink-dim opacity-0">
          AI와 생명공학을 이어 세상에 가치를 만들어 나갑니다.
        </p>
      </div>
    </div>
  );
}
