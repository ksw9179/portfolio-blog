type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
};

async function getRepos(): Promise<Repo[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(
      "https://api.github.com/users/ksw9179/repos?sort=updated&per_page=10&type=owner",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data: Repo[] = await res.json();
    return data.filter((r) => !r.fork).slice(0, 6);
  } catch {
    return [];
  }
}

export default async function GithubRepos() {
  const repos = await getRepos();

  if (repos.length === 0) {
    return (
      <p className="font-mono text-xs text-ink-dim">
        Repo cards pending — will appear once GITHUB_TOKEN is configured.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-2 rounded-2xl border border-surface-2 bg-surface p-5 transition-colors hover:border-accent-dim"
        >
          <h3 className="font-mono text-sm font-bold text-ink group-hover:text-accent">
            {repo.name}
          </h3>
          {repo.description && (
            <p className="line-clamp-2 text-sm text-ink-dim">
              {repo.description}
            </p>
          )}
          <div className="mt-auto flex items-center gap-3 pt-2 font-mono text-xs text-ink-dim">
            {repo.language && <span>{repo.language}</span>}
            <span>★ {repo.stargazers_count}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
