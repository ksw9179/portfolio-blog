# 개인 포트폴리오 + 코딩 블로그 개발 계획서

> 작성일: 2026-08-14 · 작성자: 김선우 (경희대 유전생명공학과 / 인공지능학과 복수전공)
> 목표: anime.js 공식 사이트급 모션을 가진 개인 포트폴리오 + 다중 사용자 코딩 블로그

---

## 0. 한 장 요약

| 항목 | 결정 |
|---|---|
| **프론트엔드** | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| **애니메이션** | anime.js v4 (+ Lenis 부드러운 스크롤) |
| **백엔드/DB** | Supabase (Auth + Postgres + Storage) — 서버 코드 최소화 |
| **GitHub 연동** | 저장소 카드 + 잔디 그래프 자동 표시, GitHub OAuth 로그인 |
| **배포** | Vercel (프론트) + Supabase 클라우드 (DB) — 둘 다 무료 티어 |
| **기간** | 약 8~10주, 주당 10시간 기준 (2026년 8월 중순 → 10월 말) |
| **전략** | 4단계 점진 출시. **3주차에 첫 배포**, 이후 기능을 얹어가며 재배포 |

**왜 이 조합인가 (한 줄씩):**
- **Next.js** — React 기반이라 자료가 가장 많고, Vercel에 push만 하면 배포가 끝난다. 서버 렌더링이 기본이라 검색엔진에도 잘 잡힌다.
- **Supabase** — 로그인/회원가입/비밀번호 해싱/이메일 인증을 직접 짜면 2~3주가 사라진다. Supabase는 이걸 함수 몇 개로 끝낸다. DB도 진짜 Postgres라 나중에 SQL 실력이 그대로 남는다.
- **anime.js v4** — 요청한 그 라이브러리. v4부터 모듈 방식(`import { animate }`)이라 React와 궁합이 좋다.
- **Vercel** — Next.js를 만든 회사. 설정이 사실상 없다.

---

## 1. 목표와 성공 기준

### 1.1 이 사이트가 해야 하는 일
1. **나를 소개한다** — 학력, 자격증, 대외활동, 개인 프로젝트를 한 페이지에서 보여준다.
2. **기억에 남는다** — 채용담당자/교수가 보고 "잘 만들었네"라고 느낄 시각적 완성도.
3. **기록을 쌓는다** — 인스타그램 피드처럼 코딩 활동을 가볍게 포스팅한다.
4. **커뮤니티가 된다** — 다른 사람도 가입해서 글을 쓰고 댓글을 단다.

### 1.2 완료 판정 기준 (이게 되면 끝)
- [ ] 실제 URL로 접속 가능하고, 모바일에서도 레이아웃이 안 깨진다
- [ ] Lighthouse 성능 ≥ 85, 접근성 ≥ 90
- [ ] 처음 보는 사람이 회원가입 → 글 작성 → 댓글까지 막힘 없이 된다
- [ ] 내가 아닌 사용자가 **내 글을 수정/삭제할 수 없다** (RLS 검증)
- [ ] `prefers-reduced-motion` 켠 사용자에게는 애니메이션이 꺼진다

---

## 2. 기술 스택 상세

### 2.1 확정 스택

```
프론트엔드
├── Next.js 16 (App Router)     페이지 라우팅 + 서버 렌더링
├── TypeScript                   오타를 미리 잡아줌 (AI 코딩 도구와 궁합 최고)
├── Tailwind CSS v4              CSS를 클래스로 씀. 파일 왔다갔다 안 해도 됨
├── anime.js v4                  애니메이션 엔진
└── Lenis                        관성 있는 부드러운 스크롤 (선택)

백엔드
└── Supabase
    ├── Auth      이메일+비밀번호, GitHub OAuth
    ├── Postgres  게시물, 댓글, 프로필
    ├── Storage   업로드 이미지
    └── RLS       "누가 무엇을 할 수 있는가" 규칙 ← 가장 중요

외부 연동
└── GitHub API
    ├── REST      저장소 목록, README
    ├── GraphQL   기여도(잔디) 데이터
    └── OAuth     소셜 로그인 (Supabase 경유)

배포
├── Vercel        프론트엔드 자동 배포 (GitHub push → 배포)
└── Supabase      DB 호스팅
```

### 2.2 도입하지 않는 것 (의도적 제외)

