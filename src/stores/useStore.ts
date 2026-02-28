import { create } from 'zustand'

export type SceneState = 'SPACE' | 'ENTERING_SPHERE' | 'INSIDE_SPHERE' | 'PC_SCREEN'

interface StoreState {
  scene: SceneState
  setScene: (scene: SceneState) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  loadingProgress: number
  setLoadingProgress: (progress: number) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  lang: 'ko' | 'en'
  setLang: (lang: 'ko' | 'en') => void
  activeApp: string | null
  setActiveApp: (app: string | null) => void
  blogPost: string | null
  setBlogPost: (slug: string | null) => void
}

export const useStore = create<StoreState>((set) => ({
  scene: 'SPACE',
  setScene: (scene) => set({ scene }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  loadingProgress: 0,
  setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
  soundEnabled: true,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  lang: 'ko',
  setLang: (lang) => set({ lang }),
  activeApp: null,
  setActiveApp: (activeApp) => set({ activeApp }),
  blogPost: null,
  setBlogPost: (blogPost) => set({ blogPost }),
}))
