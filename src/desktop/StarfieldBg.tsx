import { useEffect, useRef } from 'react'

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

function drawPixelStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: 'dot' | 'small' | 'cross' | 'diamond',
  color: number[],
  opacity: number,
) {
  const [r, g, b] = color
  const set = (px: number, py: number, a: number) => {
    ctx.fillStyle = `rgba(${r},${g},${b},${a})`
    ctx.fillRect(Math.round(px), Math.round(py), 2, 2)
  }

  if (type === 'dot') {
    set(x, y, opacity)
    return
  }

  if (type === 'small') {
    set(x, y, opacity)
    set(x + 1, y, opacity * 0.5)
    set(x, y + 1, opacity * 0.5)
    return
  }

  if (type === 'cross') {
    // + shape
    set(x, y, opacity)
    set(x - 1, y, opacity * 0.6)
    set(x + 1, y, opacity * 0.6)
    set(x, y - 1, opacity * 0.6)
    set(x, y + 1, opacity * 0.6)
    return
  }

  // diamond: bigger cross with glow
  set(x, y, opacity)
  set(x - 1, y, opacity * 0.7)
  set(x + 1, y, opacity * 0.7)
  set(x, y - 1, opacity * 0.7)
  set(x, y + 1, opacity * 0.7)
  set(x - 2, y, opacity * 0.3)
  set(x + 2, y, opacity * 0.3)
  set(x, y - 2, opacity * 0.3)
  set(x, y + 2, opacity * 0.3)
  // diagonal hints
  set(x - 1, y - 1, opacity * 0.15)
  set(x + 1, y - 1, opacity * 0.15)
  set(x - 1, y + 1, opacity * 0.15)
  set(x + 1, y + 1, opacity * 0.15)
}

export default function StarfieldBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w
      canvas.height = h

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Disable smoothing for crisp pixels
      ctx.imageSmoothingEnabled = false

      // Dark background
      ctx.fillStyle = '#08080f'
      ctx.fillRect(0, 0, w, h)

      const rand = seededRandom(42)
      const colors = [
        [255, 255, 255],
        [200, 210, 255],
        [255, 220, 180],
        [180, 180, 255],
        [200, 255, 220],
      ]

      for (let i = 0; i < 180; i++) {
        const x = rand() * w
        const y = rand() * h
        const r = rand()
        const type: 'dot' | 'small' | 'cross' | 'diamond' =
          r < 0.5 ? 'dot' :
          r < 0.75 ? 'small' :
          r < 0.92 ? 'cross' : 'diamond'
        const color = colors[Math.floor(rand() * colors.length)]
        const opacity = type === 'dot' ? rand() * 0.4 + 0.2 : rand() * 0.4 + 0.6

        drawPixelStar(ctx, x, y, type, color, opacity)
      }
    }

    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
