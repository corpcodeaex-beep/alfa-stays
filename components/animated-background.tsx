"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { simplexNoise } from "@/lib/glsl";
import { sceneInput as input } from "@/lib/scene-input";
import { useThemeColors, type ThemeColors } from "@/lib/use-theme-colors";

/* ───────────────────────── 1. Liquid gradient (full-screen shader) ───────────────────────── */

const gradientVertex = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const gradientFragment = /* glsl */ `
uniform float uTime; uniform float uScroll; uniform float uStrength;
uniform vec2 uMouse; uniform vec2 uRes;
uniform vec3 uBg; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3;
varying vec2 vUv;
${simplexNoise}
float fbm(vec3 p){ float f = 0.0; float a = 0.5; for(int i = 0; i < 2; i++){ f += a * snoise(p); p *= 2.03; a *= 0.5; } return f; }
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 p = vUv; p.x *= uRes.x / uRes.y;
  float t = uTime * 0.06;
  p += uMouse * 0.08;
  vec2 q = vec2(fbm(vec3(p * 1.1, t)), fbm(vec3(p * 1.1 + vec2(5.2, 1.3), t)));
  vec2 r = vec2(
    fbm(vec3(p * 1.3 + q * 1.7 + vec2(1.7, 9.2), t * 1.4 + uScroll * 0.2)),
    fbm(vec3(p * 1.3 + q * 1.7 + vec2(8.3, 2.8), t * 1.4 - uScroll * 0.2))
  );
  vec3 col = uBg;
  col = mix(col, uC1, smoothstep(-0.05, 0.55, r.x) * uStrength);
  col = mix(col, uC2, smoothstep(-0.05, 0.55, r.y) * uStrength * 0.85);
  col = mix(col, uC3, smoothstep(0.15, 0.8, q.x + r.y * 0.5) * uStrength * 0.6);
  float vignette = smoothstep(1.3, 0.25, length(vUv - 0.5) * 1.5);
  col = mix(uBg, col, vignette);
  col += (hash(vUv * uRes + fract(uTime)) - 0.5) * 0.025; // film grain
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

function LiquidGradient({ colors, timeScale }: { colors: ThemeColors; timeScale: number }) {
  const { size } = useThree();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: gradientVertex,
        fragmentShader: gradientFragment,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uStrength: { value: 0.4 },
          uMouse: { value: new THREE.Vector2() },
          uRes: { value: new THREE.Vector2(1, 1) },
          uBg: { value: new THREE.Color() },
          uC1: { value: new THREE.Color() },
          uC2: { value: new THREE.Color() },
          uC3: { value: new THREE.Color() },
        },
      }),
    [],
  );

  useEffect(() => {
    const u = material.uniforms;
    u.uBg.value.set(colors.background);
    u.uC1.value.set(colors.primary);
    u.uC2.value.set(colors.accent);
    u.uC3.value.set(colors.secondary);
    u.uStrength.value = colors.dark ? 0.12 : 0.28;
  }, [colors, material]);

  useFrame((_, delta) => {
    const u = material.uniforms;
    u.uTime.value += delta * timeScale;
    u.uScroll.value = input.smoothScroll;
    u.uMouse.value.copy(input.smoothMouse);
    u.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1000}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* ───────────────────────── 2. 3D particle wave field ───────────────────────── */

const waveVertex = /* glsl */ `
uniform float uTime; uniform float uScroll; uniform float uSize; uniform float uPixelRatio;
varying float vElevation; varying float vFade;
${simplexNoise}
void main(){
  vec3 p = position;
  float n = snoise(vec3(p.x * 0.16 + uTime * 0.07, p.y * 0.2 - uTime * 0.11, uTime * 0.05 + uScroll * 0.35));
  float w = sin(p.x * 0.42 + uTime * 0.55 + uScroll * 1.6) * 0.35 + cos(p.y * 0.5 - uTime * 0.4) * 0.25;
  p.z += n * (1.1 + uScroll * 0.35) + w;
  vElevation = n * 0.5 + 0.5;
  vFade = (1.0 - smoothstep(7.0, 11.0, abs(p.x))) * smoothstep(-7.0, -2.0, p.y) * (1.0 - smoothstep(4.0, 7.0, p.y));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.55 + vElevation) / -mv.z;
}
`;

const waveFragment = /* glsl */ `
uniform vec3 uC1; uniform vec3 uC2; uniform float uOpacity;
varying float vElevation; varying float vFade;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.05, d) * vFade * uOpacity;
  gl_FragColor = vec4(mix(uC1, uC2, vElevation), alpha);
  #include <colorspace_fragment>
}
`;

function ParticleWave({ colors, lite, timeScale }: { colors: ThemeColors; lite: boolean; timeScale: number }) {
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const cols = lite ? 110 : 190;
    const rows = lite ? 60 : 95;
    const positions = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        positions[i++] = (x / (cols - 1) - 0.5) * 22;
        positions[i++] = (y / (rows - 1) - 0.5) * 14;
        positions[i++] = 0;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [lite]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: waveVertex,
        fragmentShader: waveFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uSize: { value: 34 },
          uPixelRatio: { value: 1 },
          uOpacity: { value: 1 },
          uC1: { value: new THREE.Color() },
          uC2: { value: new THREE.Color() },
        },
      }),
    [],
  );

  useEffect(() => {
    const u = material.uniforms;
    u.uC1.value.set(colors.primary);
    u.uC2.value.set(colors.accent);
    u.uOpacity.value = colors.dark ? 0.45 : 0.45;
    material.blending = THREE.NormalBlending;
    material.needsUpdate = true;
  }, [colors, material]);

  useFrame((_, delta) => {
    const u = material.uniforms;
    u.uTime.value += delta * timeScale;
    u.uScroll.value = input.smoothScroll;
    u.uPixelRatio.value = gl.getPixelRatio();
  });

  return <points geometry={geometry} material={material} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -3.3, -2.5]} frustumCulled={false} renderOrder={-10} />;
}

/* ───────────────────────── Scene root ───────────────────────── */

function InputTracker() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => input.mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    const onScroll = () => (input.scroll = window.scrollY / window.innerHeight);
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  useFrame((_, delta) => {
    input.smoothMouse.x = THREE.MathUtils.damp(input.smoothMouse.x, input.mouse.x, 3, delta);
    input.smoothMouse.y = THREE.MathUtils.damp(input.smoothMouse.y, input.mouse.y, 3, delta);
    input.smoothScroll = THREE.MathUtils.damp(input.smoothScroll, input.scroll, 5, delta);
  });
  return null;
}

export default function AnimatedBackground({ lite, reducedMotion }: { lite: boolean; reducedMotion: boolean }) {
  const colors = useThemeColors();
  const timeScale = reducedMotion ? 0.15 : 1;

  return (
    <Canvas dpr={lite ? 1 : [1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: !lite, powerPreference: "high-performance" }}>
      <InputTracker />
      <LiquidGradient colors={colors} timeScale={timeScale} />
      <ParticleWave colors={colors} lite={lite} timeScale={timeScale} />
    </Canvas>
  );
}
