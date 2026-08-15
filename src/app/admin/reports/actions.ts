"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") throw new Error("Not authorized");

  return supabase;
}

export async function deleteReportedContent(
  targetType: "post" | "comment",
  targetId: string,
  reportId: string,
) {
  const supabase = await requireAdmin();
  await supabase
    .from(targetType === "post" ? "posts" : "comments")
    .delete()
    .eq("id", targetId);
  await supabase.from("reports").delete().eq("id", reportId);
  revalidatePath("/admin/reports");
}

export async function dismissReport(reportId: string) {
  const supabase = await requireAdmin();
  await supabase.from("reports").delete().eq("id", reportId);
  revalidatePath("/admin/reports");
}
