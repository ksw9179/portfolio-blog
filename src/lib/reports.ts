import { createClient } from "@/lib/supabase/server";
import { fetchAuthor } from "@/lib/posts";

export type ReportItem = {
  id: string;
  target_type: "post" | "comment";
  target_id: string;
  reason: string | null;
  created_at: string;
  reporter_username: string;
  content_body: string | null;
  content_author_username: string | null;
  content_post_id: string | null;
};

export async function fetchReports(): Promise<ReportItem[]> {
  const supabase = await createClient();
  const { data: reports, error } = await supabase
    .from("reports")
    .select("id, reporter_id, target_type, target_id, reason, created_at")
    .order("created_at", { ascending: false });

  if (error || !reports) return [];

  return Promise.all(
    reports.map(async (r) => {
      const reporter = await fetchAuthor(r.reporter_id);

      let content_body: string | null = null;
      let content_author_username: string | null = null;
      let content_post_id: string | null = null;

      if (r.target_type === "post") {
        const { data: post } = await supabase
          .from("posts")
          .select("body, author_id")
          .eq("id", r.target_id)
          .maybeSingle();
        if (post) {
          content_body = post.body;
          content_post_id = r.target_id;
          const author = await fetchAuthor(post.author_id);
          content_author_username = author?.username ?? null;
        }
      } else {
        const { data: comment } = await supabase
          .from("comments")
          .select("body, author_id, post_id")
          .eq("id", r.target_id)
          .maybeSingle();
        if (comment) {
          content_body = comment.body;
          content_post_id = comment.post_id;
          const author = await fetchAuthor(comment.author_id);
          content_author_username = author?.username ?? null;
        }
      }

      return {
        id: r.id,
        target_type: r.target_type as "post" | "comment",
        target_id: r.target_id,
        reason: r.reason,
        created_at: r.created_at,
        reporter_username: reporter?.username ?? "Unknown",
        content_body,
        content_author_username,
        content_post_id,
      };
    }),
  );
}
