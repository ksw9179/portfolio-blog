"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/Avatar";

type Comment = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  author_username: string;
  author_avatar_url: string | null;
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
      .select("id, author_id, body, created_at, profiles(username, avatar_url)")
      .single();

    setLoading(false);
    if (error || !data) {
      setError(error?.message ?? "Failed to post comment.");
      return;
    }

    const profiles = data.profiles as unknown as
      | { username: string; avatar_url: string | null }
      | { username: string; avatar_url: string | null }[]
      | null;
    const profile = Array.isArray(profiles) ? profiles[0] : profiles;

    setComments((prev) => [
      ...prev,
      {
        id: data.id,
        author_id: data.author_id,
        body: data.body,
        created_at: data.created_at,
        author_username: profile?.username ?? "You",
        author_avatar_url: profile?.avatar_url ?? null,
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
        Comments {comments.length}
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
                  <div className="flex items-center gap-2">
                    <Avatar
                      username={c.author_username}
                      avatarUrl={c.author_avatar_url}
                      size={20}
                    />
                    <Link
                      href={`/u/${c.author_username}`}
                      className="font-mono text-xs text-ink-dim hover:text-accent"
                    >
                      {c.author_username}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-ink-dim">
                      {new Date(c.created_at).toLocaleDateString("ko-KR")}
                    </span>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="font-mono text-[11px] text-ink-dim hover:text-red-400"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-ink">{c.body}</p>
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
            placeholder="Leave a comment"
            className="rounded-lg border border-surface-2 bg-surface px-4 py-2.5 text-ink outline-none focus:border-accent-dim"
          />
          {error && <p className="font-mono text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-fit rounded-full bg-accent px-4 py-2 font-mono text-xs font-bold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="font-mono text-xs text-ink-dim">
          <Link href="/login" className="text-accent hover:underline">
            Login
          </Link>{" "}
          to leave a comment.
        </p>
      )}
    </div>
  );
}
