import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { SceneCanvas } from "./SceneCanvas";
import { worldDots } from "./worldDots";
import { cities } from "./coverageData";
import { coverageSceneColors } from "./sceneColors";
import { useTheme } from "./theme";
const point=(x:number,y:number,r=2)=>{const lat=(.5-y/360)*Math.PI,lon=(x/800-.5)*Math.PI*2;return new THREE.Vector3(r*Math.cos(lat)*Math.sin(lon),r*Math.sin(lat),r*Math.cos(lat)*Math.cos(lon));};
function Globe({active,playing}:{active:number;playing:boolean}){
 const palette=coverageSceneColors[useTheme()];
 const group=useRef<THREE.Group>(null),drag=useRef({down:false,x:0,y:0,rotation:0,tilt:0,pause:0}),phase=useRef(0),last=useRef(active);
 const elapsed=useRef(0);
 const points=useMemo(()=>new Float32Array(worldDots.flatMap(([x,y])=>point(x,y).toArray())),[]);
 const grid=useMemo(()=>{const lines:THREE.Vector3[][]=[];for(let y=60;y<360;y+=60)lines.push(Array.from({length:97},(_,i)=>point(i/96*800,y,2.01)));for(let x=0;x<800;x+=100)lines.push(Array.from({length:65},(_,i)=>point(x,i/64*360,2.01)));return lines;},[]);
 const route=useMemo(()=>{const city=cities[active]??cities[0];const a=point(city.x,city.y).normalize(),b=point(cities[0].x,cities[0].y).normalize(),angle=a.angleTo(b);return Array.from({length:65},(_,i)=>{const t=i/64;const v=angle<.001?a.clone():a.clone().multiplyScalar(Math.sin((1-t)*angle)).add(b.clone().multiplyScalar(Math.sin(t*angle))).divideScalar(Math.sin(angle));return v.multiplyScalar(2.025+Math.sin(t*Math.PI)*.3);});},[active]);
 const arc=useRef<THREE.Mesh>(null),ping=useRef<THREE.Mesh>(null);
 useFrame((state,delta)=>{elapsed.current=state.clock.elapsedTime;if(!playing)return;const node=group.current;if(!node)return;const city=cities[active]??cities[0];if(last.current!==active){last.current=active;phase.current=0;}phase.current=Math.min(1,phase.current+delta/.95);const lon=(city.x/800-.5)*Math.PI*2;const d=drag.current;if(!d.down&&state.clock.elapsedTime>d.pause){const target=-lon+Math.sin(state.clock.elapsedTime*.16)*.08;let diff=target-d.rotation;diff=Math.atan2(Math.sin(diff),Math.cos(diff));d.rotation+=diff*(1-Math.exp(-delta*.75));}node.rotation.y=THREE.MathUtils.damp(node.rotation.y,d.rotation,4,delta);node.rotation.x=THREE.MathUtils.damp(node.rotation.x,d.tilt,4,delta);if(arc.current){const v=route[Math.min(64,Math.floor(phase.current*64))];if(v)arc.current.position.copy(v);}if(ping.current)ping.current.scale.setScalar(1+Math.sin(state.clock.elapsedTime*4)*.25);});
 return <group ref={group} onPointerDown={e=>{e.stopPropagation();drag.current.down=true;drag.current.x=e.clientX;drag.current.y=e.clientY;(e.target as unknown as {setPointerCapture:(id:number)=>void}).setPointerCapture(e.pointerId);}} onPointerMove={e=>{const d=drag.current;if(!d.down)return;d.rotation+=(e.clientX-d.x)*.008;d.tilt=THREE.MathUtils.clamp(d.tilt+(e.clientY-d.y)*.004,-.6,.6);d.x=e.clientX;d.y=e.clientY;}} onPointerUp={()=>{drag.current.down=false;drag.current.pause=elapsed.current+8;}}>
 <mesh><sphereGeometry args={[2,32,24]}/><meshBasicMaterial color={palette.sphere} transparent opacity={palette.sphereOpacity}/></mesh>
 <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[points,3]}/></bufferGeometry><pointsMaterial color={palette.dots} size={.026} sizeAttenuation transparent opacity={palette.dotOpacity}/></points>
 {grid.map((p,i)=><Line key={i} points={p} color={palette.dots} transparent opacity={palette.gridOpacity} lineWidth={.5}/>)}
 {cities.map((c,i)=><mesh key={c.code} position={point(c.x,c.y,2.035)}><sphereGeometry args={[i===active?.048:.03,10,8]}/><meshBasicMaterial color={palette.marker}/></mesh>)}
 <Line points={route} color={palette.dots} transparent opacity={.7} lineWidth={1.2}/><mesh ref={arc}><sphereGeometry args={[.045,10,8]}/><meshBasicMaterial color={palette.marker}/></mesh><mesh ref={ping} position={point((cities[active]??cities[0]).x,(cities[active]??cities[0]).y,2.035)}><sphereGeometry args={[.095,12,8]}/><meshBasicMaterial color={palette.dots} transparent opacity={.3}/></mesh>
 </group>;
}
export default function GlobalGlobeScene(props:{active:number;playing:boolean}){return <SceneCanvas frameloop={props.playing ? "always" : "demand"} camera={{position:[0,0,5.5],fov:48}} style={{touchAction:"none"}}><Globe {...props}/></SceneCanvas>;}