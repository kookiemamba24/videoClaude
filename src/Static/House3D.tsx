import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import * as THREE from "three";

// Real 3D luxury home at dusk: lit render walls, warm glazing, white metal
// hip roofs, glass balustrade, pool. Static (no frame-driven animation).

const WALL = "#e7e0d6";
const SLAB = "#f5f2ec";
const ROOF = "#f4f7fb";
const WARM = "#f6a24e";

const Box: React.FC<{
  p: [number, number, number];
  s: [number, number, number];
  color: string;
  emissive?: string;
  ei?: number;
  rough?: number;
  metal?: number;
  rot?: [number, number, number];
}> = ({ p, s, color, emissive, ei = 0, rough = 0.6, metal = 0, rot }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={color} emissive={emissive ?? "#000000"} emissiveIntensity={ei} roughness={rough} metalness={metal} />
  </mesh>
);

// Warm-lit window: glowing pane + slim dark mullions.
const Glazing: React.FC<{ p: [number, number, number]; w: number; h: number; cols: number; rotY?: number }> = ({ p, w, h, cols, rotY = 0 }) => (
  <group position={p} rotation={[0, rotY, 0]}>
    <mesh>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial color={WARM} emissive={WARM} emissiveIntensity={0.75} roughness={0.2} />
    </mesh>
    {Array.from({ length: cols + 1 }, (_, i) => (
      <mesh key={i} position={[-w / 2 + (w * i) / cols, 0, 0.01]}>
        <boxGeometry args={[0.035, h, 0.03]} />
        <meshStandardMaterial color="#3a3530" roughness={0.5} />
      </mesh>
    ))}
    <mesh position={[0, h * 0.18, 0.01]}>
      <boxGeometry args={[w, 0.03, 0.03]} />
      <meshStandardMaterial color="#3a3530" />
    </mesh>
  </group>
);

// Hip roof: a 4-sided pyramid stretched to the footprint, plus eave fascia.
const HipRoof: React.FC<{ p: [number, number, number]; w: number; d: number; h: number }> = ({ p, w, d, h }) => (
  <group position={p}>
    <mesh position={[0, h / 2, 0]} rotation={[0, Math.PI / 4, 0]} scale={[w / Math.SQRT2, 1, d / Math.SQRT2]} castShadow>
      <coneGeometry args={[1, h, 4, 1]} />
      <meshStandardMaterial color={ROOF} roughness={0.35} metalness={0.25} flatShading />
    </mesh>
    <Box p={[0, -0.04, 0]} s={[w * 1.0, 0.08, d * 1.0]} color="#dfe6ee" rough={0.4} />
  </group>
);

// Gable: triangular prism along X.
const Gable: React.FC<{ p: [number, number, number]; w: number; h: number; depth: number; glass?: boolean }> = ({ p, w, h, depth, glass }) => {
  const geo = useMemo(() => {
    const sh = new THREE.Shape();
    sh.moveTo(-w / 2, 0);
    sh.lineTo(0, h);
    sh.lineTo(w / 2, 0);
    sh.lineTo(-w / 2, 0);
    const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false });
    g.translate(0, 0, -depth / 2);
    return g;
  }, [w, h, depth]);
  const inner = useMemo(() => {
    const sh = new THREE.Shape();
    sh.moveTo(-w / 2 + 0.12, 0.05);
    sh.lineTo(0, h - 0.14);
    sh.lineTo(w / 2 - 0.12, 0.05);
    sh.lineTo(-w / 2 + 0.12, 0.05);
    return new THREE.ShapeGeometry(sh);
  }, [w, h]);
  return (
    <group position={p}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color={ROOF} roughness={0.35} metalness={0.25} />
      </mesh>
      {glass ? (
        <mesh geometry={inner} position={[0, 0, depth / 2 + 0.01]}>
          <meshStandardMaterial color={WARM} emissive={WARM} emissiveIntensity={0.75} side={THREE.DoubleSide} />
        </mesh>
      ) : null}
    </group>
  );
};

const Column: React.FC<{ p: [number, number, number]; h: number }> = ({ p, h }) => (
  <mesh position={p} castShadow>
    <cylinderGeometry args={[0.09, 0.09, h, 24]} />
    <meshStandardMaterial color={SLAB} roughness={0.5} />
  </mesh>
);

