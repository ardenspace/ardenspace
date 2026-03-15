import { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import GlowingComputer from "../components/GlowingComputer";
import Starfield from "../components/Starfield";
import { useStore } from "../stores/useStore";
import { useIsMobile } from "../hooks/useIsMobile";

export default function InsideSphereScene() {
  const setScene = useStore((s) => s.setScene);
  const downRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const isMobile = useIsMobile();

  // Set initial camera position
  useEffect(() => {
    if (isMobile) {
      camera.position.set(0, 0.6, 5);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 0.1, 2.85);
    }
  }, [camera, isMobile]);

  useEffect(() => {
    const dom = gl.domElement;

    const onDown = (e: PointerEvent) => {
      downRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    };

    const onUp = (e: PointerEvent) => {
      if (!downRef.current) return;
      const dx = e.clientX - downRef.current.x;
      const dy = e.clientY - downRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const elapsed = Date.now() - downRef.current.time;
      downRef.current = null;

      if (dist < 5 && elapsed < 300) {
        // Delay so R3F's onClick (e.g. computer click → PC_SCREEN) fires first
        requestAnimationFrame(() => {
          const current = useStore.getState().scene;
          if (current === "INSIDE_SPHERE") {
            setScene("SPACE");
          }
        });
      }
    };

    dom.addEventListener("pointerdown", onDown);
    dom.addEventListener("pointerup", onUp);
    return () => {
      dom.removeEventListener("pointerdown", onDown);
      dom.removeEventListener("pointerup", onUp);
    };
  }, [gl, setScene]);

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
  );
}
