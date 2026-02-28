import { useStore } from '../stores/useStore'
import AboutApp from './apps/AboutApp'
import ResumeApp from './apps/ResumeApp'
import BlogApp from './apps/BlogApp'

export default function WindowManager() {
  const activeApp = useStore((s) => s.activeApp)

  if (!activeApp) return null

  switch (activeApp) {
    case 'about':
      return <AboutApp />
    case 'resume':
      return <ResumeApp />
    case 'blog':
      return <BlogApp />
    default:
      return null
  }
}
