import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "수집하는 개인정보 항목과 처리 방침을 안내합니다.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-12 px-6 py-20">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Privacy
        </p>
        <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="font-mono text-xs text-ink-dim">
          Last updated: 2026-08-16
        </p>
      </div>

      <Section title="Data We Collect">
        <p>
          회원가입 시 이메일 주소와 닉네임(아이디)을 수집합니다. 비밀번호는
          Supabase Auth를 통해 암호화되어 저장되며, 운영자를 포함한 누구도
          원문을 볼 수 없습니다.
        </p>
        <p>
          GitHub으로 로그인하는 경우 이메일·비밀번호 대신 GitHub 아이디,
          프로필 사진, 공개 이메일을 제공받습니다. 프로필 소개(Bio)와 프로필
          사진은 사용자가 직접 입력한 경우에만 저장됩니다.
        </p>
        <p>작성하신 게시글, 댓글, 좋아요는 서비스 이용 중 생성되는 데이터로 저장됩니다.</p>
      </Section>

      <Section title="Why We Collect It">
        <p>
          수집한 정보는 회원 인증, 게시글·댓글 작성자 표시, 프로필 페이지
          제공 목적으로만 사용됩니다. 마케팅이나 광고 목적으로는 사용하지
          않습니다.
        </p>
      </Section>

      <Section title="Third-Party Services">
        <p>
          이 사이트는 Supabase(인증·데이터베이스·이미지 저장)와
          Vercel(호스팅)을 이용해 운영되며, 두 서비스 모두 자체 인프라 운영
          목적의 접속 로그를 수집할 수 있습니다. GitHub으로 로그인하는
          경우 GitHub의 OAuth 인증을 거칩니다.
        </p>
      </Section>

      <Section title="Retention">
        <p>
          회원 정보와 작성하신 콘텐츠는 계정을 삭제하기 전까지 보관됩니다.
          계정 삭제를 원하시면 아래 연락처로 요청해주세요.
        </p>
      </Section>

      <Section title="Your Rights">
        <p>본인의 개인정보에 대한 열람, 정정, 삭제를 요청할 수 있습니다.</p>
      </Section>

      <Section title="Contact">
        <p>
          문의나 삭제 요청은{" "}
          <a
            href="https://github.com/ksw9179"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            github.com/ksw9179
          </a>
          를 통해 연락해주세요.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="border-t-2 border-ink pt-3 text-xl font-bold text-ink">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-sm text-ink-dim">
        {children}
      </div>
    </section>
  );
}
