import { Suspense, lazy } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, Environment } from "@react-three/drei";
import { useStore } from "./stores/useStore";
import { useAudio } from "./hooks/useAudio";
import LoadingScreen from "./components/LoadingScreen";
import LoadingOverlay from "./components/LoadingOverlay";
import SpaceScene from "./scenes/SpaceScene";
import CameraTransition from "./scenes/CameraTransition";
import InsideSphereScene from "./scenes/InsideSphereScene";

const DesktopScreen = lazy(() => import("./desktop/DesktopScreen"));

function App() {
  const scene = useStore((s) => s.scene);
  const isLoading = useStore((s) => s.isLoading);
  useAudio();

  if (scene === "PC_SCREEN") {
    return (
      <Suspense fallback={<div className="w-full h-full bg-black" />}>
        <DesktopScreen />
      </Suspense>
    );
  }

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <color attach="background" args={["#0a0a0c"]} />
        <Suspense fallback={null}>
          <Environment preset="night" />
          <ambientLight intensity={0.3} />
          <pointLight position={[3, -3, 5]} intensity={1} />
          {(scene === "SPACE" || scene === "ENTERING_SPHERE") && <SpaceScene />}
          {scene === "INSIDE_SPHERE" && <InsideSphereScene />}
          <CameraTransition />
          <LoadingScreen />
        </Suspense>
        <Preload all />
      </Canvas>

      {/* Loading overlay */}
      {isLoading && <LoadingOverlay />}
    </>
  );
}

export default App;
