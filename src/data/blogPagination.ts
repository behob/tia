export const BLOG_PAGE_SIZE = 9;
export const blogViews = ['grid', 'list', 'standard'] as const;
export type BlogView = (typeof blogViews)[number];

export function getBlogPageCount(postCount: number) {
  return Math.max(1, Math.ceil(postCount / BLOG_PAGE_SIZE));
}

export function getBlogArchiveHref(view: BlogView, page = 1) {
  return page === 1 ? `/blog-${view}` : `/blog-${view}/${page}`;
}

export function paginateBlogPosts<T>(posts: readonly T[], currentPage = 1) {
  const totalPages = getBlogPageCount(posts.length);
  if (!Number.isInteger(currentPage) || currentPage < 1 || currentPage > totalPages) {
    throw new RangeError(`Invalid blog page: ${currentPage}`);
  }
  const start = (currentPage - 1) * BLOG_PAGE_SIZE;
  return { posts: posts.slice(start, start + BLOG_PAGE_SIZE), currentPage, totalPages };
}
