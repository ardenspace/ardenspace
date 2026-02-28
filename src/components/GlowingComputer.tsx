import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../stores/useStore'

// Only the center computer (no .001, .002, etc. suffix)
const centerMeshNames = new Set([
  'MacUnit_Mac_0',
  'MacUnit_MacMetal_0',
  'CRT_TVScreen_0',
  'PortCover_Mac_0',
])

function isCenterComputer(name: string) {
  return centerMeshNames.has(name)
}

export default function GlowingComputer() {
  const { scene } = useGLTF('/ardensgarden.glb')
  const setScene = useStore((s) => s.setScene)

  // Hide the glass sphere shell when viewing from inside
  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === 'GlassSphere' || child.name === 'Sphere.052') {
        child.visible = false
      }
    })
    return () => {
      scene.traverse((child) => {
        if (child.name === 'GlassSphere' || child.name === 'Sphere.052') {
          child.visible = true
        }
      })
    }
  }, [scene])

  const handleClick = (e: { object: THREE.Object3D; stopPropagation: () => void }) => {
    let obj: THREE.Object3D | null = e.object
    while (obj) {
      if (isCenterComputer(obj.name)) {
        e.stopPropagation()
        setScene('PC_SCREEN')
        return
      }
      obj = obj.parent
    }
  }

  return (
    <group onClick={handleClick}>
      <primitive object={scene} />
    </group>
  )
}
