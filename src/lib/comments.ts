import { createClient } from "@/lib/supabase/server";

export type Comment = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  author_username: string;
  author_avatar_url: string | null;
};

type ProfileJoin = { username: string; avatar_url: string | null };

type CommentRow = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  profiles: ProfileJoin | ProfileJoin[] | null;
};

function toAuthor(profiles: CommentRow["profiles"]): {
  username: string;
  avatar_url: string | null;
} {
  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  return {
    username: profile?.username ?? "알 수 없음",
    avatar_url: profile?.avatar_url ?? null,
  };
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("id, author_id, body, created_at, profiles(username, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Supabase comments fetch error:", error.message);
    return [];
  }

  return (data as unknown as CommentRow[]).map((c) => {
    const author = toAuthor(c.profiles);
    return {
      id: c.id,
      author_id: c.author_id,
      body: c.body,
      created_at: c.created_at,
      author_username: author.username,
      author_avatar_url: author.avatar_url,
    };
  });
}
