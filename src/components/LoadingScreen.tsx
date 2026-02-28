import { useProgress } from '@react-three/drei'
import { useEffect } from 'react'
import { useStore } from '../stores/useStore'

export default function LoadingScreen() {
  const { progress, active } = useProgress()
  const setIsLoading = useStore((s) => s.setIsLoading)
  const setLoadingProgress = useStore((s) => s.setLoadingProgress)

  useEffect(() => {
    setLoadingProgress(progress)
    if (!active) {
      setIsLoading(false)
    }
  }, [progress, active, setIsLoading, setLoadingProgress])

  return null
}
