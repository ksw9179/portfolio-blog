"use client";

import { useEffect, useRef } from "react";

type Node = {
  layer: number;
  x: number;
  baseY: number;
  y: number;
  vy: number;
};

const LAYER_COUNT = 5;
const NODES_PER_LAYER = 6;
const DRIFT_SPEED = 0.08;
const DRIFT_RANGE = 12;

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-accent")
      .trim();
    const [r, g, b] = hexToRgb(accent);

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let rafId = 0;

    function resize() {
      const rect = parent!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
      nodes = [];
      const xPad = width * 0.08;
      const yPad = height * 0.12;
      const layerGap = (width - xPad * 2) / (LAYER_COUNT - 1);
      const nodeGap = (height - yPad * 2) / (NODES_PER_LAYER - 1);
      for (let l = 0; l < LAYER_COUNT; l++) {
        const layerX = xPad + l * layerGap;
        for (let n = 0; n < NODES_PER_LAYER; n++) {
          const gridY = yPad + n * nodeGap;
          // 완벽한 격자가 아니라 자연스럽게 흐트러지도록 무작위 흔들림 추가
          const x = layerX + (Math.random() - 0.5) * layerGap * 0.35;
          const baseY = gridY + (Math.random() - 0.5) * nodeGap * 0.7;
          nodes.push({
            layer: l,
            x,
            baseY,
            y: baseY,
            vy: (Math.random() < 0.5 ? -1 : 1) * DRIFT_SPEED,
          });
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      if (!reduceMotion) {
        for (const n of nodes) {
          n.y += n.vy;
          if (Math.abs(n.y - n.baseY) > DRIFT_RANGE) n.vy *= -1;
        }
      }

      // 인접한 층끼리만 연결 (실제 신경망 다이어그램 구조)
      ctx!.lineWidth = 1;
      for (let l = 0; l < LAYER_COUNT - 1; l++) {
        const from = nodes.filter((n) => n.layer === l);
        const to = nodes.filter((n) => n.layer === l + 1);
        for (const a of from) {
          for (const bNode of to) {
            ctx!.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.07)`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(bNode.x, bNode.y);
            ctx!.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (!reduceMotion) {
        rafId = requestAnimationFrame(draw);
      }
    }

    resize();
    initNodes();
    draw();

    function handleResize() {
      resize();
      initNodes();
      if (reduceMotion) draw();
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    />
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}
