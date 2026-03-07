import { useEffect, useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../stores/useStore'

// Only the center computer
const centerMeshNames = new Set([
  'MacUnit_Mac_0',
  'MacUnit_MacMetal_0',
  'Screen_Center',
  'PortCover_Mac_0',
])

function isCenterComputer(name: string) {
  return centerMeshNames.has(name)
}

// Aurora shader for center screen
const auroraFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  // Simplex-style noise helpers
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289((x * 34.0 + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289v2(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.12;

    // Center-relative coords for radial effects
    vec2 center = uv - 0.5;
    float dist = length(center);
    float angle = atan(center.y, center.x);

    // Layered noise
    float n1 = snoise(uv * 2.5 + vec2(t, t * 0.7));
    float n2 = snoise(uv * 4.0 + vec2(-t * 0.8, t * 0.5));
    float n3 = snoise(uv * 1.8 + vec2(t * 0.3, -t * 0.6));

    // Dark iridescent base
    vec3 color = vec3(0.18, 0.15, 0.25);

    // Holographic color palette (muted)
    vec3 pink     = vec3(0.7, 0.35, 0.5);
    vec3 mint     = vec3(0.3, 0.65, 0.6);
    vec3 lavender = vec3(0.5, 0.4, 0.75);
    vec3 gold     = vec3(0.7, 0.6, 0.35);
    vec3 cyan     = vec3(0.3, 0.55, 0.75);

    // Blend colors softly
    color = mix(color, pink, smoothstep(-0.2, 0.5, n1) * 0.35);
    color = mix(color, mint, smoothstep(-0.1, 0.6, n2) * 0.3);
    color = mix(color, lavender, smoothstep(-0.3, 0.4, n3) * 0.4);
    color = mix(color, gold, smoothstep(0.1, 0.7, n1 + n2) * 0.2);
    color = mix(color, cyan, smoothstep(-0.2, 0.3, n3 + n1) * 0.25);

    // Radial light rays from center
    float rays = snoise(vec2(angle * 3.0, dist * 4.0 - t * 2.0));
    rays = pow(max(rays, 0.0), 2.0);
    float rayFade = smoothstep(0.6, 0.0, dist);
    color += rays * rayFade * vec3(0.5, 0.45, 0.6) * 0.5;

    // Center bloom glow
    float bloom = exp(-dist * 3.5);
    vec3 bloomColor = mix(vec3(0.6, 0.5, 0.7), vec3(0.8, 0.7, 0.85), n1 * 0.5 + 0.5);
    color += bloom * bloomColor * 0.5;

    // Prismatic sparkles
    float sparkle = snoise(uv * 25.0 + vec2(t * 4.0, t * 3.0));
    sparkle = pow(max(sparkle, 0.0), 15.0);
    // Rainbow tint per sparkle
    vec3 sparkleColor = vec3(
      0.5 + 0.5 * sin(angle * 2.0 + t * 5.0),
      0.5 + 0.5 * sin(angle * 2.0 + t * 5.0 + 2.094),
      0.5 + 0.5 * sin(angle * 2.0 + t * 5.0 + 4.189)
    );
    color += sparkle * sparkleColor * 0.7;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Static noise shader for off-screens
const staticVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const staticFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;

    // --- Horizontal block glitch displacement ---
    float rowId = floor(uv.y * 40.0);
    float glitchTrigger = step(0.92, random(vec2(rowId, floor(t * 3.0))));
    float shiftAmount = (random(vec2(rowId + 100.0, floor(t * 4.0))) - 0.5) * 0.3;
    uv.x += glitchTrigger * shiftAmount;

    // Blocky noise: quantize UVs for scanline-like blocks
    vec2 blockUv = floor(uv * vec2(80.0, 60.0));
    float noise = random(blockUv + floor(t * 12.0));

    // Horizontal scanline flicker
    float scanline = step(0.98, random(vec2(floor(uv.y * 40.0), floor(t * 8.0))));
    noise = mix(noise, 1.0, scanline * 0.6);

    // Dark base with cold blue-gray CRT tint
    vec3 color = mix(
      vec3(0.01, 0.01, 0.03),
      vec3(0.15, 0.18, 0.25),
      noise * 0.5
    );

    // Occasional bright flash band
    float band = smoothstep(0.0, 0.02, abs(uv.y - fract(t * 0.4)));
    color += (1.0 - band) * vec3(0.08, 0.10, 0.14);

    // --- Random colorful flash streaks ---
    float flashRow = floor(uv.y * 100.0);
    float flash = step(0.96, random(vec2(flashRow, floor(t * 4.5))));
    vec3 flashColor = vec3(
      random(vec2(flashRow, 1.0)),
      random(vec2(flashRow, 2.0)),
      random(vec2(flashRow, 3.0))
    );
    color += flash * flashColor * 0.5;

    // --- Fine white/blue static noise ---
    vec2 noiseUv = floor(uv * vec2(300.0, 200.0));
    float fineNoise = random(noiseUv + floor(t * 15.0));
    fineNoise = pow(fineNoise, 8.0); // mostly dark, occasional bright speckle
    color += fineNoise * vec3(0.3, 0.35, 0.5);

    gl_FragColor = vec4(color, 1.0);
  }
`

function isPlantNode(name: string) {
  return (
    name.startsWith('leafplanes_') ||
    name.startsWith('Grass') ||
    name.startsWith('DIvy_') ||
    name.startsWith('Vine') ||
    name.startsWith('Ivy') ||
    name.startsWith('SnailIvy') ||
    name.startsWith('DevilsIvy') ||
    name.startsWith('PinkTree') ||
    name.startsWith('Treesmall') ||
    name.startsWith('Treemedium') ||
    name.startsWith('Chinese_Trumpet') ||
    name.includes('leaf') ||
    name.includes('Monstera')
  )
}

export default function GlowingComputer() {
  const { scene } = useGLTF('/ardensgarden.glb')
  const setScene = useStore((s) => s.setScene)
  const materialsRef = useRef<THREE.ShaderMaterial[]>([])
  const plantNodesRef = useRef<{ node: THREE.Object3D; seed: number; origX: number; origZ: number }[]>([])

  const staticUniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), [])

  // Hide glass sphere + apply static shader to non-center screens + collect plant nodes
  useEffect(() => {
    const origMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>()
    const plants: { node: THREE.Object3D; seed: number; origX: number; origZ: number }[] = []

    scene.traverse((child) => {
      if (child.name === 'GlassSphere' || child.name === 'Sphere.052') {
        child.visible = false
      }

      if (isPlantNode(child.name)) {
        plants.push({ node: child, seed: Math.random() * Math.PI * 2, origX: child.rotation.x, origZ: child.rotation.z })
      }

      // Aurora shader on center screen
      if (
        child instanceof THREE.Mesh &&
        child.name === 'Screen_Center'
      ) {
        origMaterials.set(child, child.material)
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uTime: staticUniforms.uTime,
          },
          vertexShader: staticVertexShader,
          fragmentShader: auroraFragmentShader,
        })
        child.material = mat
        materialsRef.current.push(mat)
      }

      // Match non-center screen meshes (Screen_3, Screen_4, ..., Screen_Extra_1, etc.)
      if (
        child instanceof THREE.Mesh &&
        child.name.startsWith('Screen_') &&
        child.name !== 'Screen_Center'
      ) {
        origMaterials.set(child, child.material)
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uTime: staticUniforms.uTime,
          },
          vertexShader: staticVertexShader,
          fragmentShader: staticFragmentShader,
        })
        child.material = mat
        materialsRef.current.push(mat)
      }
    })

    plantNodesRef.current = plants

    return () => {
      scene.traverse((child) => {
        if (child.name === 'GlassSphere' || child.name === 'Sphere.052') {
          child.visible = true
        }
      })
      origMaterials.forEach((mat, mesh) => {
        mesh.material = mat
      })
      materialsRef.current.forEach((m) => m.dispose())
      materialsRef.current = []
      plantNodesRef.current = []
    }
  }, [scene, staticUniforms])

  useFrame((_state, delta) => {
    staticUniforms.uTime.value += delta
    const t = staticUniforms.uTime.value
    for (const { node, seed, origX, origZ } of plantNodesRef.current) {
      node.rotation.z = origZ + Math.sin(t * 0.8 + seed) * 0.015
      node.rotation.x = origX + Math.sin(t * 0.6 + seed + 1.0) * 0.01
    }
  })

  const handleClick = (e: { object: THREE.Object3D; stopPropagation: () => void }) => {
    let obj: THREE.Object3D | null = e.object
    while (obj) {
      if (isCenterComputer(obj.name)) {
        e.stopPropagation()
        setScene('PC_SCREEN')
        return
      }
      obj = obj.parent
    }
  }

  return (
    <group onClick={handleClick}>
      <primitive object={scene} />
    </group>
  )
}
