import { useState, useEffect } from 'react'
import { useStore } from '../stores/useStore'

const SPACE_LETTERS = ['S', 'P', 'A', 'C', 'E']
const LETTER_DELAY = 300
const PAUSE_DELAY = 1000
const FADE_DURATION = 800

export default function LoadingOverlay() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [animationDone, setAnimationDone] = useState(false)
  const [fading, setFading] = useState(false)
  const assetsReady = useStore((s) => s.assetsReady)
  const setIsLoading = useStore((s) => s.setIsLoading)

  useEffect(() => {
    if (visibleCount < SPACE_LETTERS.length) {
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), LETTER_DELAY)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setAnimationDone(true), PAUSE_DELAY)
      return () => clearTimeout(timer)
    }
  }, [visibleCount])

  useEffect(() => {
    if (animationDone && assetsReady) {
      setFading(true)
      const timer = setTimeout(() => setIsLoading(false), FADE_DURATION)
      return () => clearTimeout(timer)
    }
  }, [animationDone, assetsReady, setIsLoading])

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      style={{
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease-out`,
      }}
    >
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: 120, height: 140 }}>
          {/* Main big star - center */}
          <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <div style={{ animation: 'starPulse 2.5s ease-in-out infinite' }}>
              <svg width="70" height="70" viewBox="0 0 80 80">
                <path d="M40,0 L42,35 L53,27 L45,38 L80,40 L45,42 L53,53 L42,45 L40,80 L38,45 L27,53 L35,42 L0,40 L35,38 L27,27 L38,35 Z" fill="rgba(180,180,190,0.8)" />
              </svg>
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(circle, rgba(170,170,180,0.2) 0%, transparent 70%)',
                filter: 'blur(6px)',
              }} />
            </div>
          </div>
          {/* Small star - top left */}
          <div className="absolute" style={{ left: '20%', top: '10%' }}>
            <div style={{ animation: 'starPulse 2.5s ease-in-out infinite 0.4s' }}>
              <svg width="18" height="24" viewBox="0 0 60 80">
                <path d="M30 0 C30.5 35, 33 38, 60 40 C33 42, 30.5 45, 30 80 C29.5 45, 27 42, 0 40 C27 38, 29.5 35, 30 0Z" fill="rgba(180,180,190,0.7)" />
              </svg>
            </div>
          </div>
          {/* Small star - top right */}
          <div className="absolute" style={{ left: '70%', top: '5%' }}>
            <div style={{ animation: 'starPulse 2.5s ease-in-out infinite 0.8s' }}>
              <svg width="14" height="18" viewBox="0 0 60 80">
                <path d="M30 0 C30.5 35, 33 38, 60 40 C33 42, 30.5 45, 30 80 C29.5 45, 27 42, 0 40 C27 38, 29.5 35, 30 0Z" fill="rgba(170,170,180,0.6)" />
              </svg>
            </div>
          </div>
          {/* Tiny star - left */}
          <div className="absolute" style={{ left: '5%', top: '42%' }}>
            <div style={{ animation: 'starPulse 2.5s ease-in-out infinite 1.2s' }}>
              <svg width="10" height="13" viewBox="0 0 60 80">
                <path d="M30 0 C30.5 35, 33 38, 60 40 C33 42, 30.5 45, 30 80 C29.5 45, 27 42, 0 40 C27 38, 29.5 35, 30 0Z" fill="rgba(160,160,170,0.45)" />
              </svg>
            </div>
          </div>
          {/* Tiny star - right */}
          <div className="absolute" style={{ left: '88%', top: '35%' }}>
            <div style={{ animation: 'starPulse 2.5s ease-in-out infinite 0.6s' }}>
              <svg width="12" height="16" viewBox="0 0 60 80">
                <path d="M30 0 C30.5 35, 33 38, 60 40 C33 42, 30.5 45, 30 80 C29.5 45, 27 42, 0 40 C27 38, 29.5 35, 30 0Z" fill="rgba(160,160,170,0.45)" />
              </svg>
            </div>
          </div>
          {/* Tiny star - bottom */}
          <div className="absolute" style={{ left: '38%', top: '85%' }}>
            <div style={{ animation: 'starPulse 2.5s ease-in-out infinite 1.0s' }}>
              <svg width="8" height="11" viewBox="0 0 60 80">
                <path d="M30 0 C30.5 35, 33 38, 60 40 C33 42, 30.5 45, 30 80 C29.5 45, 27 42, 0 40 C27 38, 29.5 35, 30 0Z" fill="rgba(160,160,170,0.4)" />
              </svg>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes starPulse {
            0% {
              transform: scale(0) rotate(0deg);
              opacity: 0;
            }
            15% {
              transform: scale(1.1) rotate(0deg);
              opacity: 1;
            }
            40% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
            70% {
              transform: scale(0.5) rotate(25deg);
              opacity: 0.6;
            }
            100% {
              transform: scale(0) rotate(45deg);
              opacity: 0;
            }
          }
        `}</style>
        <div className="text-sm mt-2 font-mono text-center" style={{ color: 'rgba(180,180,190,0.8)' }}>
          <span>ARDEN&apos;</span>
          {SPACE_LETTERS.map((letter, i) => (
            <span
              key={i}
              style={{
                opacity: i < visibleCount ? 1 : 0,
                transition: 'opacity 0.3s ease-in',
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
