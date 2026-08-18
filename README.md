# SW makes Vision

김선우(Seonwoo Kim)의 개인 포트폴리오 + 코딩 블로그.

**Live**: https://portfolio-blog-theta-sable.vercel.app

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [anime.js v4](https://animejs.com) — 히어로 인트로, 스크롤 리빌 애니메이션
- [Supabase](https://supabase.com) — Auth(이메일/GitHub OAuth), Postgres(RLS), Storage
- [Vercel](https://vercel.com) — 호스팅, GitHub 연동 자동 배포

## Features

- **Portfolio** — 학력·프로젝트·자격증·대외활동, GitHub 저장소 카드 + 잔디 그래프 연동
- **Hero** — JARVIS HUD 컨셉 인트로(스캔라인 → 브래킷 → 헤드라인), 신경망 배경, CSS로 만든 로봇 흉상
- **Coding Log** — 인스타그램식 그리드 피드, 무한스크롤, 마크다운 + 코드 하이라이팅
- **인증** — 이메일/비밀번호 + GitHub OAuth 로그인
- **다중 사용자** — 글쓰기/수정/삭제, 댓글, 좋아요, 프로필 페이지(아바타·소개글)
- **모더레이션** — 신고 기능 + 관리자 삭제
- **보안** — 모든 테이블에 Row Level Security 적용, 침투 테스트로 검증됨
- **SEO** — 페이지별 메타데이터, Open Graph/Twitter 카드, 동적 OG 이미지, sitemap.xml, robots.txt
- 다크 테마 전용, `prefers-reduced-motion` 대응

## Getting Started

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인.

### 환경변수

`.env.example` 참고. `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`는 Supabase 프로젝트 설정에서, `GITHUB_TOKEN`은 [GitHub 개인 액세스 토큰](https://github.com/settings/tokens)(scope: `public_repo`, `read:user`)에서 발급.

### 데이터베이스

`supabase/schema.sql`을 Supabase SQL Editor에서 실행하면 테이블(profiles/posts/comments/likes/reports) + RLS 정책 + 가입 시 프로필 자동 생성 트리거까지 한 번에 세팅됨.

GitHub 로그인을 쓰려면 Supabase Authentication → Providers → GitHub에 GitHub OAuth App의 Client ID/Secret을 등록해야 함(콜백 URL은 Supabase 도메인).

## Project Structure

```
src/
├── app/          # 라우트 (App Router) — about, portfolio, log, admin, auth 등
├── components/   # UI 컴포넌트
├── lib/          # Supabase 클라이언트, 데이터 조회 함수
└── data/         # 포트폴리오 정적 데이터
supabase/
└── schema.sql    # 스키마 + RLS 정책 (참고용, 실제 반영은 Supabase 대시보드에서)
```

별도 REST API 없이 전부 Server Component / Server Action으로 처리함.

## Deploy

`main` 브랜치에 push하면 Vercel이 자동으로 빌드·배포함.
