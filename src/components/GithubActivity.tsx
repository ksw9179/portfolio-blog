import ActivityList, { type ActivityItem } from "@/components/ActivityList";

type GithubEvent = {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    ref?: string;
    head?: string;
    action?: string;
    pull_request?: { title: string; html_url: string };
  };
};

async function getActivity(): Promise<ActivityItem[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(
      "https://api.github.com/users/ksw9179/events?per_page=30",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const events: GithubEvent[] = await res.json();

    const items: ActivityItem[] = [];
    for (const event of events) {
      if (items.length >= 6) break;

      if (event.type === "PushEvent" && event.payload.head) {
        const branch = event.payload.ref?.replace("refs/heads/", "") ?? "";
        items.push({
          id: event.id,
          kind: "Push",
          repo: event.repo.name,
          message: `Pushed to ${branch}`,
          url: `https://github.com/${event.repo.name}/commit/${event.payload.head}`,
          date: event.created_at,
        });
      } else if (event.type === "PullRequestEvent" && event.payload.pull_request) {
        items.push({
          id: event.id,
          kind: `PR ${event.payload.action}`,
          repo: event.repo.name,
          message: event.payload.pull_request.title,
          url: event.payload.pull_request.html_url,
          date: event.created_at,
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

export default async function GithubActivity() {
  const items = await getActivity();

  if (items.length === 0) {
    return (
      <p className="font-mono text-xs text-ink-dim">
        Activity feed pending — will appear once GITHUB_TOKEN is configured.
      </p>
    );
  }

  return <ActivityList items={items} />;
}
