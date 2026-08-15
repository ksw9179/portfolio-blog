export type Post = {
  id: string;
  author_id: string;
  title: string | null;
  body: string;
  images: string[];
  tags: string[];
  created_at: string;
};

export const POSTS_PAGE_SIZE = 12;
