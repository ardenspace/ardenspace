import { OrbitControls } from '@react-three/drei'
import GlowingComputer from '../components/GlowingComputer'
import Starfield from '../components/Starfield'

export default function InsideSphereScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <OrbitControls
        enableRotate={true}
        enableZoom={true}
        enablePan={false}
        rotateSpeed={0.5}
        minDistance={0.5}
        maxDistance={5}
      />
      <Starfield />
      <GlowingComputer />
    </>
  )
}