const Scene: React.FC = () => (
  <>
    {/* Dusk lighting: cool sky fill, low key light, warm interior spill */}
    <hemisphereLight args={["#9cc4ff", "#1a2a44", 0.9]} />
    <directionalLight
      position={[-6, 9, 8]}
      intensity={2.2}
      color="#fff4e6"
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}
      shadow-bias={-0.0005}
    />
    <directionalLight position={[8, 4, -6]} intensity={1.1} color="#6fa8ff" />
    <pointLight position={[-2.2, 1.2, 1.6]} intensity={6} distance={6} color={WARM} />
    <pointLight position={[0.8, 1.2, 1.8]} intensity={6} distance={6} color={WARM} />
    <pointLight position={[3.2, 0.9, 1.8]} intensity={5} distance={5} color={WARM} />

    {/* Ground: deck, lawn, pool */}
    {/* invisible ground that only catches shadows, so the house sits on the banner */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <shadowMaterial opacity={0.45} />
    </mesh>
    <Box p={[0, -0.03, 0.9]} s={[9.4, 0.06, 3.6]} color="#3a4558" rough={0.85} />
    <Box p={[-0.5, 0.005, 2.35]} s={[8.6, 0.02, 0.7]} color="#2f7b3c" rough={0.95} />
    <Box p={[0, 0.02, 3.55]} s={[9.2, 0.06, 1.5]} color="#cfd5dc" rough={0.7} />
    <mesh position={[0, 0.03, 3.55]} receiveShadow>
      <boxGeometry args={[8.6, 0.06, 1.1]} />
      <meshStandardMaterial color="#3bb7f0" emissive="#1e9be0" emissiveIntensity={0.9} roughness={0.08} metalness={0.1} />
    </mesh>
    {/* glass pool fence */}
    <mesh position={[0, 0.3, 2.78]}>
      <boxGeometry args={[9.2, 0.55, 0.02]} />
      <meshPhysicalMaterial color="#cfe8ff" transparent opacity={0.22} roughness={0.05} metalness={0} />
    </mesh>
    {Array.from({ length: 10 }, (_, i) => (
      <Box key={i} p={[-4.5 + i, 0.18, 2.78]} s={[0.04, 0.36, 0.04]} color="#c9d2dc" metal={0.8} rough={0.3} />
    ))}

    {/* ===== Left: curved two-storey pavilion ===== */}
    <group position={[-2.6, 0, 0.3]}>
      <mesh position={[0, 0.9, -0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 1.8, 48, 1, false, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color={WARM} emissive={WARM} emissiveIntensity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 2.75, -0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 1.6, 48, 1, false, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color={WARM} emissive={WARM} emissiveIntensity={0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* slabs */}
      <mesh position={[0, 1.88, -0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[1.55, 1.55, 0.16, 64, 1, false, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color={SLAB} roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.62, -0.3]} castShadow>
        <cylinderGeometry args={[1.7, 1.7, 0.16, 64, 1, false, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color={SLAB} roughness={0.5} />
      </mesh>
      {/* curved low roof */}
      <mesh position={[0, 3.86, -0.3]} castShadow>
        <cylinderGeometry args={[0.6, 1.7, 0.32, 64, 1, false, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color={ROOF} roughness={0.35} metalness={0.25} />
      </mesh>
      {/* columns around the curve */}
      {[-70, -25, 25, 70].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return (
          <group key={deg}>
            <Column p={[Math.sin(a) * 1.45, 0.92, -0.3 + Math.cos(a) * 1.45]} h={1.8} />
            <Column p={[Math.sin(a) * 1.45, 2.75, -0.3 + Math.cos(a) * 1.45]} h={1.62} />
          </group>
        );
      })}
      {/* glass balustrade on the curved balcony */}
      <mesh position={[0, 2.22, -0.3]}>
        <cylinderGeometry args={[1.52, 1.52, 0.5, 64, 1, true, -Math.PI / 2, Math.PI]} />
        <meshPhysicalMaterial color="#d8eeff" transparent opacity={0.28} roughness={0.05} side={THREE.DoubleSide} />
      </mesh>
    </group>

    {/* ===== Centre: two-storey block with full glazing + hip roof ===== */}
    <group position={[0.35, 0, -0.2]}>
      <Box p={[0, 1.75, 0]} s={[2.4, 3.5, 2]} color={WALL} rough={0.8} />
      <Glazing p={[0, 0.85, 1.01]} w={2.0} h={1.5} cols={4} />
      <Glazing p={[0, 2.65, 1.01]} w={2.0} h={1.4} cols={4} />
      <Box p={[0, 1.78, 1.1]} s={[2.6, 0.14, 0.4]} color={SLAB} />
      <HipRoof p={[0, 3.56, 0]} w={2.9} d={2.5} h={0.75} />
    </group>

    {/* ===== Right: single-storey alfresco wing with glazed gable ===== */}
    <group position={[3.25, 0, 0.1]}>
      <Box p={[0.6, 0.95, -0.2]} s={[3.4, 1.9, 2]} color={WALL} rough={0.8} />
      <Glazing p={[0.9, 0.85, 0.81]} w={2.3} h={1.5} cols={3} />
      <HipRoof p={[0.8, 1.94, -0.2]} w={3.6} d={2.4} h={0.6} />
      {/* gable pavilion projecting forward */}
      <Gable p={[-0.75, 1.9, 0.55]} w={1.6} h={0.95} depth={1.5} glass />
      <Column p={[-1.45, 0.95, 1.2]} h={1.9} />
      <Column p={[-0.05, 0.95, 1.2]} h={1.9} />
      <Box p={[-0.75, 1.92, 0.55]} s={[1.6, 0.08, 1.5]} color={SLAB} />
    </group>

    {/* Conifers behind */}
    {[
      [2.6, -2.2, 3.4],
      [4.4, -2.0, 4.0],
      [5.5, -2.6, 3.2],
    ].map(([x, z, h]) => (
      <mesh key={x} position={[x, h / 2, z]} castShadow>
        <coneGeometry args={[0.75, h, 12]} />
        <meshStandardMaterial color="#123a33" roughness={0.9} />
      </mesh>
    ))}
  </>
);

export const House3D: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <ThreeCanvas
    width={width}
    height={height}
    shadows
    gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
    camera={{ position: [2.8, 4.6, 18.5], fov: 30 }}
    onCreated={({ camera, gl }) => {
      camera.lookAt(0.6, 1.4, 1.0);
      gl.toneMappingExposure = 0.95;
    }}
  >
    <Scene />
  </ThreeCanvas>
);
