import { SceneCanvas } from "../SceneCanvas";
import { useSceneColors } from "../sceneColors";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import type { ProductSlug } from "./productData";



function Coin() { const sceneColors = useSceneColors();
  return <group rotation={[Math.PI / 2, 0, 0]}>
    <mesh><cylinderGeometry args={[1.5, 1.5, 0.22, 48]} /><meshStandardMaterial color={sceneColors.teal} metalness={0.85} roughness={0.28} /></mesh>
    <mesh position={[0, 0.12, 0]}><torusGeometry args={[1.2, 0.05, 12, 48]} /><meshStandardMaterial color={sceneColors.tealLight} metalness={0.9} roughness={0.2} /></mesh>
    <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.55, 3]} /><meshStandardMaterial color={sceneColors.background} /></mesh>
  </group>;
}
function Payouts() { const sceneColors = useSceneColors();
  return <group>
    <mesh><icosahedronGeometry args={[0.7, 0]} /><meshStandardMaterial color={sceneColors.teal} metalness={0.7} roughness={0.3} flatShading /></mesh>
    {Array.from({ length: 5 }, (_, i) => { const a = (i / 5) * Math.PI * 2; return <group key={i} rotation={[0, 0, a]}>
      <mesh position={[1.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.025, 0.025, 1.2, 6]} /><meshBasicMaterial color={sceneColors.white} transparent opacity={0.6} /></mesh>
      <mesh position={[2.1, 0, 0]}><octahedronGeometry args={[0.22, 0]} /><meshStandardMaterial color={sceneColors.white} emissive={sceneColors.white} emissiveIntensity={0.6} /></mesh>
    </group>; })}
  </group>;
}
function Bank() { const sceneColors = useSceneColors();
  return <group position={[0, -0.3, 0]}>
    <mesh position={[0, 1.35, 0]}><coneGeometry args={[1.7, 0.7, 4]} /><meshStandardMaterial color={sceneColors.teal} metalness={0.7} roughness={0.3} flatShading /></mesh>
    {[-1.1, -0.37, 0.37, 1.1].map(x => <mesh key={x} position={[x, 0.2, 0.3]}><cylinderGeometry args={[0.13, 0.13, 1.6, 12]} /><meshStandardMaterial color={sceneColors.white} metalness={0.5} roughness={0.35} /></mesh>)}
    <RoundedBox args={[3, 0.25, 1.4]} position={[0, -0.7, 0]} radius={0.05}><meshStandardMaterial color={sceneColors.elevated} metalness={0.6} roughness={0.4} /></RoundedBox>
  </group>;
}
function Card() { const sceneColors = useSceneColors();
  return <group>
    <RoundedBox args={[3.4, 2.15, 0.06]} radius={0.12} smoothness={4}><meshStandardMaterial color={sceneColors.surface} metalness={0.8} roughness={0.25} /></RoundedBox>
    <mesh position={[-1.05, 0.2, 0.035]}><planeGeometry args={[0.5, 0.38]} /><meshStandardMaterial color={sceneColors.teal} metalness={0.9} roughness={0.2} /></mesh>
    <mesh position={[1.0, 0.65, 0.035]}><circleGeometry args={[0.22, 3]} /><meshStandardMaterial color={sceneColors.tealLight} emissive={sceneColors.tealLight} emissiveIntensity={0.4} /></mesh>
    <mesh position={[0, -0.65, 0.035]}><planeGeometry args={[2.8, 0.05]} /><meshBasicMaterial color={sceneColors.white} transparent opacity={0.5} /></mesh>
  </group>;
}

function Spinner({ slug, reducedMotion }: { slug: ProductSlug; reducedMotion: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current || reducedMotion) return;
    const dt = Math.min(delta, 0.05);
    ref.current.rotation.y += dt * (slug === "crypto-out" ? 0.25 : 0.45);
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
  });
  return <group ref={ref} rotation={[0.15, -0.4, 0]}>
    {slug === "crypto-in" && <Coin />}
    {slug === "crypto-out" && <Payouts />}
    {slug === "fiat-out" && <Bank />}
    {slug === "cards" && <Card />}
  </group>;
}

export default function ProductScene({ slug, reducedMotion = false }: { slug: ProductSlug; reducedMotion?: boolean }) { const sceneColors = useSceneColors();
  return <SceneCanvas antialias frameloop={reducedMotion ? "demand" : "always"} camera={{ position: [0, 0.6, 6.5], fov: 45 }}>
    <ambientLight intensity={0.6} />
    <directionalLight position={[3, 5, 4]} intensity={1.6} color={sceneColors.teal} />
    <directionalLight position={[-4, -1, 2]} intensity={0.8} color={sceneColors.white} />
    <Environment>
      <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
      <Lightformer intensity={1} color={sceneColors.deepBlue} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
    </Environment>
    <Spinner slug={slug} reducedMotion={reducedMotion} />
  </SceneCanvas>;
}
