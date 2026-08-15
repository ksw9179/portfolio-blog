import HeroScan from "@/components/HeroScan";
import GithubContributions from "@/components/GithubContributions";
import GithubRepos from "@/components/GithubRepos";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-bg">
      <HeroScan />

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-20">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
            GitHub Activity
          </p>
          <h2 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
            Recent Activity
          </h2>
        </div>

        <GithubContributions />
        <GithubRepos />
      </section>
    </div>
  );
}
