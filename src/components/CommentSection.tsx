"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Comment = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  author_username: string;
};

export default function CommentSection({
  postId,
  postAuthorId,
  initialComments,
  currentUserId,
  isAdmin,
}: {
  postId: string;
  postAuthorId: string;
  initialComments: Comment[];
  currentUserId: string | null;
  isAdmin: boolean;
}) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!currentUserId) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, author_id: currentUserId, body })
      .select("id, author_id, body, created_at, profiles(username)")
      .single();

    setLoading(false);
    if (error || !data) {
      setError(error?.message ?? "댓글 작성에 실패했습니다.");
      return;
    }

    const profiles = data.profiles as unknown as
      | { username: string }
      | { username: string }[]
      | null;
    const username = Array.isArray(profiles)
      ? (profiles[0]?.username ?? "나")
      : (profiles?.username ?? "나");

    setComments((prev) => [
      ...prev,
      {
        id: data.id,
        author_id: data.author_id,
        body: data.body,
        created_at: data.created_at,
        author_username: username,
      },
    ]);
    setBody("");
  }

  async function handleDelete(commentId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    if (!error) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
        댓글 {comments.length}
      </p>

      {comments.length > 0 && (
        <ul className="flex flex-col gap-4">
          {comments.map((c) => {
            const canDelete =
              currentUserId === c.author_id ||
              currentUserId === postAuthorId ||
              isAdmin;
            return (
              <li
                key={c.id}
                className="flex flex-col gap-1 border-b border-surface-2 pb-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-ink">
                    {c.author_username}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-ink-dim">
                      {new Date(c.created_at).toLocaleDateString("ko-KR")}
                    </span>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="font-mono text-[11px] text-ink-dim hover:text-red-400"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-ink-dim">{c.body}</p>
              </li>
            );
          })}
        </ul>
      )}

      {currentUserId ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={3}
            placeholder="댓글을 남겨보세요"
            className="rounded-lg border border-surface-2 bg-surface px-4 py-2.5 text-ink outline-none focus:border-accent-dim"
          />
          {error && <p className="font-mono text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-fit rounded-full bg-accent px-4 py-2 font-mono text-xs font-bold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "작성 중..." : "댓글 작성"}
          </button>
        </form>
      ) : (
        <p className="font-mono text-xs text-ink-dim">
          댓글을 작성하려면{" "}
          <Link href="/login" className="text-accent hover:underline">
            로그인
          </Link>
          이 필요합니다.
        </p>
      )}
    </div>
  );
}
