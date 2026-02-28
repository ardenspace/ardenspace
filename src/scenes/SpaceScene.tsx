import { useCallback } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import Starfield from '../components/Starfield'
import SphereModel from '../components/SphereModel'
import { useStore } from '../stores/useStore'

export default function SpaceScene() {
  const setScene = useStore((s) => s.setScene)
  const camera = useThree((s) => s.camera)

  const handleChange = useCallback(() => {
    const dist = camera.position.length()
    if (dist < 6) {
      setScene('ENTERING_SPHERE')
    }
  }, [camera, setScene])

  return (
    <>
      <OrbitControls
        enableRotate={false}
        enableZoom={true}
        enablePan={true}
        mouseButtons={{ LEFT: 2, MIDDLE: undefined, RIGHT: undefined }}
        minDistance={2}
        maxDistance={100}
        zoomSpeed={1}
        panSpeed={0.5}
        onChange={handleChange}
      />
      <Starfield />
      <SphereModel />
    </>
  )
}
