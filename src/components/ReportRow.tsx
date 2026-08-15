"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteReportedContent, dismissReport } from "@/app/admin/reports/actions";
import type { ReportItem } from "@/lib/reports";

export default function ReportRow({ report }: { report: ReportItem }) {
  const [isPending, startTransition] = useTransition();
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  const targetHref = report.content_post_id ? `/log/${report.content_post_id}` : null;

  return (
    <li className="flex flex-col gap-2 rounded-xl border border-surface-2 bg-surface p-4">
      <div className="flex items-center justify-between font-mono text-xs text-ink-dim">
        <span>
          {report.target_type === "post" ? "Post" : "Comment"} by{" "}
          {report.content_author_username ? (
            <Link
              href={`/u/${report.content_author_username}`}
              className="text-accent hover:underline"
            >
              @{report.content_author_username}
            </Link>
          ) : (
            "(deleted)"
          )}
        </span>
        <span>{new Date(report.created_at).toLocaleDateString("ko-KR")}</span>
      </div>

      {report.content_body ? (
        <p className="line-clamp-3 text-sm text-ink">{report.content_body}</p>
      ) : (
        <p className="font-mono text-xs text-ink-dim">Content no longer exists.</p>
      )}

      <p className="font-mono text-xs text-ink-dim">
        Reported by @{report.reporter_username}
        {report.reason ? `: "${report.reason}"` : ""}
      </p>

      <div className="flex items-center gap-4">
        {targetHref && (
          <Link href={targetHref} className="font-mono text-xs text-accent hover:underline">
            View →
          </Link>
        )}
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await deleteReportedContent(report.target_type, report.target_id, report.id);
              setHidden(true);
            })
          }
          className="font-mono text-xs text-red-400 hover:underline disabled:opacity-50"
        >
          Delete Content
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await dismissReport(report.id);
              setHidden(true);
            })
          }
          className="font-mono text-xs text-ink-dim hover:underline disabled:opacity-50"
        >
          Dismiss
        </button>
      </div>
    </li>
  );
}
