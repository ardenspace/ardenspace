import { Suspense, lazy } from 'react'
import { useStore } from '../../stores/useStore'
import AppWindow from '../AppWindow'
import { useT } from '../../i18n'

const ResumeKo = lazy(() => import('../../content/ko/resume.mdx'))
const ResumeEn = lazy(() => import('../../content/en/resume.mdx'))

export default function ResumeApp() {
  const lang = useStore((s) => s.lang)
  const t = useT()
  const Content = lang === 'ko' ? ResumeKo : ResumeEn

  return (
    <AppWindow appId="resume" title={t('resume')}>
      <Suspense fallback={<div className="text-white/40">Loading...</div>}>
        <Content />
      </Suspense>
    </AppWindow>
  )
}
