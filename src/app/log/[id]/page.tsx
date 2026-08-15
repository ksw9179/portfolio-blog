import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { fetchPostById } from "@/lib/posts";

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
        <p className="font-mono text-xs text-ink-dim">
          {new Date(post.created_at).toLocaleDateString("ko-KR")}
        </p>
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
    </div>
  );
}
