"use server";

import { fetchPosts } from "@/lib/posts";

export async function fetchMorePosts(page: number) {
  return fetchPosts(page);
}