| 안 쓰는 것 | 이유 |
|---|---|
| Redux, Zustand 같은 전역 상태관리 | 이 규모에선 과잉. React 기본 state + 서버 컴포넌트로 충분 |
| GSAP | anime.js와 역할이 겹침. 하나만 깊게 파는 게 낫다 |
| Docker, AWS | Vercel + Supabase면 서버 지식 없이 배포된다. 서버 공부는 별도 주제로 |
| 커스텀 백엔드 서버 | Supabase가 대체. 나중에 ML 모델 붙일 때 그때 FastAPI 추가하면 됨 |
| Three.js / WebGL | 매력적이지만 학습비용이 anime.js의 5배. 3단계 이후 여유되면 고려 |

### 2.3 사전 학습 (React가 처음이므로)

HTML/CSS/JS 기초가 있으니 **딱 5개 개념만** 넘으면 된다. Phase 0에서 다룬다.

1. **컴포넌트** — HTML 조각을 함수로 만들어 재사용하는 것
2. **props** — 컴포넌트에 넘기는 값 (함수의 인자와 같음)
3. **state** — 변하면 화면이 다시 그려지는 값 (`useState`)
4. **useEffect** — 화면이 그려진 "다음에" 실행할 코드 (anime.js를 여기서 실행함)
5. **서버 컴포넌트 vs 클라이언트 컴포넌트** — Next.js 최대 난관. 파일 맨 위 `"use client"`가 있으면 브라우저에서 도는 코드, 없으면 서버에서만 도는 코드. **애니메이션·클릭·입력은 전부 `"use client"` 필요.**

---

## 3. 사이트 구조 (라우트 설계)

```
/                       랜딩 — 히어로 애니메이션, 스크롤 리빌
/about                  소개 — 나는 누구인가, 관심 분야, 타임라인
/portfolio              포트폴리오 인덱스 — 학력·자격증·활동·프로젝트
/portfolio/[slug]       프로젝트 상세 — 문제, 접근, 결과, 기술스택
/log                    피드 — 인스타그램식 그리드 (코딩 활동 포스트)
/log/[id]               포스트 상세 + 댓글
/write                  글쓰기 (로그인 필요)
/u/[username]           사용자 프로필 + 그 사람이 쓴 글
/login  /signup         인증
/privacy                개인정보처리방침 (회원가입 받으면 필수)
```

### 3.1 포트폴리오는 DB에 넣지 않는다 — 중요한 설계 결정

내 학력·자격증·프로젝트는 **한 달에 한 번 바뀔까 말까**한 데이터다. 이걸 DB에 넣으면:
- 관리자 페이지를 따로 만들어야 하고
- 페이지 로딩이 느려지고
- 버전 관리(git)가 안 된다

→ **`src/data/portfolio.ts` 같은 파일에 그냥 객체 배열로 둔다.** 수정하면 git에 기록이 남고, push하면 자동 배포된다. 프로젝트 상세 본문이 길어지면 그때 MDX(마크다운+컴포넌트)로 승격한다.

**DB에 넣는 것:** 피드 포스트, 댓글, 좋아요, 사용자 프로필. (자주 바뀌고, 나 말고 남도 만드는 것들)

---

## 4. 데이터 모델

```sql
-- 사용자 프로필 (Supabase auth.users를 확장)
create table profiles (
  id           uuid primary key references auth.users on delete cascade,
  username     text unique not null,
  display_name text,
  avatar_url   text,
  bio          text,
  role         text not null default 'user',   -- 'user' | 'admin'
  created_at   timestamptz not null default now()
);

-- 피드 포스트
create table posts (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references profiles(id) on delete cascade,
  title      text,                              -- 인스타식 짧은 글이면 null 허용
  body       text not null,                     -- 마크다운
  images     text[] not null default '{}',      -- Storage 경로 배열
  tags       text[] not null default '{}',
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 댓글 (parent_id로 1단계 대댓글 지원)
create table comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references posts(id) on delete cascade,
  author_id  uuid not null references profiles(id) on delete cascade,
  parent_id  uuid references comments(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

-- 좋아요
create table likes (
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

create index on posts (created_at desc);
create index on comments (post_id, created_at);
```

---

## 5. 인증·권한 설계 (RLS) — **이 문서에서 가장 중요한 섹션**

### 5.1 왜 중요한가

Supabase는 **브라우저에서 데이터베이스에 직접 접근**한다. 중간에 내가 만든 서버가 없다. 즉 악의적인 사용자가 브라우저 콘솔을 열고 `supabase.from('posts').delete()`를 치면 **모든 글이 지워질 수 있다.**

이걸 막는 유일한 장치가 **RLS(Row Level Security)** — "각 행(row)에 누가 접근할 수 있는지"를 DB 자체에 새겨두는 규칙이다. 문지기를 클라이언트가 아니라 금고 안에 두는 것.

