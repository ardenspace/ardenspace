import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useStore } from '../stores/useStore'

export function useCameraTransition() {
  const camera = useThree((s) => s.camera)
  const scene = useStore((s) => s.scene)
  const setScene = useStore((s) => s.setScene)

  useEffect(() => {
    if (scene === 'ENTERING_SPHERE') {
      gsap.to(camera.position, {
        x: 0,
        y: -0.1,
        z: 2.8,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(0, 0, 0),
        onComplete: () => setScene('INSIDE_SPHERE'),
      })
    }

    // Reset camera when returning to SPACE
    if (scene === 'SPACE') {
      camera.position.set(0, 0, 30)
      camera.lookAt(0, 0, 0)
    }
  }, [scene, camera, setScene])
}
