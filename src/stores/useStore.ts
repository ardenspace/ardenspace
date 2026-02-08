export type SceneState = 'SPACE' | 'ENTERING_SPHERE' | 'INSIDE_SPHERE' | 'PC_SCREEN'

interface StoreState {
  scene: SceneState
  setScene: (scene: SceneState) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  loadingProgress: number
  setLoadingProgress: (progress: number) => void
}

import { create } from 'zustand'

export const useStore = create<StoreState>((set) => ({
  scene: 'SPACE',
  setScene: (scene) => set({ scene }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  loadingProgress: 0,
  setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
}))