> **철칙: 테이블을 만들면 그 즉시 RLS를 켜고 정책을 쓴다. "나중에"는 없다.**

### 5.2 정책 설계

| 테이블 | 조회(SELECT) | 생성(INSERT) | 수정(UPDATE) | 삭제(DELETE) |
|---|---|---|---|---|
| profiles | 누구나 | 가입 시 자동(trigger) | 본인만 | 불가 |
| posts | published=true는 누구나 / 비공개는 작성자만 | 로그인 + author_id=본인 | 작성자만 | 작성자 또는 admin |
| comments | 누구나 | 로그인 + author_id=본인 | 작성자만 | 작성자 / 글 주인 / admin |
| likes | 누구나 | 로그인 + user_id=본인 | 불가 | 본인만 |

```sql
alter table posts enable row level security;

create policy "공개글은 누구나 조회"
  on posts for select
  using (published = true or author_id = auth.uid());

create policy "로그인 사용자는 본인 이름으로만 작성"
  on posts for insert
  with check (auth.uid() = author_id);

create policy "본인 글만 수정"
  on posts for update
  using (auth.uid() = author_id);

create policy "본인 글 또는 관리자만 삭제"
  on posts for delete
  using (
    auth.uid() = author_id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );
```

### 5.3 검증 방법 (Phase 3 완료 조건)

테스트 계정 2개(A, B)를 만들고 직접 시도해본다:
- [x] B 계정으로 A의 글 수정 시도 → 실패해야 함
- [x] B 계정으로 A의 글 삭제 시도 → 실패해야 함
- [x] 로그아웃 상태에서 글 작성 시도 → 실패해야 함
- [x] B가 `author_id`를 A로 위조해서 작성 시도 → 실패해야 함
- [x] 비공개 글이 로그아웃 상태 조회에 안 나옴

**검증 완료 (2026-08-16)** — Supabase SQL Editor에서 `set role` + `request.jwt.claims`로 계정 A/B를 시뮬레이션해서 5개 항목 전부 통과 확인.

### 5.4 키 관리

| 키 | 노출 가능? | 용도 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ 공개 OK | 프로젝트 주소 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ 공개 OK | RLS가 지켜주므로 안전 |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ **절대 금지** | RLS를 전부 무시하는 마스터키. 서버에서만, `.env.local`에만 |

`.gitignore`에 `.env*.local`이 있는지 첫날 확인한다. GitHub에 서비스 롤 키가 올라가면 프로젝트를 새로 파야 한다.

---

## 6. 디자인 & 애니메이션 시스템

### 6.1 디자인 방향

anime.js 사이트가 "고급져 보이는" 이유는 화려해서가 아니라 **절제 + 일관성** 때문이다. 여기에 사용자가 원하는 "처음 들어왔을 때 경이로움·압도감"을 더해, **거대한 헤드라인 타이포그래피**를 시그니처로 삼는다.

**레퍼런스 5개 분석 결과 (2026-08-14):**

