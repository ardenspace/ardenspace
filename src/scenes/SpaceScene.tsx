import { OrbitControls } from '@react-three/drei'
import Starfield from '../components/Starfield'
import SphereModel from '../components/SphereModel'

export default function SpaceScene() {
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
      />
      <Starfield />
      <SphereModel />
    </>
  )
}
