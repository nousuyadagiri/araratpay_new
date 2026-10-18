import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SceneCanvas } from "../SceneCanvas";
import { sceneColors } from "../sceneColors";

type Block = { x: number; y: number; z: number; size: number; kind: number; green: boolean; angle: number; speed: number };
type Edge = [number, number, number, number, number, number];
const COUNT = 64;
const DEPTH = 39;
const blocks: Block[] = Array.from({ length: COUNT }, (_, i) => {
  const angle = i * 2.39996;
  const radius = 3.4 + (i % 7) * .68;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * .73,
    z: -2 - ((i * 11.81) % DEPTH), size: .48 + (i % 6) * .16,
    kind: i % 6 < 2 ? 0 : i % 6 < 4 ? 1 : i % 6 === 4 ? 2 : 3,
    green: i % 8 === 0, angle: i * .49, speed: .12 + (i % 7) * .043 };
});

function polyEdges(sides: number, halfHeight: number): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < sides; i++) {
    const a = i * Math.PI * 2 / sides, b = (i + 1) * Math.PI * 2 / sides;
    const ax = Math.cos(a) * .6, ay = Math.sin(a) * .6, bx = Math.cos(b) * .6, by = Math.sin(b) * .6;
    edges.push([ax, ay, halfHeight, bx, by, halfHeight], [ax, ay, -halfHeight, bx, by, -halfHeight]);
    if (sides === 6 || i % 4 === 0) edges.push([ax, ay, -halfHeight, ax, ay, halfHeight]);
  }
  return edges;
}
function edgesFromGeometry(geometry: THREE.BufferGeometry): Edge[] {
  const positions = geometry.getAttribute("position");
  const result: Edge[] = [];
  for (let i = 0; i < positions.count; i += 2) result.push([positions.getX(i), positions.getY(i), positions.getZ(i), positions.getX(i + 1), positions.getY(i + 1), positions.getZ(i + 1)]);
  return result;
}
function makeForms() {
  const box = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
  const crystal = new THREE.EdgesGeometry(new THREE.OctahedronGeometry(.74));
  const result = [edgesFromGeometry(box), polyEdges(6, .5), edgesFromGeometry(crystal), polyEdges(16, .07)];
  box.dispose(); crystal.dispose();
  return result;
}

function makeLines(segmentCount: number) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(segmentCount * 6), 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(segmentCount * 8), 4).setUsage(THREE.DynamicDrawUsage));
  geometry.setDrawRange(0, 0);
  return geometry;
}
function writeSegment(positions: Float32Array, colors: Float32Array, index: number, a: THREE.Vector3, b: THREE.Vector3, tint: THREE.Color, alpha: number) {
  const p = index * 6, c = index * 8;
  positions.set([a.x, a.y, a.z, b.x, b.y, b.z], p);
  for (let k = 0; k < 2; k++) colors.set([tint.r, tint.g, tint.b, alpha], c + k * 4);
}

