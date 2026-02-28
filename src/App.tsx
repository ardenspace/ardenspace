import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, Environment } from '@react-three/drei'
import { useStore } from './stores/useStore'
import { useAudio } from './hooks/useAudio'
import LoadingScreen from './components/LoadingScreen'
import SpaceScene from './scenes/SpaceScene'
import CameraTransition from './scenes/CameraTransition'
import InsideSphereScene from './scenes/InsideSphereScene'

const DesktopScreen = lazy(() => import('./desktop/DesktopScreen'))

function App() {
  const scene = useStore((s) => s.scene)
  const isLoading = useStore((s) => s.isLoading)
  const loadingProgress = useStore((s) => s.loadingProgress)
  useAudio()

  if (scene === 'PC_SCREEN') {
    return (
      <Suspense fallback={<div className="w-full h-full bg-black" />}>
        <DesktopScreen />
      </Suspense>
    )
  }

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <color attach="background" args={['#0a0a0c']} />
        <Suspense fallback={null}>
          <Environment preset="night" />
          <ambientLight intensity={0.3} />
          <pointLight position={[3, -3, 5]} intensity={1} />
          {(scene === 'SPACE' || scene === 'ENTERING_SPHERE') && <SpaceScene />}
          {scene === 'INSIDE_SPHERE' && <InsideSphereScene />}
          <CameraTransition />
          <LoadingScreen />
        </Suspense>
        <Preload all />
      </Canvas>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-white/60 text-sm mb-3">Loading...</div>
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/60 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default App
