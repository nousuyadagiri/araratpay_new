import { Canvas, type CanvasProps } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useState } from "react";

/** Shared Canvas: DPR set to 1 for battery and thermal efficiency, antialias off by default, avoids forcing discrete GPU. */
export function SceneCanvas({ children, gl, antialias = false, ...props }: CanvasProps & { antialias?: boolean }) {
  const [dpr, setDpr] = useState(1);
  return <Canvas dpr={dpr} gl={{ alpha: true, antialias, powerPreference: "default", ...(typeof gl === "object" ? gl : {}) }} {...props}>
    <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1)} flipflops={2} onFallback={() => setDpr(1)}/>
    {children}
  </Canvas>;
}
