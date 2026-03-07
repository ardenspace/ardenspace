import { useState, useRef, useEffect } from 'react'
import { BsStars } from "react-icons/bs";
import { useStore } from '../stores/useStore'
import { useT } from '../i18n'

function MenuItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-white/80 text-xs cursor-pointer"
    >
      {children}
    </button>
  )
}

function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatted = now.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }) + ' ' + now.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return <span className="text-xs font-bold">{formatted}</span>
}

export default function MenuBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const setScene = useStore((s) => s.setScene)
  const soundEnabled = useStore((s) => s.soundEnabled)
  const setSoundEnabled = useStore((s) => s.setSoundEnabled)
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)
  const t = useT()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  return (
    <div className="absolute top-1 left-3 right-3 h-7 flex items-center justify-between px-4 text-white/80 text-xs z-50">
      {/* Left: Icon + menu */}
      <div ref={menuRef} className="relative flex items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hover:text-white transition-colors cursor-pointer flex items-center"
        >
          <BsStars size={20} />
        </button>
        {menuOpen && (
          <div className="absolute top-7 left-3 py-1 min-w-[160px]"
            style={{
              background: 'rgba(30, 30, 30, 0.8)',
              backdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
            }}
          >
            <MenuItem onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
            </MenuItem>
            <MenuItem onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}>
              🌐 {lang === 'ko' ? 'English' : '한국어'}
            </MenuItem>
            <div className="border-t border-white/10 my-1" />
            <MenuItem onClick={() => { setScene('SPACE'); setMenuOpen(false) }}>
              🚀 {t('backToSpace')}
            </MenuItem>
          </div>
        )}
      </div>

      {/* Right: Clock */}
      <Clock />
    </div>
  )
}
