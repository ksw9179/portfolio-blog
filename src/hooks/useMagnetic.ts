"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

const STRENGTH = 0.35;

// 버튼 위에서 마우스를 움직이면 그 방향으로 살짝 끌려오는 "마그네틱" 효과.
// 호버가 의미 있는 포인팅 디바이스(데스크톱 마우스)에서만 동작.
export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isDesktop = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!isDesktop) return;

    function handleMouseMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      animate(el!, {
        translateX: dx * STRENGTH,
        translateY: dy * STRENGTH,
        duration: 300,
        ease: "outQuad",
      });
    }

    function handleMouseLeave() {
      animate(el!, {
        translateX: 0,
        translateY: 0,
        duration: 500,
        ease: "outElastic(1, .5)",
      });
    }

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return ref;
}
