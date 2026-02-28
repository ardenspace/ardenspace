import { useEffect, useRef } from 'react'
import { useStore } from '../stores/useStore'

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const soundEnabled = useStore((s) => s.soundEnabled)
  const scene = useStore((s) => s.scene)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/wind.mp3')
      audioRef.current.loop = true
      audioRef.current.volume = 0.3
    }
  }, [])

  // Start playing on first scene transition (user interaction)
  useEffect(() => {
    if (scene === 'ENTERING_SPHERE' && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
  }, [scene])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !soundEnabled
    }
  }, [soundEnabled])
}
