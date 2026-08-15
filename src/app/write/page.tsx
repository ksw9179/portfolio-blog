import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WriteForm from "@/components/WriteForm";

export default async function WritePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-20">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Write
        </p>
        <h1 className="text-3xl font-black text-ink">새 글 작성</h1>
      </div>
      <WriteForm userId={user.id} />
    </div>
  );
}
