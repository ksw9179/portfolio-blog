"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ReportButton({
  targetType,
  targetId,
  reporterId,
}: {
  targetType: "post" | "comment";
  targetId: string;
  reporterId: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "duplicate" | "error">(
    "idle",
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.from("reports").insert({
      reporter_id: reporterId,
      target_type: targetType,
      target_id: targetId,
      reason: reason.trim() || null,
    });

    if (!error) {
      setStatus("done");
    } else if (error.code === "23505") {
      setStatus("duplicate");
    } else {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <span className="font-mono text-[11px] text-ink-dim">Reported</span>;
  }
  if (status === "duplicate") {
    return <span className="font-mono text-[11px] text-ink-dim">Already reported</span>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-[11px] text-ink-dim hover:text-red-400"
      >
        Report
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional)"
        className="w-32 rounded border border-surface-2 bg-surface px-2 py-1 font-mono text-[11px] text-ink outline-none focus:border-accent-dim"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="font-mono text-[11px] text-red-400 hover:underline disabled:opacity-50"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="font-mono text-[11px] text-ink-dim hover:underline"
      >
        Cancel
      </button>
      {status === "error" && (
        <span className="font-mono text-[11px] text-red-400">Failed</span>
      )}
    </form>
  );
}
