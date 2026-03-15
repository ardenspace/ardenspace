import { Suspense, lazy } from 'react'
import { useStore } from '../../stores/useStore'
import AppWindow from '../AppWindow'
import { useT } from '../../i18n'

const ExperienceKo = lazy(() => import('../../content/ko/experience.mdx'))
const ExperienceEn = lazy(() => import('../../content/en/experience.mdx'))

export default function ExperienceApp() {
  const lang = useStore((s) => s.lang)
  const t = useT()
  const Content = lang === 'ko' ? ExperienceKo : ExperienceEn

  return (
    <AppWindow appId="experience" title={t('experience')}>
      <Suspense fallback={<div className="text-white/40">Loading...</div>}>
        <Content />
      </Suspense>
    </AppWindow>
  )
}
