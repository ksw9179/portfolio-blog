"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LikeButton({
  postId,
  initialCount,
  initialLiked,
  isLoggedIn,
}: {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
  isLoggedIn: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (!isLoggedIn || pending) return;
    setPending(true);

    // 낙관적 UI — 서버 응답을 기다리지 않고 먼저 화면에 반영
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLiked(!nextLiked);
      setCount((c) => c + (nextLiked ? -1 : 1));
      setPending(false);
      return;
    }

    const { error } = nextLiked
      ? await supabase
          .from("likes")
          .insert({ post_id: postId, user_id: user.id })
      : await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

    if (error) {
      // 실패하면 되돌림
      setLiked(!nextLiked);
      setCount((c) => c + (nextLiked ? -1 : 1));
    }
    setPending(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={!isLoggedIn}
      title={isLoggedIn ? undefined : "Login required"}
      className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 font-mono text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        liked
          ? "border-accent bg-accent/10 text-accent"
          : "border-surface-2 text-ink-dim hover:border-accent-dim"
      }`}
    >
      <span>{liked ? "♥" : "♡"}</span>
      <span>{count}</span>
    </button>
  );
}
