import { supabase } from "@/lib/supabase";

export type Post = {
  id: string;
  title: string | null;
  body: string;
  images: string[];
  tags: string[];
  created_at: string;
};

export const POSTS_PAGE_SIZE = 12;

export async function fetchPosts(page: number): Promise<Post[]> {
  const from = page * POSTS_PAGE_SIZE;
  const to = from + POSTS_PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, body, images, tags, created_at")
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
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, body, images, tags, created_at")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (error || !data) return null;
  return data;
}
