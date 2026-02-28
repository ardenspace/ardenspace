import { useMemo } from 'react'

export default function StarfieldBg() {
  const stars = useMemo(() => {
    const result: string[] = []
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 100
      const y = Math.random() * 100
      const size = Math.random() * 2 + 0.5
      const opacity = Math.random() * 0.7 + 0.3
      result.push(`${x}vw ${y}vh 0 ${size}px rgba(255,255,255,${opacity})`)
    }
    return result.join(',')
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black -z-10"
      style={{ boxShadow: stars }}
    />
  )
}
