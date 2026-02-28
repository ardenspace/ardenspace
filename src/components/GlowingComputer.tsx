import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../stores/useStore'

function isComputerMesh(name: string) {
  return /mac|crt|portcover/i.test(name)
}

export default function GlowingComputer() {
  const { scene } = useGLTF('/ardensgarden.glb')
  const setScene = useStore((s) => s.setScene)

  const handleClick = (e: { object: THREE.Object3D; stopPropagation: () => void }) => {
    // Walk up ancestors to check if any mesh in the click chain is a computer part
    let obj: THREE.Object3D | null = e.object
    while (obj) {
      if (isComputerMesh(obj.name)) {
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
      <pointLight position={[0, 0.5, 0]} color="#4488ff" intensity={2} distance={3} />
    </group>
  )
}
