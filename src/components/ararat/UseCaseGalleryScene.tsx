import { Suspense, useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneCanvas } from './SceneCanvas';
import { useSceneColors, sceneColors } from './sceneColors';
import { industryPhotos, photos, productImages } from './useCaseImages';
import { GALLERY_PANEL_COUNT } from './galleryRules';
const images = [...photos, ...productImages];
const step = Math.PI * 2 / 6;
const panels = Array.from({ length: GALLERY_PANEL_COUNT }, (_, i) => {
 const industry = Math.floor(i / 4) % 6, slot = i % 4;
 const angle = industry * step + ([-.44, -.25, .27, .48][slot] ?? 0) + (i >= 24 ? .64 : 0);
  return { industry: i < 24 ? industry : -1, angle, y: ([-2.65, 1.85, -1.85, 2.7][slot] ?? 0) + (i >= 24 ? .2 : 0), distance: [6.25,7.5,8.9][i%3] ?? 7.5, width: slot % 3 ? 2.8 : 2.25, height: slot % 3 ? 1.82 : 2.65, image: i < 24 ? (industryPhotos(industry)[slot] ?? 0) : photos.length + i - 24 };
});
function roundedGeometry() {
 const shape = new THREE.Shape(), r = .045;
 shape.moveTo(-.5+r,-.5);shape.lineTo(.5-r,-.5);shape.quadraticCurveTo(.5,-.5,.5,-.5+r);shape.lineTo(.5,.5-r);shape.quadraticCurveTo(.5,.5,.5-r,.5);shape.lineTo(-.5+r,.5);shape.quadraticCurveTo(-.5,.5,-.5,.5-r);shape.lineTo(-.5,-.5+r);shape.quadraticCurveTo(-.5,-.5,-.5+r,-.5);
 const geometry = new THREE.ShapeGeometry(shape,4), position = geometry.getAttribute('position'), uv = geometry.getAttribute('uv');
 for(let i=0;i<uv.count;i++) uv.setXY(i,position.getX(i)+.5,position.getY(i)+.5);
 return geometry;
}
export type GalleryProps = {active:number; reducedMotion:boolean; pointer:RefObject<{x:number;y:number}>; scroll:RefObject<number>; onPick:(i:number)=>void; onHover:(i:number|null)=>void; onReady:()=>void};
function Gallery({active,reducedMotion,pointer,scroll,onPick,onHover,onReady}:GalleryProps) {
 const colors=useSceneColors(), group=useRef<THREE.Group>(null), hovered=useRef(-1), elapsed=useRef(0), reported=useRef(false);
 const sweep=useRef({active,from:active*step,to:active*step,time:1.2,angle:active*step,direction:1});
 const input=useRef({x:0,y:0});
 const textures=useLoader(THREE.TextureLoader,images), geometry=useMemo(roundedGeometry,[]);
 useEffect(()=>{textures.forEach(t=>{const image=t.image;if(image.width>1024){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=Math.round(image.height*1024/image.width);const ctx=canvas.getContext('2d');if(ctx){ctx.drawImage(image,0,0,canvas.width,canvas.height);(t as THREE.Texture<HTMLImageElement|HTMLCanvasElement>).image=canvas;}}t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=2;t.needsUpdate=true;});},[textures]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 useFrame(({camera},raw)=>{
  const dt=Math.min(raw,.05);elapsed.current+=dt;
  if(!reported.current&&elapsed.current>dt){reported.current=true;onReady();}
  const s=sweep.current;
  if(s.active!==active){const delta=Math.atan2(Math.sin(active*step-s.angle),Math.cos(active*step-s.angle));s.active=active;s.from=s.angle;s.to=s.angle+delta;s.time=0;s.direction=Math.sign(delta)||1;}
  s.time=Math.min(1.2,s.time+dt);const progress=reducedMotion?1:s.time/1.2;
  const eased=progress*progress*progress*(progress*(progress*6-15)+10);
  s.angle=THREE.MathUtils.lerp(s.from,s.to,eased);
  const pulse=reducedMotion?0:Math.sin(progress*Math.PI)**2;
  input.current.x=THREE.MathUtils.damp(input.current.x,reducedMotion?0:pointer.current.x,4.5,dt);
  input.current.y=THREE.MathUtils.damp(input.current.y,reducedMotion?0:pointer.current.y,4.5,dt);
  if(group.current){group.current.rotation.y=s.angle+(reducedMotion?0:Math.sin(elapsed.current*.22)*.055-input.current.x*.35+scroll.current*.12);group.current.rotation.x=input.current.y*.065;
   group.current.children.forEach((panel,i)=>{const p=panels[i];if(!p)return;const depth=i%3,weight=[1,.62,.32][depth]??1;
    panel.position.x=Math.sin(p.angle)*p.distance-input.current.x*.24*weight;
    panel.position.y=p.y+(reducedMotion?0:Math.sin(elapsed.current*.65+i*1.83)*.05)-input.current.y*.14*weight;
    panel.scale.setScalar(THREE.MathUtils.damp(panel.scale.x,hovered.current===i?1.075:1,7,dt));});
  }
  camera.position.z=THREE.MathUtils.damp(camera.position.z,reducedMotion?.15:.15-scroll.current*.7-pulse*.4,5,dt);camera.rotation.set(0,0,pulse*s.direction*THREE.MathUtils.degToRad(2.5));
 });
 return <group ref={group}>{panels.map((p,i)=><group key={i} position={[Math.sin(p.angle)*p.distance,p.y,-Math.cos(p.angle)*p.distance]} rotation={[0,-p.angle,(i%2?1:-1)*.045]} onPointerOver={e=>{if(p.industry<0)return;e.stopPropagation();hovered.current=i;onHover(p.industry);}} onPointerOut={()=>{hovered.current=-1;onHover(null);}} onClick={e=>{if(p.industry<0)return;e.stopPropagation();onPick(p.industry);}}>
 <mesh geometry={geometry} scale={[p.width*1.07,p.height*1.07,1]} position-z={-.025}><meshBasicMaterial color={colors.teal} transparent opacity={.14} depthWrite={false} side={THREE.DoubleSide}/></mesh>
 <mesh geometry={geometry} scale={[p.width*1.012,p.height*1.018,1]} position-z={-.012}><meshBasicMaterial color={colors.teal} transparent opacity={.65} side={THREE.DoubleSide}/></mesh>
 <mesh geometry={geometry} scale={[p.width,p.height,1]}><meshBasicMaterial map={textures[p.image]??null} toneMapped={false} side={THREE.DoubleSide}/></mesh>
 </group>)}</group>;
}
export default function UseCaseGalleryScene(props:GalleryProps){return <SceneCanvas camera={{position:[0,0,.15],fov:68,near:.1,far:32}}><fog attach="fog" args={[sceneColors.deepBlue,7.5,17]}/><Suspense fallback={null}><Gallery {...props}/></Suspense></SceneCanvas>;}
