import type { ReactNode } from 'react'
import { useStore } from '../stores/useStore'

interface AppWindowProps {
  title: string
  children: ReactNode
}

export default function AppWindow({ title, children }: AppWindowProps) {
  const setActiveApp = useStore((s) => s.setActiveApp)

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 p-12 pb-20 pt-10">
      <div className="glass-strong w-full max-w-2xl h-full flex flex-col overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <button
            onClick={() => setActiveApp(null)}
            className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors cursor-pointer"
          />
          <span className="w-3 h-3 rounded-full bg-yellow-500/30" />
          <span className="w-3 h-3 rounded-full bg-green-500/30" />
          <span className="ml-2 text-white/60 text-xs">{title}</span>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 mdx-content">
          {children}
        </div>
      </div>
    </div>
  )
}
