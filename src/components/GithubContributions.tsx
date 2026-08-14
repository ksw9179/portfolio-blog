import ContributionGrid from "@/components/ContributionGrid";

type Day = { date: string; contributionCount: number };
type Week = { contributionDays: Day[] };

async function getContributions(): Promise<{
  weeks: Week[];
  total: number;
} | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: "ksw9179" } }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const calendar =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;
    return { weeks: calendar.weeks, total: calendar.totalContributions };
  } catch {
    return null;
  }
}

export default async function GithubContributions() {
  const data = await getContributions();

  if (!data) {
    return (
      <p className="font-mono text-xs text-ink-dim">
        잔디 그래프 준비 중 — GITHUB_TOKEN 설정 후 표시됩니다.
      </p>
    );
  }

  return <ContributionGrid weeks={data.weeks} total={data.total} />;
}
