"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (!error) {
      router.push("/log");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-full border border-red-400/40 px-2.5 py-1 font-mono text-[11px] text-red-400 transition-colors hover:bg-red-400/10"
    >
      Delete
    </button>
  );
}
