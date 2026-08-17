import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { fetchPostById, fetchAuthor } from "@/lib/posts";
import { fetchComments } from "@/lib/comments";
import { fetchLikeInfo } from "@/lib/likes";
import { createClient } from "@/lib/supabase/server";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";
import Avatar from "@/components/Avatar";
import ReportButton from "@/components/ReportButton";
import DeletePostButton from "@/components/DeletePostButton";

function excerpt(body: string): string {
  const plain = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#*_`>[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > 150 ? `${plain.slice(0, 150)}…` : plain;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPostById(id);
  if (!post) return {};

  const title = post.title ?? "Untitled";
  const description = excerpt(post.body);
  const image = post.images[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.created_at,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function LogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await fetchPostById(id);

  if (!post) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = profile?.role === "admin";
  }

  const [comments, likeInfo, author] = await Promise.all([
    fetchComments(id),
    fetchLikeInfo(id),
    fetchAuthor(post.author_id),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-20">
      <Link
        href="/log"
        className="w-fit font-mono text-xs tracking-widest text-ink-dim uppercase transition-colors hover:text-accent"
      >
        ← Log
      </Link>

      <div className="flex flex-col gap-2">
        {post.title && (
          <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
            {post.title}
          </h1>
        )}
        <div className="flex items-center gap-2 font-mono text-xs text-ink-dim">
          {author && (
            <>
              <Avatar
                username={author.username}
                avatarUrl={author.avatar_url}
                size={20}
              />
              <Link
                href={`/u/${author.username}`}
                className="text-accent hover:underline"
              >
                @{author.username}
              </Link>
              <span>·</span>
            </>
          )}
          <span>{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
          {user && (user.id === post.author_id || isAdmin) && (
            <>
              <span>·</span>
              <DeletePostButton postId={post.id} />
            </>
          )}
          {user && user.id !== post.author_id && !isAdmin && (
            <>
              <span>·</span>
              <ReportButton
                targetType="post"
                targetId={post.id}
                reporterId={user.id}
              />
            </>
          )}
        </div>
      </div>

      {post.images.length > 0 && (
        <div className="flex flex-col gap-3">
          {post.images.map((src) => (
            <div
              key={src}
              className="relative aspect-video overflow-hidden rounded-2xl border border-surface-2 bg-surface"
            >
              <Image
                src={src}
                alt={post.title ?? "post image"}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <article className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {post.body}
        </ReactMarkdown>
      </article>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-surface-2 bg-surface px-3 py-1 font-mono text-xs text-ink"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <LikeButton
        postId={post.id}
        initialCount={likeInfo.count}
        initialLiked={likeInfo.hasLiked}
        isLoggedIn={!!user}
      />

      <div className="border-t border-surface-2 pt-8">
        <CommentSection
          postId={post.id}
          postAuthorId={post.author_id}
          initialComments={comments}
          currentUserId={user?.id ?? null}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}
