"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createScope, stagger } from "animejs";
import { fetchMorePosts } from "@/app/log/actions";
import { POSTS_PAGE_SIZE, type Post } from "@/lib/posts";
import LogCard from "@/components/LogCard";

export default function LogGrid({ initialPosts }: { initialPosts: Post[] }) {
  const initialCount = initialPosts.length;
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    initialPosts.length === POSTS_PAGE_SIZE
  );
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // 첫 화면 카드들 순차 등장
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion || !gridRef.current) return;

    const scope = createScope({ root: gridRef }).add(() => {
      animate(".log-card", {
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 500,
        delay: stagger(50),
        ease: "outExpo",
      });
    });
    return () => scope.revert();
  }, []);

  // 무한 스크롤
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          fetchMorePosts(page).then((next) => {
            setPosts((prev) => [...prev, ...next]);
            setHasMore(next.length === POSTS_PAGE_SIZE);
            setPage((p) => p + 1);
            setLoading(false);
          });
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [page, hasMore, loading]);

  return (
    <div className="flex flex-col gap-8">
      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {posts.map((post, i) => (
          <LogCard key={post.id} post={post} animate={i < initialCount} />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center">
          {loading && (
            <p className="font-mono text-xs text-ink-dim">불러오는 중...</p>
          )}
        </div>
      )}
    </div>
  );
}
