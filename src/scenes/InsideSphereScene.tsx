import { OrbitControls } from '@react-three/drei'
import GlowingComputer from '../components/GlowingComputer'

export default function InsideSphereScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <OrbitControls
        enableRotate={false}
        enableZoom={true}
        enablePan={true}
        mouseButtons={{ LEFT: 2, MIDDLE: undefined, RIGHT: undefined }}
        minDistance={0.5}
        maxDistance={5}
        panSpeed={0.5}
      />
      <GlowingComputer />
    </>
  )
}
