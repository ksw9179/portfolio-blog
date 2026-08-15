-- ============================================
-- 테이블
-- ============================================

create table profiles (
  id           uuid primary key references auth.users on delete cascade,
  username     text unique not null,
  display_name text,
  avatar_url   text,
  bio          text,
  role         text not null default 'user',   -- 'user' | 'admin'
  created_at   timestamptz not null default now()
);

create table posts (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references profiles(id) on delete cascade,
  title      text,
  body       text not null,
  images     text[] not null default '{}',
  tags       text[] not null default '{}',
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references posts(id) on delete cascade,
  author_id  uuid not null references profiles(id) on delete cascade,
  parent_id  uuid references comments(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

create table likes (
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

create index on posts (created_at desc);
create index on comments (post_id, created_at);

-- ============================================
-- RLS 활성화 (테이블 생성 즉시 켠다 — 예외 없음)
-- ============================================
alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;

-- ============================================
-- profiles 정책
-- ============================================
create policy "프로필은 누구나 조회"
  on profiles for select
  using (true);

create policy "본인 프로필만 수정"
  on profiles for update
  using (auth.uid() = id);

-- ============================================
-- posts 정책
-- ============================================
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

-- ============================================
-- comments 정책
-- ============================================
create policy "댓글은 누구나 조회"
  on comments for select
  using (true);

create policy "로그인 사용자는 본인 이름으로만 작성"
  on comments for insert
  with check (auth.uid() = author_id);

create policy "본인 댓글만 수정"
  on comments for update
  using (auth.uid() = author_id);

create policy "본인 댓글, 글 주인, 관리자만 삭제"
  on comments for delete
  using (
    auth.uid() = author_id
    or auth.uid() = (select author_id from posts where posts.id = comments.post_id)
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ============================================
-- likes 정책
-- ============================================
create policy "좋아요는 누구나 조회"
  on likes for select
  using (true);

create policy "로그인 사용자는 본인 이름으로만 좋아요"
  on likes for insert
  with check (auth.uid() = user_id);

create policy "본인 좋아요만 삭제"
  on likes for delete
  using (auth.uid() = user_id);

-- ============================================
-- 가입 시 profiles 자동 생성 (Phase 3)
-- 회원가입 폼에서 넘긴 username(user_metadata)을 쓰고,
-- 없으면 이메일 앞부분을 기본값으로 사용
-- ============================================
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- Storage 업로드 권한 (Phase 3, /write 페이지용)
-- "public bucket" 설정은 읽기(select)만 열어주고, 업로드(insert)는
-- 별도 정책이 필요함. 본인 uid 폴더(userId/파일명) 안에만 쓸 수 있게 제한.
-- ============================================
create policy "로그인 사용자는 본인 폴더에 이미지 업로드 가능"
  on storage.objects for insert
  with check (
    bucket_id = 'post-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "본인이 올린 이미지만 삭제 가능"
  on storage.objects for delete
  using (
    bucket_id = 'post-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
