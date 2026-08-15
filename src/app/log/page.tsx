import { fetchPosts } from "@/lib/posts";
import LogGrid from "@/components/LogGrid";

export default async function LogPage() {
  const posts = await fetchPosts(0);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-20">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Log
        </p>
        <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
          코딩 로그
        </h1>
      </div>

      {posts.length === 0 ? (
        <p className="font-mono text-xs text-ink-dim">아직 글이 없습니다.</p>
      ) : (
        <LogGrid initialPosts={posts} />
      )}
    </div>
  );
}
