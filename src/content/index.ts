export interface BlogPost {
  slug: string
  title: { ko: string; en: string }
  date: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'post-1',
    title: {
      ko: '첫 번째 블로그 포스트',
      en: 'First Blog Post',
    },
    date: '2026-02-28',
  },
]
