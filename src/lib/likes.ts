import { createClient } from "@/lib/supabase/server";

export async function fetchLikeInfo(postId: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasLiked = false;
  if (user) {
    const { data } = await supabase
      .from("likes")
      .select("post_id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();
    hasLiked = !!data;
  }

  return { count: count ?? 0, hasLiked };
}
