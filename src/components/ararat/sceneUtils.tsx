import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/** One draw call for many line segments. */
export function Segments({ pairs, color, opacity }: { pairs: [THREE.Vector3, THREE.Vector3][]; color: string; opacity: number }) {
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(pairs.flat()), [pairs]);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);
  return <lineSegments geometry={geometry}><lineBasicMaterial color={color} transparent opacity={opacity}/></lineSegments>;
}

/** Polyline paths merged into one segments draw. */
export function pathsToPairs(paths: THREE.Vector3[][]) {
  const pairs: [THREE.Vector3, THREE.Vector3][] = [];
  for (const p of paths) for (let i = 1; i < p.length; i++) pairs.push([p[i - 1]!, p[i]!]);
  return pairs;
}

/** Instanced spheres — one draw call per color. */
export function Dots({ points, radius, color, segments = 6 }: { points: THREE.Vector3[]; radius: number; color: string; segments?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current; if (!mesh) return;
    const m = new THREE.Matrix4();
    points.forEach((p, i) => mesh.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z)));
    mesh.instanceMatrix.needsUpdate = true;
  }, [points]);
  if (!points.length) return null;
  return <instancedMesh ref={ref} args={[undefined, undefined, points.length]}><sphereGeometry args={[radius, segments, segments]}/><meshBasicMaterial color={color}/></instancedMesh>;
}
