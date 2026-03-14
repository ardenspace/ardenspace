import { useEffect, useRef } from 'react'
import { useStore } from '../stores/useStore'

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const soundEnabled = useStore((s) => s.soundEnabled)
  const isLoading = useStore((s) => s.isLoading)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sound/audio.wav')
      audioRef.current.loop = true
      audioRef.current.volume = 0.3
    }
  }, [])

  // Start playing when landing page is reached (loading complete)
  useEffect(() => {
    if (!isLoading && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
  }, [isLoading])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !soundEnabled
    }
  }, [soundEnabled])
}
