import { useStore } from '../stores/useStore'

const dockItems = [
  { id: 'about', icon: '🙂', type: 'app' as const },
  { id: 'resume', icon: '📄', type: 'app' as const },
  { id: 'blog', icon: '📝', type: 'app' as const },
  { id: 'linkedin', icon: 'in', type: 'link' as const, url: 'https://linkedin.com' },
  { id: 'github', icon: '🐙', type: 'link' as const, url: 'https://github.com' },
  { id: 'email', icon: '📧', type: 'link' as const, url: 'mailto:hello@example.com' },
  { id: 'spotify', icon: '🎵', type: 'link' as const, url: 'https://spotify.com' },
] as const

export default function Dock() {
  const setActiveApp = useStore((s) => s.setActiveApp)

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="glass-strong flex items-center gap-1 px-3 py-2">
        {dockItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.type === 'link') {
                window.open(item.url, '_blank')
              } else {
                setActiveApp(item.id)
              }
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-lg hover:scale-125 hover:bg-white/10 transition-all duration-200 cursor-pointer"
            title={item.id}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  )
}
