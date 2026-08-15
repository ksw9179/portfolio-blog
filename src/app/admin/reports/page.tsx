import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchReports } from "@/lib/reports";
import ReportRow from "@/components/ReportRow";

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  const reports = await fetchReports();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-20">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Admin
        </p>
        <h1 className="text-3xl font-black text-ink">Reports</h1>
      </div>

      {reports.length === 0 ? (
        <p className="font-mono text-sm text-ink-dim">No reports.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {reports.map((r) => (
            <ReportRow key={r.id} report={r} />
          ))}
        </ul>
      )}
    </div>
  );
}
