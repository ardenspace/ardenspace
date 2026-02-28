import { Suspense, lazy } from 'react'
import { useStore } from '../../stores/useStore'
import AppWindow from '../AppWindow'
import { useT } from '../../i18n'
import { blogPosts } from '../../content/blog'

const blogComponents: Record<string, Record<string, React.LazyExoticComponent<React.ComponentType>>> = {
  'post-1': {
    ko: lazy(() => import('../../content/blog/post-1.ko.mdx')),
    en: lazy(() => import('../../content/blog/post-1.en.mdx')),
  },
}

export default function BlogApp() {
  const lang = useStore((s) => s.lang)
  const blogPost = useStore((s) => s.blogPost)
  const setBlogPost = useStore((s) => s.setBlogPost)
  const t = useT()

  // Detail view
  if (blogPost && blogComponents[blogPost]) {
    const Content = blogComponents[blogPost][lang]
    return (
      <AppWindow title={t('blog')}>
        <button
          onClick={() => setBlogPost(null)}
          className="text-white/50 hover:text-white text-sm mb-4 cursor-pointer"
        >
          ← {t('back')}
        </button>
        <Suspense fallback={<div className="text-white/40">Loading...</div>}>
          <Content />
        </Suspense>
      </AppWindow>
    )
  }

  // List view
  return (
    <AppWindow title={t('blog')}>
      <div className="space-y-4">
        {blogPosts.map((post) => (
          <button
            key={post.slug}
            onClick={() => setBlogPost(post.slug)}
            className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <h3 className="text-white font-medium">{post.title[lang]}</h3>
            <p className="text-white/50 text-sm mt-1">{post.date}</p>
          </button>
        ))}
      </div>
    </AppWindow>
  )
}