function Blocks({ velocity }: { velocity: React.RefObject<number> }) {
  const forms = useMemo(makeForms, []);
  const teal = useMemo(() => new THREE.Color(sceneColors.teal), []);
  const green = useMemo(() => new THREE.Color("#3DDC97"), []);
  const slate = useMemo(() => new THREE.Color(sceneColors.secondary), []);
  const tealGeo = useMemo(() => makeLines(1152), []);
  const greenGeo = useMemo(() => makeLines(256), []);
  const linkGeo = useMemo(() => makeLines(200), []);
  const dustGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(220 * 3), colors = new Float32Array(220 * 4);
    for (let i = 0; i < 220; i++) {
      const a = i * 2.39996, r = 2.5 + (i % 19) * .42;
      positions.set([Math.cos(a) * r, Math.sin(a) * r * .72, -1 - (i * 7.41) % DEPTH], i * 3);
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 4).setUsage(THREE.DynamicDrawUsage));
    return g;
  }, []);
  const positions = useRef(blocks.map(item => ({ ...item })));
  const tempA = useMemo(() => new THREE.Vector3(), []);
  const tempB = useMemo(() => new THREE.Vector3(), []);
  const centerA = useMemo(() => new THREE.Vector3(), []);
  const centerB = useMemo(() => new THREE.Vector3(), []);
  const transformed = useMemo(() => new THREE.Vector3(), []);
  const euler = useMemo(() => new THREE.Euler(), []);
  const tick = useRef(0);
  useEffect(() => () => { tealGeo.dispose(); greenGeo.dispose(); linkGeo.dispose(); dustGeo.dispose(); }, [tealGeo, greenGeo, linkGeo, dustGeo]);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, .05);
    velocity.current *= Math.exp(-3.4 * dt);
    const boost = velocity.current * .75;
    const targetGeos = [tealGeo, greenGeo];
    const counts = [0, 0];
    for (const block of positions.current) {
      block.z += (1.15 + boost) * dt;
      if (block.z > 5) block.z -= DEPTH + 6;
      block.angle += block.speed * dt;
      const fadeIn = THREE.MathUtils.clamp((block.z + DEPTH + 2) / 9, 0, 1);
      const fadeOut = THREE.MathUtils.clamp((5 - block.z) / 7, 0, 1);
      const opacity = (.15 + .45 * THREE.MathUtils.clamp((block.z + DEPTH) / DEPTH, 0, 1)) * fadeIn * fadeOut;
      const group = block.green ? 1 : 0;
      const geo = targetGeos[group];
      const edges = forms[block.kind];
      if (!geo || !edges) continue;
      const pos = geo.getAttribute("position") as THREE.BufferAttribute;
      const col = geo.getAttribute("color") as THREE.BufferAttribute;
      euler.set(block.angle, block.angle * .71, block.angle * .27);
      for (const edge of edges) {
        tempA.set(edge[0], edge[1], edge[2]).multiplyScalar(block.size).applyEuler(euler).add(transformed.set(block.x, block.y, block.z));
        tempB.set(edge[3], edge[4], edge[5]).multiplyScalar(block.size).applyEuler(euler).add(transformed.set(block.x, block.y, block.z));
        writeSegment(pos.array as Float32Array, col.array as Float32Array, counts[group] ?? 0, tempA, tempB, block.green ? green : teal, opacity);
        counts[group] = (counts[group] ?? 0) + 1;
      }
    }
    targetGeos.forEach((geo, i) => { geo.setDrawRange(0, (counts[i] ?? 0) * 2); geo.getAttribute("position").needsUpdate = true; geo.getAttribute("color").needsUpdate = true; });
    // Neighbour checks are throttled and bounded to two links per block; short segments create real dashes.
    tick.current++;
    if (tick.current % 3 === 0) {
      const pos = linkGeo.getAttribute("position") as THREE.BufferAttribute;
      const col = linkGeo.getAttribute("color") as THREE.BufferAttribute;
      let count = 0;
      const linked = new Uint8Array(COUNT);
      for (let i = 0; i < COUNT && count < 198; i++) {
        const a = positions.current[i];
        if (!a) continue;
        for (let j = i + 1; j < COUNT && (linked[i] ?? 0) < 2 && count < 198; j++) {
          const b = positions.current[j];
          if (!b || (linked[j] ?? 0) >= 2 || Math.abs(a.z - b.z) > 6 || Math.hypot(a.x - b.x, a.y - b.y) > 4.8) continue;
          centerA.set(a.x, a.y, a.z); centerB.set(b.x, b.y, b.z);
          const segments = Math.ceil(centerA.distanceTo(centerB) / .6);
          const alpha = .25 * THREE.MathUtils.clamp((Math.min(a.z, b.z) + DEPTH) / DEPTH, 0, 1) * THREE.MathUtils.clamp((5 - Math.max(a.z, b.z)) / 6, 0, 1);
          for (let k = 0; k < segments && count < 198; k += 2) {
            tempA.copy(centerA).lerp(centerB, k / segments);
            tempB.copy(centerA).lerp(centerB, Math.min(1, (k + 1) / segments));
            writeSegment(pos.array as Float32Array, col.array as Float32Array, count++, tempA, tempB, teal, alpha);
          }
          linked[i] = (linked[i] ?? 0) + 1;
          linked[j] = (linked[j] ?? 0) + 1;
        }
      }
      linkGeo.setDrawRange(0, count * 2);
      pos.needsUpdate = true; col.needsUpdate = true;
    }
    const dustPos = dustGeo.getAttribute("position") as THREE.BufferAttribute;
    const dustCol = dustGeo.getAttribute("color") as THREE.BufferAttribute;
    for (let i = 0; i < 220; i++) {
      let z = dustPos.getZ(i) + (2.8 + boost * 1.2) * dt;
      if (z > 5) z -= DEPTH + 6;
      dustPos.setZ(i, z);
      const alpha = .5 * THREE.MathUtils.clamp((z + DEPTH + 2) / 10, 0, 1) * THREE.MathUtils.clamp((5 - z) / 7, 0, 1);
      (dustCol.array as Float32Array).set([slate.r, slate.g, slate.b, alpha], i * 4);
    }
    dustPos.needsUpdate = true; dustCol.needsUpdate = true;
  });
  return <>
    <lineSegments geometry={tealGeo}><lineBasicMaterial vertexColors transparent depthWrite={false} toneMapped={false}/></lineSegments>
    <lineSegments geometry={greenGeo}><lineBasicMaterial vertexColors transparent depthWrite={false} toneMapped={false}/></lineSegments>
    <lineSegments geometry={linkGeo}><lineBasicMaterial vertexColors transparent depthWrite={false} toneMapped={false}/></lineSegments>
    <points geometry={dustGeo}><pointsMaterial size={.045} sizeAttenuation vertexColors transparent depthWrite={false} toneMapped={false}/></points>
  </>;
}

export default function SecurityBlocksScene({ velocity }: { velocity: React.RefObject<number> }) {
  return <SceneCanvas camera={{ position: [0, 0, 7], fov: 65 }} frameloop="always" gl={{ alpha: true }}><Blocks velocity={velocity}/></SceneCanvas>;
}
