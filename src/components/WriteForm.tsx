"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useMagnetic } from "@/hooks/useMagnetic";

type ExistingPost = {
  id: string;
  title: string | null;
  body: string;
  tags: string[];
  images: string[];
};

export default function WriteForm({
  userId,
  post,
}: {
  userId: string;
  post?: ExistingPost;
}) {
  const isEdit = !!post;
  const router = useRouter();
  const magneticRef = useMagnetic<HTMLButtonElement>();
  const [title, setTitle] = useState(post?.title ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [tagsInput, setTagsInput] = useState(post?.tags.join(", ") ?? "");
  const [existingImages, setExistingImages] = useState(post?.images ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const newImageUrls: string[] = [];
      for (const file of files) {
        const ext = file.name.split(".").pop();
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(path, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage
          .from("post-images")
          .getPublicUrl(path);
        newImageUrls.push(data.publicUrl);
      }

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const images = [...existingImages, ...newImageUrls];

      if (isEdit) {
        const { error: updateError } = await supabase
          .from("posts")
          .update({ title: title || null, body, images, tags })
          .eq("id", post.id);

        if (updateError) throw updateError;

        router.push(`/log/${post.id}`);
        router.refresh();
      } else {
        const { data: created, error: insertError } = await supabase
          .from("posts")
          .insert({
            author_id: userId,
            title: title || null,
            body,
            images,
            tags,
          })
          .select("id")
          .single();

        if (insertError) throw insertError;

        router.push(`/log/${created.id}`);
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save post."
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs tracking-widest text-ink-dim uppercase">
          Title (optional)
        </span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-surface-2 bg-surface px-4 py-2.5 text-ink outline-none focus:border-accent-dim"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs tracking-widest text-ink-dim uppercase">
          Body (Markdown supported)
        </span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={10}
          className="rounded-lg border border-surface-2 bg-surface px-4 py-2.5 text-ink outline-none focus:border-accent-dim"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs tracking-widest text-ink-dim uppercase">
          Tags (comma-separated, optional)
        </span>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="python, ai"
          className="rounded-lg border border-surface-2 bg-surface px-4 py-2.5 text-ink outline-none focus:border-accent-dim"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs tracking-widest text-ink-dim uppercase">
          Images (optional)
        </span>
        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-1">
            {existingImages.map((url) => (
              <div key={url} className="relative">
                <Image
                  src={url}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-bg text-xs text-ink-dim ring-1 ring-surface-2 hover:text-red-400"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="text-sm text-ink-dim file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:font-mono file:text-xs file:text-ink"
        />
      </label>

      {error && <p className="font-mono text-xs text-red-400">{error}</p>}

      <button
        ref={magneticRef}
        type="submit"
        disabled={loading}
        className="mt-2 rounded-full bg-accent px-5 py-3 font-mono text-sm font-bold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isEdit
          ? loading
            ? "Saving..."
            : "Save"
          : loading
            ? "Publishing..."
            : "Publish"}
      </button>
    </form>
  );
}
