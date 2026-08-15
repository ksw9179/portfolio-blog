import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function LogCard({
  post,
  animate,
}: {
  post: Post;
  animate: boolean;
}) {
  const thumb = post.images[0];

  return (
    <Link
      href={`/log/${post.id}`}
      className={`log-card group relative flex aspect-square flex-col overflow-hidden rounded-xl border border-surface-2 bg-surface transition-colors hover:border-accent-dim ${
        animate ? "translate-y-[14px] opacity-0" : ""
      }`}
    >
      {thumb ? (
        <Image
          src={thumb}
          alt={post.title ?? "post image"}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full flex-col justify-between p-4">
          {post.title && (
            <p className="font-bold text-ink line-clamp-2">{post.title}</p>
          )}
          <p className="line-clamp-5 text-sm text-ink-dim">{post.body}</p>
          <p className="font-mono text-[10px] text-ink-dim">
            {new Date(post.created_at).toLocaleDateString("ko-KR")}
          </p>
        </div>
      )}
    </Link>
  );
}