| 사이트 | 핵심 신호 |
|---|---|
| khlug.org (경희대 리눅스 유저그룹) | 153.6px, weight 950 — 화면을 압도하는 헤드라인 |
| belgradearbor.rs | 134px 세리프 에디토리얼 헤드라인 + 라임 포인트 컬러 |
| animejs.com | 거의 검정(#252423) 배경 + 코랄레드(#FF4B4B) 단일 포인트 + 모노스페이스 |
| onegrove.kr / jennyhouse.co.kr | Pretendard 기반, 절제된 흑백 톤 |

→ **거대하고 굵은 헤드라인 + 거의 검정 배경 + 단일 포인트 컬러**가 공통 패턴. 포인트 컬러는 자비스(JARVIS) HUD 컨셉에 맞춰 코랄레드 대신 **시안/일렉트릭 블루**로 결정.

**확정 토큰 (`src/app/globals.css`에 구현됨):**

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-bg` | `#0A0D12` | 배경 (거의 검정, 살짝 푸른 톤) |
| `--color-surface` | `#12161D` | 카드/패널 |
| `--color-surface-2` | `#1A212B` | hover, 경계선 |
| `--color-ink` | `#F1F5F9` | 본문 텍스트 |
| `--color-ink-dim` | `#8B95A3` | 보조 텍스트 |
| `--color-accent` | `#22D3EE` | 포인트 컬러 (JARVIS 시안) |
| `--color-accent-dim` | `#0E7490` | 포인트 저채도판 — 글로우, 은은한 경계 |

- **타이포그래피** — 헤드라인: Pretendard Variable, weight 900(black), 대형(96px~) / 본문: Pretendard Variable 400~500 / 코드·라벨·HUD 텍스트: JetBrains Mono
- **다크 전용** — `prefers-color-scheme` 대응 없이 항상 다크로 고정 (개인 브랜드 정체성 우선, animejs.com도 동일 방식)
- **여백이 콘텐츠다** — 요소를 채우려 하지 말 것
- **모션은 톤을 만든다** — 빠르게(150~400ms), 자연스러운 이징(`outExpo`, `outQuart`)

npm 패키지: `pretendard`(가변 폰트, `pretendard/dist/web/variable/pretendardvariable.css`) + `next/font/google`의 JetBrains Mono.

### 6.2 애니메이션 카탈로그

Phase 1에서 ①~④, Phase 4에서 ⑤~⑧을 넣는다.

| # | 효과 | anime.js API | 위치 |
|---|---|---|---|
| ① | 히어로 제목 글자 단위 등장 | `animate()` + `stagger()` | 랜딩 첫 화면 |
| ② | 스크롤 진입 시 섹션 리빌 | `onScroll()` | 모든 섹션 |
| ③ | 카드 hover 시 미세 틸트/부상 | `animate()` | 프로젝트·포스트 카드 |
| ④ | 숫자 카운트업 (프로젝트 수 등) | `animate()` + `modifier` | 소개 섹션 |
| ⑤ | SVG 선 그려지기 | `svg.createDrawable()` | 로고, 구분선, 타임라인 |
| ⑥ | 커스텀 커서 / 마그네틱 버튼 | `animate()` + `utils.interpolate` | 전역 (데스크톱만) |
| ⑦ | 페이지 전환 | View Transitions API + `createTimeline()` | 라우트 이동 |
| ⑧ | 히어로 배경 파티클 그리드 | `animate()` + canvas | 랜딩 |

> **히어로 인트로 컨셉 (2026-08-14 확정, ①·⑤·⑧을 하나로 묶는 시그니처 연출):**
> 아이언맨 자비스(JARVIS) HUD 느낌 — "AI가 화면을 스캔해서 콘텐츠를 인식하는" 연출.
> - 페이지 진입 시, 얇은 액센트 컬러의 **스캔 라인/원형 스캐너**가 화면을 훑고 지나간다 (`svg.createDrawable()` 또는 canvas)
> - 스캐너가 지나간 자리마다 **타겟팅 브래킷(모서리 꺾쇠, 카메라 뷰파인더 느낌)** 이 잠깐 나타났다 사라지며 그 자리의 콘텐츠(제목, 텍스트, 카드)를 "인식"하듯 드러낸다 — 콘텐츠 리빌은 `stagger()`로 스캐너 진행 방향을 따라간다
> - 모노스페이스 폰트로 된 짧은 라벨/좌표 텍스트가 스캐너를 따라 잠깐 깜빡이면 자비스 UI 느낌이 더 살아난다 (예: 좌표값, `[ANALYZING...]` 같은 기술적 텍스트 — 과하지 않게 1~2곳만)
> - 문자 그대로의 눈(eyeball) 그래픽은 지양 — 절제된 디자인 원칙(6.1절)과 어긋남. HUD/스캐너 쪽이 더 "고급져" 보이고 anime.js 사이트 톤에도 맞음
> - Phase 1에서 랜딩 페이지 만들 때 이 컨셉으로 상세 설계 (스캐너 이동 경로, 브래킷 개수, 색상, 타이밍을 그때 정함)

### 6.3 React에서 anime.js 쓰는 패턴

핵심 규칙 하나: **애니메이션은 화면이 그려진 다음에 시작하고, 컴포넌트가 사라질 때 반드시 정리한다.** 정리를 안 하면 페이지를 옮겨다닐 때마다 애니메이션이 유령처럼 쌓여서 사이트가 느려진다.

```tsx
"use client";                              // ← 브라우저에서 도는 코드 표시
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export function HeroTitle() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anim = animate(".char", {
      opacity: [0, 1],
      translateY: [40, 0],
      delay: stagger(30),
      duration: 800,
      ease: "outExpo",
    });
    return () => anim.pause();            // ← 정리(cleanup). 절대 빼지 말 것
  }, []);

  return <div ref={root}>{/* ... */}</div>;
}
```

> anime.js v4에는 React용 `createScope()` 유틸이 있어 정리를 자동화할 수 있다. Phase 1에서 공식 문서를 보고 도입 여부를 정한다.

### 6.4 지켜야 할 3가지 원칙

1. **`transform`과 `opacity`만 애니메이션한다.** `width`, `top`, `margin`을 움직이면 브라우저가 레이아웃을 다시 계산해서 뚝뚝 끊긴다.
2. **`prefers-reduced-motion`을 존중한다.** 전정기관 질환이 있는 사용자에게 큰 모션은 실제로 어지럼증을 유발한다. 접근성 점수에도 반영된다.
   ```ts
   const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   if (reduce) { /* 즉시 최종 상태로 */ }
   ```
3. **첫 화면의 핵심 텍스트를 페이드인으로 가리지 않는다.** 검색엔진과 성능 지표(LCP)가 나빠진다. 히어로는 "이미 보이는 상태에서 살짝 움직이는" 방식으로.

---

## 7. GitHub 연동

### 7.1 왜 하는가

코딩 블로그에서 GitHub 연동은 **"말"을 "증거"로 바꾼다.** "프로젝트를 했습니다"보다 실제 커밋 그래프와 저장소 카드가 자동으로 떠 있는 게 훨씬 설득력 있다. 게다가 **자동 갱신**이라 내가 손대지 않아도 사이트가 계속 최신 상태를 유지한다.

### 7.2 무엇을 연동할 것인가

| # | 기능 | 난이도 | 필요한 것 | 투입 단계 |
|---|---|---|---|---|
| ① | **저장소 카드** — 공개 저장소 목록, 언어, ⭐수, 설명 | 쉬움 | REST API | Phase 1 |
| ② | **잔디 그래프** — 최근 1년 커밋 히트맵 | 중간 | GraphQL API + PAT | Phase 1 |
| ③ | **GitHub OAuth 로그인** — 클릭 한 번 로그인 | 쉬움 | Supabase 설정 | Phase 3 |
| ④ | **프로젝트 상세 ← README 자동 로드** | 중간 | REST API + 마크다운 렌더 | Phase 2 |
| ⑤ | **최근 활동 피드** — 최근 push/PR을 로그에 자동 표시 | 중간 | Events API | Phase 4 |
| ⑥ | **글 안에 코드 임베드** — 저장소의 특정 파일·라인 범위 삽입 | 중간 | Raw content API | Phase 4 (선택) |
| ⑦ | 커밋하면 블로그 글 자동 생성 | 어려움 | Webhook + 서버 | **하지 않음** (과잉) |

**우선순위: ① ② ③ 은 확정, ④ ⑤ 는 여유되면, ⑥ ⑦ 은 하지 않는다.**

### 7.3 핵심 기술 이슈 3가지

**(1) 호출 횟수 제한 — 이게 제일 중요하다**

GitHub API는 무제한이 아니다.

| 방식 | 시간당 허용 | 결과 |
|---|---|---|
| 인증 없이 호출 | **60회** (서버 IP 기준) | 방문자가 조금만 늘면 즉시 한도 초과 → 저장소 목록이 사라짐 |
| PAT(개인 토큰)로 호출 | **5,000회** | 충분 |

→ **반드시 PAT을 만들어서 서버에서만 호출한다.** 권한은 `public_repo`, `read:user` 정도의 **읽기 전용 최소 권한**만.

**(2) 캐싱 — 방문자마다 API를 때리면 안 된다**

내 저장소 목록은 하루에 몇 번 바뀔까? 거의 안 바뀐다. 그런데 방문자 100명이 오면 API를 100번 호출한다면 낭비이자 자살행위다.

Next.js는 이걸 한 줄로 해결한다:

```ts
// 서버 컴포넌트에서만 실행됨. 토큰이 브라우저로 절대 안 나감
const res = await fetch("https://api.github.com/users/{내아이디}/repos?sort=updated", {
  headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
  next: { revalidate: 3600 },   // ← 1시간 동안은 저장해둔 결과를 재사용
});
```

`revalidate: 3600` 하나로 **1시간에 딱 1번만** 실제 호출한다. 하루 24번. 5,000회 한도의 0.5%.

**(3) 잔디 그래프는 REST API에 없다**

커밋 히트맵 데이터는 REST API로 못 가져온다. **GraphQL API의 `contributionsCollection`**을 써야 하고, 이건 인증이 필수다.

세 가지 선택지:

| 방법 | 장점 | 단점 |
|---|---|---|
| **A. GraphQL 직접 호출 + 직접 렌더** (권장) | 색·크기·애니메이션을 내 디자인에 완전히 맞춤. 칸이 하나씩 stagger로 등장하는 연출 가능 | 구현 반나절 |
| B. 외부 이미지 서비스 (`ghchart` 등) | `<img>` 한 줄로 끝 | 남의 서버에 의존. 다운되면 깨짐. 디자인 통일 불가 |
| C. 라이브러리 (`react-activity-calendar`) | 중간 | 스타일 커스터마이징이 제한적 |

→ **A를 권장.** 잔디 칸 365개가 물결처럼 순차 등장하는 anime.js `stagger` 연출은 이 사이트에서 가장 눈에 띄는 장면 중 하나가 될 수 있다. (`stagger`에 `grid`와 `from: "center"` 옵션을 주면 중앙에서 퍼지는 파동이 된다)

### 7.4 보안 규칙

| 환경변수 | 노출 | 비고 |
|---|---|---|
| `GITHUB_TOKEN` | ❌ **절대 금지** | `NEXT_PUBLIC_` 접두사를 **붙이지 않는다**. 붙이는 순간 브라우저에 노출됨 |

- 반드시 **서버 컴포넌트 또는 Route Handler**에서만 호출한다. `"use client"` 파일에서 부르면 토큰이 그대로 유출된다.
- PAT은 **읽기 전용 최소 권한 + 만료일 설정**(1년). 유출돼도 피해가 "내 공개 정보 읽기"에 그치도록.
- OAuth 로그인(③)에 쓰는 Client Secret도 Supabase 대시보드에만 넣고 코드에 두지 않는다.

### 7.5 GitHub OAuth 로그인 (Phase 3)

Supabase가 거의 다 해준다. 순서:

1. GitHub → Settings → Developer settings → **OAuth Apps** 생성
2. Callback URL에 Supabase가 알려주는 주소 입력
3. Client ID / Secret을 Supabase 대시보드 Auth → Providers에 등록
4. 코드는 사실상 한 줄:
   ```ts
   await supabase.auth.signInWithOAuth({ provider: "github" });
   ```

**주의:** 로컬(`localhost:3000`)과 실서비스 도메인은 **각각 별도의 OAuth App**을 만들어야 한다. 하나로 쓰려다 콜백 URL이 안 맞아서 헤매는 게 가장 흔한 실수다.

---

## 8. 개발 로드맵

> 주당 10시간 기준. 9월 개강 후에는 속도가 절반으로 떨어진다고 가정했다.

### Phase 0 — 준비 (1주 / 8월 3~4주차)

| 할 일 | 완료 판정 |
|---|---|
| Node.js LTS, Git, VS Code 설치 | `node -v`가 버전을 출력 |
| GitHub 저장소 생성 | 빈 커밋 push 성공 |
| `create-next-app`으로 프로젝트 생성 | `localhost:3000`에 기본 페이지 뜸 |
| React 5개 개념 실습 | 버튼 클릭하면 숫자 올라가는 컴포넌트를 직접 작성 |
| Tailwind 감 잡기 | 다크 배경 + 중앙 정렬 카드 한 개 만들기 |
| anime.js 설치 후 첫 애니메이션 | 네모 박스 하나가 stagger로 등장 |

### Phase 1 — 정적 포트폴리오 + 애니메이션 (3주) ★ **첫 배포**

| 할 일 | 완료 판정 |
|---|---|
| 디자인 토큰 정의 (색, 폰트, 간격) | `globals.css`에 CSS 변수로 정리됨 |
| 공통 레이아웃 (헤더, 푸터, 네비) | 모든 페이지에 일관되게 적용 |
| `/` 랜딩 — 히어로 애니메이션 | 애니메이션 ①②가 동작 |
| `/about` 소개 페이지 | 타임라인 형태로 렌더 |
| `/portfolio` + `/portfolio/[slug]` | `portfolio.ts` 데이터로 목록·상세 렌더 |
| 반응형 확인 | 375px / 768px / 1440px에서 안 깨짐 |
| **GitHub 저장소 카드 연동** (7.2 ①) | 내 공개 저장소가 자동으로 목록에 뜸, 1시간 캐싱 동작 |
| **GitHub 잔디 그래프** (7.2 ②) | 최근 1년 히트맵 렌더 + stagger 등장 애니메이션 |
| **Vercel 배포** | 실제 URL 접속 성공 |
| Lighthouse 측정 | 성능 ≥ 85, 접근성 ≥ 90 |

**→ 이 시점에 이미 "포트폴리오 사이트"로서 남에게 보여줄 수 있다.**

### Phase 2 — 블로그 피드 (내 글만) (2주 / 9월)

| 할 일 | 완료 판정 |
|---|---|
| Supabase 프로젝트 생성 + 스키마 적용 | 테이블 5개 생성, RLS 전부 켜짐 |
| Next.js ↔ Supabase 연결 | 서버 컴포넌트에서 posts 조회 성공 |
| `/log` 피드 — 인스타식 그리드 | 이미지 썸네일 그리드 + 무한스크롤 |
| `/log/[id]` 상세 | 마크다운 본문 + 코드 하이라이팅 렌더 |
| 이미지 업로드 (Storage) | 업로드 → URL 저장 → 피드에 표시 |
| 스크롤 리빌 애니메이션 적용 | 카드가 순차 등장 |
| GitHub README 자동 로드 (7.2 ④, 선택) | 프로젝트 상세에 저장소 README가 렌더됨 |
| 재배포 | 환경변수 Vercel에 등록 후 정상 동작 |

### Phase 3 — 인증 + 다중 사용자 + 댓글 (3주 / 9월 말~10월)

| 할 일 | 완료 판정 |
|---|---|
| 회원가입 / 로그인 / 로그아웃 | 이메일 인증 메일 수신 후 로그인 성공 |
| GitHub OAuth 로그인 (7.5) | 클릭 한 번으로 로그인. 로컬/실서비스 OAuth App 각각 생성 |
| 가입 시 profiles 자동 생성 trigger | 가입 직후 프로필 행이 생김 |
| `/write` 글쓰기 (로그인 필요) | 비로그인 접근 시 `/login`으로 리다이렉트 |
| 댓글 작성/삭제 | 본인 댓글만 삭제 버튼 노출 **+ 서버에서도 차단** |
| 좋아요 | 낙관적 UI (누르면 즉시 반응) |
| `/u/[username]` 프로필 | 그 사람 글 목록 표시 |
| **RLS 침투 테스트 (5.3절)** | 5개 항목 전부 차단 확인 |
| 신고 기능 + 관리자 삭제 | admin 계정으로 임의 글 삭제 가능 |
| `/privacy` 개인정보처리방침 | 수집 항목·보관 기간 명시 |

### Phase 4 — 마감 (1~2주 / 10월 말)

| 할 일 | 완료 판정 |
|---|---|
| 고급 애니메이션 ⑤~⑧ 추가 | 성능 점수가 5점 이상 안 떨어짐 |
| GitHub 최근 활동 피드 (7.2 ⑤, 선택) | 최근 push/PR이 로그에 자동 표시 |
| SEO — 메타태그, OG 이미지, sitemap | 카카오톡에 링크 붙여넣으면 카드가 뜸 |
| 커스텀 도메인 연결 | `내이름.com`으로 접속 |
| Vercel Analytics 연결 | 방문자 수가 보임 |
| 에러 페이지 (404, 500) | 디자인이 적용된 페이지가 뜸 |
| README 작성 | 저장소만 봐도 프로젝트 이해 가능 |

---

## 9. 배포 & 운영

### 9.1 배포 흐름

```
로컬에서 코드 수정
      ↓  git push
   GitHub
      ↓  자동 감지
   Vercel 빌드 → 배포 (1~2분)
      ↓
   실제 사이트 갱신
```

브랜치 전략은 단순하게: `main` = 실서비스. 큰 기능은 `feature/xxx` 브랜치에서 작업 → Vercel이 브랜치마다 **미리보기 URL**을 자동으로 만들어주므로 안전하게 확인 후 병합.

### 9.2 비용

| 항목 | 무료 티어 | 한계 | 넘으면 |
|---|---|---|---|
| Vercel Hobby | 무료 | 개인/비상업 용도 | Pro $20/월 |
| Supabase Free | 무료 | DB 500MB, Storage 1GB | Pro $25/월 |
| 도메인 | — | — | 연 1.5~2만원 |
| 이메일 발송 (Resend) | 월 3,000통 무료 | — | — |

**개인 블로그 규모에서는 무료 티어를 넘을 일이 거의 없다.**

⚠️ **Supabase 무료 프로젝트는 일정 기간 요청이 없으면 일시정지**된다. 사이트가 살아있으면 자연히 요청이 발생하니 문제없지만, 개발 중 방치하면 멈출 수 있다.

### 9.3 백업

- 코드: GitHub가 곧 백업
- DB: Supabase 대시보드에서 주기적으로 SQL 덤프 받아두기 (Phase 3 이후 월 1회)

---

## 10. 리스크 & 대응

| # | 리스크 | 영향 | 대응 |
|---|---|---|---|
| 1 | **RLS 미설정/오설정** | 데이터 유출·삭제. 치명적 | 테이블 생성 즉시 RLS 작성, 5.3절 침투 테스트를 Phase 3 완료 조건으로 못 박음 |
| 2 | **서비스 롤 키 GitHub 노출** | 계정 탈취 | `.gitignore` 첫날 확인, 절대 클라이언트 코드에 쓰지 않음 |
| 3 | **스팸·악성 게시물** | 아무나 가입 가능하면 반드시 발생 | 이메일 인증 필수 + 신고 기능 + admin 삭제 권한. 초기엔 가입 승인제도 고려 |
| 4 | **개인정보 수집 책임** | 이메일을 받는 순간 법적 의무 발생 | `/privacy` 페이지 필수. 수집 항목 최소화 (이메일 + 닉네임만) |
| 5 | **애니메이션 과다** | 느려지고 어지러움 | transform/opacity만, reduced-motion 존중, 모바일은 효과 축소 |
| 6 | **React 학습 곡선** | 일정 지연 | Phase 0을 건너뛰지 않음. 막히면 그 자리에서 질문 |
| 7 | **범위 확장 (기능 욕심)** | 영원히 배포 못 함 | Phase 1 끝나면 **무조건 배포**. 미완성이어도 공개 |
| 8 | **GitHub API 한도 초과** | 저장소 카드·잔디가 갑자기 빈칸이 됨 | PAT 사용(5,000회/시) + `revalidate: 3600` 캐싱 + 실패 시 대체 UI 표시 |
| 9 | **GitHub PAT 노출** | 내 계정 권한 유출 | `NEXT_PUBLIC_` 안 붙임, 서버 컴포넌트에서만 호출, 읽기 전용 최소 권한 + 만료일 1년 |

---

## 11. 다음 대화에서 할 일

이 계획서를 기준으로, 앞으로 영역별로 나눠서 함께 개발한다. 순서대로:

1. **Phase 0 시작** — 개발 환경 세팅 + React 5개 개념 실습
2. **디자인 시스템 확정** — 색상·폰트·간격 토큰, 레퍼런스 사이트 3개 함께 보기
3. **포트폴리오 콘텐츠 정리** — 학력/자격증/대외활동/프로젝트를 실제 데이터로 구조화
4. **랜딩 페이지 + 히어로 애니메이션**
5. **GitHub 연동** — PAT 발급 → 저장소 카드 → 잔디 그래프 + stagger 연출
6. (이후 Phase 순서대로)

### 시작 전에 준비해두면 좋은 것
- [ ] 포트폴리오에 넣을 내용 메모 (자격증 이름/취득일, 활동 기간, 프로젝트 설명)
- [ ] 프로필 사진 1장
- [ ] 좋아 보이는 웹사이트 레퍼런스 3~5개 URL
- [ ] 사이트 제목/도메인 후보
- [ ] **GitHub 아이디** + 포트폴리오에 띄우고 싶은 저장소 목록 (공개 저장소여야 함)

---

## 부록 A. 참고 링크

- anime.js 공식 문서 — https://animejs.com/documentation/
- Next.js App Router 문서 — https://nextjs.org/docs/app
- Supabase + Next.js 가이드 — https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase RLS — https://supabase.com/docs/guides/database/postgres/row-level-security
- Tailwind CSS — https://tailwindcss.com/docs
- GitHub REST API — https://docs.github.com/en/rest
- GitHub GraphQL (잔디 데이터) — https://docs.github.com/en/graphql
- Supabase GitHub OAuth — https://supabase.com/docs/guides/auth/social-login/auth-github

## 부록 B. 용어 사전

| 용어 | 뜻 |
|---|---|
| **App Router** | Next.js에서 폴더 구조가 곧 URL이 되는 방식. `app/log/page.tsx` → `/log` |
| **서버 컴포넌트** | 서버에서만 실행되고 결과 HTML만 보내는 컴포넌트. 기본값 |
| **클라이언트 컴포넌트** | 브라우저에서 실행. 파일 맨 위 `"use client"` 필요. 클릭·애니메이션은 여기서 |
| **RLS** | Row Level Security. DB 각 행에 대한 접근 권한을 DB 자체에 새기는 것 |
| **OAuth** | GitHub·구글 계정으로 로그인하는 방식. 비밀번호를 내가 안 다뤄도 됨 |
| **stagger** | 여러 요소를 조금씩 시차를 두고 움직이는 것. 도미노 효과 |
| **LCP** | Largest Contentful Paint. 가장 큰 콘텐츠가 보이기까지의 시간. 성능 핵심 지표 |
| **hydration** | 서버가 보낸 HTML에 브라우저가 JS를 붙여 살아나게 하는 과정 |
