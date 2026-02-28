import { Suspense, lazy } from 'react'
import { useStore } from '../../stores/useStore'
import AppWindow from '../AppWindow'
import { useT } from '../../i18n'

const AboutKo = lazy(() => import('../../content/about.ko.mdx'))
const AboutEn = lazy(() => import('../../content/about.en.mdx'))

export default function AboutApp() {
  const lang = useStore((s) => s.lang)
  const t = useT()
  const Content = lang === 'ko' ? AboutKo : AboutEn

  return (
    <AppWindow title={t('about')}>
      <Suspense fallback={<div className="text-white/40">Loading...</div>}>
        <Content />
      </Suspense>
    </AppWindow>
  )
}
