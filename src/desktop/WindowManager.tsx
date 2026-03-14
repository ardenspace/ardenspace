import { useStore } from '../stores/useStore'
import AboutApp from './apps/AboutApp'
import ResumeApp from './apps/ResumeApp'
import BlogApp from './apps/BlogApp'
import ExperienceApp from './apps/ExperienceApp'
import ProjectsApp from './apps/ProjectsApp'
import ContactApp from './apps/ContactApp'
import GuestBookApp from './apps/GuestBookApp'

const appComponents: Record<string, () => JSX.Element> = {
  aboutme: AboutApp,
  experience: ExperienceApp,
  projects: ProjectsApp,
  blog: BlogApp,
  contact: ContactApp,
  'guest-book': GuestBookApp,
  resume: ResumeApp,
}

export default function WindowManager() {
  const openApps = useStore((s) => s.openApps)
  const focusedApp = useStore((s) => s.focusedApp)
  const focusApp = useStore((s) => s.focusApp)

  return (
    <>
      {openApps.map((appId, i) => {
        const Component = appComponents[appId]
        if (!Component) return null
        return (
          <div
            key={appId}
            style={{ zIndex: 30 + i }}
            onMouseDown={() => focusApp(appId)}
          >
            <Component />
          </div>
        )
      })}
    </>
  )
}
