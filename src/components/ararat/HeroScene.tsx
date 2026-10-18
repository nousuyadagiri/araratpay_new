import { SceneCanvas } from "./SceneCanvas";
import { useSceneColors } from "./sceneColors";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Point = [number, number, number];

function NetworkPeak({ reducedMotion }: { reducedMotion: boolean }) { const sceneColors = useSceneColors();
  const group = useRef<THREE.Group>(null);
  const { points, lines } = useMemo(() => {
    const rows: Point[][] = [];
    for (let ring = 0; ring < 10; ring++) {
      const radius = 0.22 + ring * 0.42;
      const height = 3.25 - ring * 0.38 + Math.sin(ring * 1.7) * 0.09;
      const count = ring === 0 ? 5 : ring * 5 + 5;
      rows.push(Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + ring * 0.17;
        const distortion = 1 + 0.12 * Math.sin(i * 2.7 + ring * 1.3);
        return [Math.cos(angle) * radius * distortion, height + Math.sin(i * 2.3 + ring) * 0.13, Math.sin(angle) * radius * distortion] as Point;
      }));
    }
    const segments: Point[][] = [];
    rows.forEach((row, ring) => row.forEach((point, index) => {
      const neighbor = row[(index + 1) % row.length];
      if (neighbor) segments.push([point, neighbor]);
      if (ring < rows.length - 1) {
        const next = rows[ring + 1];
        if (next) {
          const near = Math.floor(index / row.length * next.length);
          const first = next[near];
          if (first) segments.push([point, first]);
          const second = next[(near + 1) % next.length];
          if (index % 2 === 0 && second) segments.push([point, second]);
        }
      }
    }));
    return { points: rows.flat(), lines: segments };
  }, []);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y += Math.min(delta, 0.05) * 0.045;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.22) * 0.015;
  });

  return <group ref={group} position={[0, -1.65, 0]} rotation={[0.18, -0.25, 0]}>
    <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[3.5, 3.52, 96]} />
      <meshBasicMaterial color={sceneColors.teal} transparent opacity={0.18} side={THREE.DoubleSide} />
    </mesh>
    {lines.map((segment, i) => <line key={i}>
      <bufferGeometry attach="geometry" onUpdate={(geometry) => geometry.setFromPoints(segment.map((p) => new THREE.Vector3(...p)))} />
      <lineBasicMaterial color={i % 11 === 0 ? sceneColors.tealLight : sceneColors.secondary} transparent opacity={i % 11 === 0 ? 0.55 : 0.24} />
    </line>)}
    {points.filter((_, i) => i % 3 === 0).map((point, i) => <mesh key={i} position={point}>
      <sphereGeometry args={[i % 7 === 0 ? 0.038 : 0.023, 6, 6]} />
      <meshBasicMaterial color={i % 7 === 0 ? sceneColors.teal : sceneColors.white} transparent opacity={i % 7 === 0 ? 0.9 : 0.55} />
    </mesh>)}
    <mesh position={[0, 3.38, 0]}>
      <octahedronGeometry args={[0.085, 0]} />
      <meshStandardMaterial color={sceneColors.teal} emissive={sceneColors.teal} emissiveIntensity={2} />
    </mesh>
  </group>;
}

export default function HeroScene({ reducedMotion = false }: { reducedMotion?: boolean }) { const sceneColors = useSceneColors();
  return <SceneCanvas antialias frameloop={reducedMotion ? "demand" : "always"} camera={{ position: [6.5, 4.4, 8.3], fov: 42 }}>
    <ambientLight intensity={0.7} />
    <directionalLight position={[3, 7, 5]} intensity={1.5} color={sceneColors.teal} />
    <Environment>
      <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
      <Lightformer intensity={1} color={sceneColors.deepBlue} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
    </Environment>
    <NetworkPeak reducedMotion={reducedMotion} />
  </SceneCanvas>;
}