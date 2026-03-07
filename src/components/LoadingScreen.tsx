import { useProgress } from '@react-three/drei'
import { useEffect } from 'react'
import { useStore } from '../stores/useStore'

export default function LoadingScreen() {
  const { progress, active } = useProgress()
  const setAssetsReady = useStore((s) => s.setAssetsReady)
  const setLoadingProgress = useStore((s) => s.setLoadingProgress)

  useEffect(() => {
    setLoadingProgress(progress)
    if (!active) {
      setAssetsReady(true)
    }
  }, [progress, active, setAssetsReady, setLoadingProgress])

  return null
}
