import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileEditForm from "@/components/ProfileEditForm";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-6 py-20">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Edit Profile
        </p>
        <h1 className="text-3xl font-black text-ink">Edit Profile</h1>
      </div>
      <ProfileEditForm userId={user.id} profile={profile} />
    </div>
  );
}
