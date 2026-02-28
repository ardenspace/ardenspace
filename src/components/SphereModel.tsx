import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../stores/useStore'

export default function SphereModel() {
  const { scene } = useGLTF('/ardensgarden.glb')
  const ref = useRef<THREE.Group>(null)
  const setScene = useStore((s) => s.setScene)

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshPhysicalMaterial
        // Disable transmission (glass effect) so model is visible against black bg
        if (mat.transmission && mat.transmission > 0) {
          mat.transmission = 0
          mat.opacity = 0.8
          mat.transparent = true
          mat.roughness = 0.2
          mat.metalness = 0.1
          mat.needsUpdate = true
        }
      }
    })
  }, [scene])

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15
    }
  })

  return (
    <group rotation={[0.2, 0, 0.45]} position={[0, 0, 0]}>
      <group
        ref={ref}
        onClick={() => setScene('ENTERING_SPHERE')}
      >
        <primitive object={scene} />
      </group>
    </group>
  )
}
