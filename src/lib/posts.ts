import { createClient } from "@/lib/supabase/server";
import { POSTS_PAGE_SIZE, type Post } from "@/lib/posts-types";

const POST_COLUMNS = "id, author_id, title, body, images, tags, created_at";

export async function fetchPosts(page: number): Promise<Post[]> {
  const supabase = await createClient();
  const from = page * POSTS_PAGE_SIZE;
  const to = from + POSTS_PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Supabase posts fetch error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function fetchPostById(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("id", id)
    .eq("published", true)
    .single();

  if (error || !data) return null;
  return data;
}
