import { redirect, notFound } from "next/navigation";
import { fetchPostById } from "@/lib/posts";
import { createClient } from "@/lib/supabase/server";
import WriteForm from "@/components/WriteForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await fetchPostById(id);

  if (!post) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  if (user.id !== post.author_id) {
    redirect(`/log/${id}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-20">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Edit
        </p>
        <h1 className="text-3xl font-black text-ink">Edit Post</h1>
      </div>
      <WriteForm userId={user.id} post={post} />
    </div>
  );
}
