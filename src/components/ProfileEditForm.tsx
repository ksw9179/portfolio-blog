"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/Avatar";

type Profile = {
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export default function ProfileEditForm({
  userId,
  profile,
}: {
  userId: string;
  profile: Profile;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      let newAvatarUrl = avatarUrl;

      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${userId}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage
          .from("post-images")
          .getPublicUrl(path);
        // 같은 경로라 브라우저가 이전 이미지를 캐싱할 수 있어 타임스탬프를 붙임
        newAvatarUrl = `${data.publicUrl}?t=${Date.now()}`;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          display_name: displayName || null,
          bio: bio || null,
          avatar_url: newAvatarUrl,
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      router.push(`/u/${profile.username}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update profile."
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- 로컬 blob 미리보기라 next/image 대상이 아님
          <img
            src={preview}
            alt="Preview"
            className="h-16 w-16 rounded-full border border-surface-2 object-cover"
          />
        ) : (
          <Avatar
            username={profile.username}
            avatarUrl={avatarUrl}
            size={64}
          />
        )}
        <label className="flex cursor-pointer flex-col gap-1">
          <span className="font-mono text-xs tracking-widest text-ink-dim uppercase">
            Profile Photo
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-ink-dim file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:font-mono file:text-xs file:text-ink"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs tracking-widest text-ink-dim uppercase">
          Nickname
        </span>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="rounded-lg border border-surface-2 bg-surface px-4 py-2.5 text-ink outline-none focus:border-accent-dim"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs tracking-widest text-ink-dim uppercase">
          Bio
        </span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="rounded-lg border border-surface-2 bg-surface px-4 py-2.5 text-ink outline-none focus:border-accent-dim"
        />
      </label>

      {error && <p className="font-mono text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-full bg-accent px-5 py-3 font-mono text-sm font-bold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
