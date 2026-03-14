import { create } from 'zustand'

export type SceneState = 'SPACE' | 'ENTERING_SPHERE' | 'INSIDE_SPHERE' | 'PC_SCREEN'

interface StoreState {
  scene: SceneState
  setScene: (scene: SceneState) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  assetsReady: boolean
  setAssetsReady: (ready: boolean) => void
  loadingProgress: number
  setLoadingProgress: (progress: number) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  lang: 'ko' | 'en'
  setLang: (lang: 'ko' | 'en') => void
  openApps: string[]
  minimizedApps: string[]
  focusedApp: string | null
  openApp: (app: string) => void
  closeApp: (app: string) => void
  focusApp: (app: string) => void
  minimizeApp: (app: string) => void
  restoreApp: (app: string) => void
  blogPost: string | null
  setBlogPost: (slug: string | null) => void
}

export const useStore = create<StoreState>((set) => ({
  scene: 'SPACE',
  setScene: (scene) => set({ scene }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  assetsReady: false,
  setAssetsReady: (assetsReady) => set({ assetsReady }),
  loadingProgress: 0,
  setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
  soundEnabled: true,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  lang: 'en',
  setLang: (lang) => set({ lang }),
  openApps: [],
  minimizedApps: [],
  focusedApp: null,
  openApp: (app) => set((s) => ({
    openApps: s.openApps.includes(app) ? s.openApps : [...s.openApps, app],
    minimizedApps: s.minimizedApps.filter((a) => a !== app),
    focusedApp: app,
  })),
  closeApp: (app) => set((s) => ({
    openApps: s.openApps.filter((a) => a !== app),
    minimizedApps: s.minimizedApps.filter((a) => a !== app),
    focusedApp: s.focusedApp === app ? (s.openApps.filter((a) => a !== app).at(-1) ?? null) : s.focusedApp,
  })),
  focusApp: (app) => set((s) => ({
    openApps: [...s.openApps.filter((a) => a !== app), app],
    focusedApp: app,
  })),
  minimizeApp: (app) => set((s) => ({
    minimizedApps: [...s.minimizedApps, app],
    focusedApp: s.focusedApp === app ? (s.openApps.filter((a) => a !== app && !s.minimizedApps.includes(a)).at(-1) ?? null) : s.focusedApp,
  })),
  restoreApp: (app) => set((s) => ({
    minimizedApps: s.minimizedApps.filter((a) => a !== app),
    openApps: [...s.openApps.filter((a) => a !== app), app],
    focusedApp: app,
  })),
  blogPost: null,
  setBlogPost: (blogPost) => set({ blogPost }),
}))
