import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Generate a soft circular glow texture
function createStarTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

export default function Starfield() {
  const ref = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(3000 * 3)
    const col = new Float32Array(3000 * 3)
    // Warm star color palette
    const palette = [
      [1.0, 0.95, 0.9],   // warm white
      [1.0, 0.7, 0.4],    // orange
      [1.0, 0.45, 0.35],  // red
      [0.6, 0.8, 1.0],    // light blue
      [0.4, 0.5, 1.0],    // blue
      [0.8, 0.6, 1.0],    // purple
      [0.5, 1.0, 0.7],    // mint green
      [1.0, 0.9, 0.4],    // yellow
    ]
    for (let i = 0; i < 3000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c[0]
      col[i * 3 + 1] = c[1]
      col[i * 3 + 2] = c[2]
    }
    return { positions: pos, colors: col }
  }, [])

  const starTexture = useMemo(() => createStarTexture(), [])

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.01
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.17}
        map={starTexture}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  )
}
