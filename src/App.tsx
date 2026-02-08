import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { useStore } from './stores/useStore'

function App() {
  const scene = useStore((s) => s.scene)

  return (
    <>
      <Canvas
        camera={{ position: [0, -7, 0.3], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000']} />
        <Suspense fallback={null}>
          {/* Scenes will be added here */}
          <ambientLight intensity={0.2} />
          <pointLight position={[3, -3, 5]} intensity={1} />
        </Suspense>
        <Preload all />
      </Canvas>

      {/* 2D UI Overlay */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
          {scene === 'SPACE' && 'Click the sphere to enter'}
        </div>
      </div>
    </>
  )
}

export default App
