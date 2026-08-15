import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogCard from "@/components/LogCard";
import type { Post } from "@/lib/posts-types";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio")
    .eq("username", username)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("id, author_id, title, body, images, tags, created_at")
    .eq("author_id", profile.id)
    .eq("published", true)
    .order("created_at", { ascending: false });

  const postList = (posts ?? []) as Post[];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-20">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Profile
        </p>
        <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
          {profile.display_name || profile.username}
        </h1>
        <p className="font-mono text-sm text-ink-dim">@{profile.username}</p>
        {profile.bio && <p className="mt-2 text-ink-dim">{profile.bio}</p>}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="border-t-2 border-ink pt-3 text-xl font-bold text-ink">
          게시글 {postList.length}
        </h2>
        {postList.length === 0 ? (
          <p className="font-mono text-xs text-ink-dim">
            아직 작성한 글이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {postList.map((post) => (
              <LogCard key={post.id} post={post} animate={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
