import { createClient } from "@/lib/supabase/server";

export type Comment = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  author_username: string;
};

type CommentRow = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  profiles: { username: string } | { username: string }[] | null;
};

function toUsername(profiles: CommentRow["profiles"]): string {
  if (!profiles) return "알 수 없음";
  if (Array.isArray(profiles)) return profiles[0]?.username ?? "알 수 없음";
  return profiles.username;
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("id, author_id, body, created_at, profiles(username)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Supabase comments fetch error:", error.message);
    return [];
  }

  return (data as unknown as CommentRow[]).map((c) => ({
    id: c.id,
    author_id: c.author_id,
    body: c.body,
    created_at: c.created_at,
    author_username: toUsername(c.profiles),
  }));
}
