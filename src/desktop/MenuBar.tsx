import { useState } from 'react'
import { useStore } from '../stores/useStore'
import { useT } from '../i18n'

export default function MenuBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const setScene = useStore((s) => s.setScene)
  const soundEnabled = useStore((s) => s.soundEnabled)
  const setSoundEnabled = useStore((s) => s.setSoundEnabled)
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)
  const t = useT()

  return (
    <div className="h-7 flex items-center justify-between px-4 glass text-white/80 text-xs rounded-none border-x-0 border-t-0 relative z-50">
      {/* Left: Star menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hover:text-white transition-colors cursor-pointer"
        >
          ☆
        </button>
        {menuOpen && (
          <div className="absolute top-7 left-0 glass-strong py-1 min-w-[160px]">
            <button
              onClick={() => {
                setScene('SPACE')
                setMenuOpen(false)
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-white/80 text-xs cursor-pointer"
            >
              {t('backToSpace')}
            </button>
          </div>
        )}
      </div>

      {/* Right: Sound + Language */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="hover:text-white transition-colors cursor-pointer"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        <button
          onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          {lang === 'ko' ? 'EN' : 'KR'}
        </button>
      </div>
    </div>
  )
}
