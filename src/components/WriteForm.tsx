"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function WriteForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const imageUrls: string[] = [];
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
        imageUrls.push(data.publicUrl);
      }

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const { data: post, error: insertError } = await supabase
        .from("posts")
        .insert({
          author_id: userId,
          title: title || null,
          body,
          images: imageUrls,
          tags,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      router.push(`/log/${post.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish post.");
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
        type="submit"
        disabled={loading}
        className="mt-2 rounded-full bg-accent px-5 py-3 font-mono text-sm font-bold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish"}
      </button>
    </form>
  );
}
