/**
 * 3D Interactive MRI Brain & Bioluminescent Neural Filament Engine
 * Pure GPU shared-uniform architecture (zero per-frame material loops, zero particle teleportation)
 */

import * as THREE from 'https://esm.sh/three@0.162.0';
import { OrbitControls } from 'https://esm.sh/three@0.162.0/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://esm.sh/three@0.162.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.162.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three@0.162.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EMOTIONS } from '../data/emotions.js';
import { BRAIN_PATHS } from '../data/brainCurves.js';

// ============================================================================
// 1. DARK REFRACTIVE MRI CORTICAL SHELL SHADER (TESSARAKT SIMPLEX NOISE)
// ============================================================================

const CORTEX_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vLocalPos;

  vec3 safeNormalize(vec3 v) {
    float len = length(v);
    return len > 0.00001 ? v / len : vec3(0.0, 1.0, 0.0);
  }

  void main() {
    vLocalPos = position;
    vNormal = safeNormalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const CORTEX_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uZoomFade;
  uniform vec3 uBaseColor;
  uniform vec3 uEmotionColor;
  uniform vec3 uLocus1;
  uniform vec3 uLocus2;
  uniform vec3 uLocus3;
  uniform vec3 uLocusRadii;
  uniform float uHighlightStrength;
  uniform vec3 uHoverColor;
  uniform vec3 uHoverLocus1;
  uniform vec3 uHoverLocus2;
  uniform vec3 uHoverLocus3;
  uniform vec3 uHoverRadii;
  uniform float uHoverStrength;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vLocalPos;

  vec3 safeNormalize(vec3 v) {
    float len = length(v);
    return len > 0.00001 ? v / len : vec3(0.0, 0.0, 1.0);
  }

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 normal = safeNormalize(vNormal);
    vec3 viewDir = safeNormalize(vViewPosition);

    float ndotv = clamp(abs(dot(normal, viewDir)), 0.0, 0.9999);
    float fresnel = pow(clamp(1.0 - ndotv, 0.0001, 1.0), 3.2);

    float n1 = snoise(vLocalPos * 2.8 + vec3(0.0, 0.0, uTime * 0.18));
    float noiseField = smoothstep(-0.2, 0.75, n1);

    float d1 = length(vLocalPos - uLocus1) / max(0.05, uLocusRadii.x);
    float d2 = length(vLocalPos - uLocus2) / max(0.05, uLocusRadii.y);
    float d3 = length(vLocalPos - uLocus3) / max(0.05, uLocusRadii.z);
    float minDist = min(d1, min(d2, d3));

    float regionMask = smoothstep(1.25, 0.15, minDist) * uHighlightStrength;
    float pulse = 0.65 + 0.35 * sin(uTime * 2.8 - minDist * 5.0);
    float regionGlow = regionMask * pulse;

    float hd1 = length(vLocalPos - uHoverLocus1) / max(0.05, uHoverRadii.x);
    float hd2 = length(vLocalPos - uHoverLocus2) / max(0.05, uHoverRadii.y);
    float hd3 = length(vLocalPos - uHoverLocus3) / max(0.05, uHoverRadii.z);
    float hMinDist = min(hd1, min(hd2, hd3));
    float hoverGlow = smoothstep(1.2, 0.15, hMinDist) * uHoverStrength;

    // Cool silver-pearl cortical glass on non-highlighted brain; vivid jewel pigment on highlighted region
    vec3 silverRim = vec3(0.68, 0.74, 0.82);
    vec3 glassRim = mix(vec3(0.88, 0.91, 0.95), silverRim, fresnel * 0.85);
    vec3 finalColor = mix(glassRim, uEmotionColor * 0.9, clamp(regionGlow * 1.15, 0.0, 1.0));
    finalColor = mix(finalColor, uHoverColor * 0.9, clamp(hoverGlow * 1.15, 0.0, 1.0));

    float alpha = (fresnel * 0.16 + noiseField * 0.02 + regionGlow * 0.30 + hoverGlow * 0.34) * uZoomFade;
    gl_FragColor = vec4(clamp(finalColor, vec3(0.0), vec3(1.0)), clamp(alpha, 0.0, 0.56));
  }
`;

// ============================================================================
// 2. BIOLUMINESCENT MRI CORTICAL FILAMENT SHADER (WITH 3D CURSOR RIPPLE)
// ============================================================================

const FILAMENT_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vLocalPos;
  varying float vProgress;
  varying float vCursorGlow;

  uniform float uTime;
  uniform float uSpeed;
  uniform float uPhase;
  uniform vec3 uMouse3D;

  void main() {
    vUv = uv;
    vec3 p = position;

    // Traveling action-potential wave along the cortical curve
    vProgress = smoothstep(-1.0, 1.0, sin(vUv.x * 10.0 - uTime * uSpeed + uPhase * 6.2831));

    // Gentle 3D magnetic ripple when the cursor passes near a neural tract
    float maxDist = 0.38;
    float dist = length(uMouse3D - p);
    vCursorGlow = 0.0;
    if (dist < maxDist && dist > 0.0001) {
      vec3 dir = (p - uMouse3D) / dist;
      float push = (1.0 - dist / maxDist);
      push *= push;
      p += dir * push * 0.045;
      vCursorGlow = push;
    }

    vLocalPos = p;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FILAMENT_FRAGMENT_SHADER = `
  varying vec2 vUv;
  varying vec3 vLocalPos;
  varying float vProgress;
  varying float vCursorGlow;

  uniform vec3 uBaseColor;
  uniform vec3 uEmotionColor;
  uniform vec3 uLocus1;
  uniform vec3 uLocus2;
  uniform vec3 uLocus3;
  uniform vec3 uLocusRadii;
  uniform float uHighlightStrength;
  uniform float uIsolateRegion;
  uniform float uOpacityScale;
  uniform vec3 uHoverColor;
  uniform vec3 uHoverLocus1;
  uniform vec3 uHoverLocus2;
  uniform vec3 uHoverLocus3;
  uniform vec3 uHoverRadii;
  uniform float uHoverStrength;

  void main() {
    // Smooth tapered ends on every cortical filament
    float tipFade = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);

    // Anatomical proximity to active emotional brain loci
    float d1 = length(vLocalPos - uLocus1) / max(0.05, uLocusRadii.x);
    float d2 = length(vLocalPos - uLocus2) / max(0.05, uLocusRadii.y);
    float d3 = length(vLocalPos - uLocus3) / max(0.05, uLocusRadii.z);
    float minDist = min(d1, min(d2, d3));
    float regionMask = smoothstep(1.25, 0.15, minDist) * uHighlightStrength;

    // Anatomical proximity to hovered emotional brain loci
    float hd1 = length(vLocalPos - uHoverLocus1) / max(0.05, uHoverRadii.x);
    float hd2 = length(vLocalPos - uHoverLocus2) / max(0.05, uHoverRadii.y);
    float hd3 = length(vLocalPos - uHoverLocus3) / max(0.05, uHoverRadii.z);
    float hMinDist = min(hd1, min(hd2, hd3));
    float hoverMask = smoothstep(1.2, 0.15, hMinDist) * uHoverStrength;

    // Smoothly isolate the traveling wave to the active or hovered region
    float isolateFactor = clamp(max(uIsolateRegion, uHoverStrength * 1.35), 0.0, 1.0);
    float activeOrHoverMask = max(regionMask, hoverMask);
    float focusMask = smoothstep(0.05, 0.55, activeOrHoverMask);
    float flowMask = mix(1.0, focusMask, isolateFactor);
    float wave = mix(0.2, vProgress, flowMask);

    // Non-highlighted brain neurons turn cool neutral silver-grey so highlighted emotion neurons pop dramatically
    vec3 inactiveSilver = vec3(0.60, 0.66, 0.74);
    vec3 wholeBrainGradient = mix(uBaseColor, uEmotionColor, 0.35 + 0.65 * vUv.x);
    vec3 restTint = mix(wholeBrainGradient, inactiveSilver, isolateFactor);

    vec3 activeTint = mix(restTint, uEmotionColor, clamp(smoothstep(0.04, 0.52, regionMask) * 1.15, 0.0, 1.0));
    activeTint = mix(activeTint, uHoverColor, clamp(smoothstep(0.04, 0.52, hoverMask) * 1.15, 0.0, 1.0));
    activeTint = mix(activeTint, uEmotionColor, clamp(vCursorGlow * 0.35, 0.0, 1.0));

    // Deepen highlighted wave peaks for vivid jewel contrast against silver-grey inactive tracts
    vec3 waveColor = mix(activeTint, activeTint * 0.72, wave * focusMask * 0.65);

    float inactiveAlpha = mix(0.34, 0.11, isolateFactor);
    float activeBoost = focusMask * 0.72 + wave * 0.35 * flowMask + vCursorGlow * 0.28;
    float alpha = tipFade * (inactiveAlpha + activeBoost) * uOpacityScale;
    gl_FragColor = vec4(clamp(waveColor, vec3(0.0), vec3(1.0)), clamp(alpha, 0.0, 0.96));
  }
`;

// ============================================================================
// 3. FLOWING SYNAPTIC IMPULSE PARTICLE SHADER (BRAIN PARTICLES)
// ============================================================================

const IMPULSE_VERTEX_SHADER = `
  attribute float aRandom;
  varying float vRegionMask;
  varying float vHoverMask;
  varying float vCursorFocus;

  uniform vec3 uLocus1;
  uniform vec3 uLocus2;
  uniform vec3 uLocus3;
  uniform vec3 uLocusRadii;
  uniform float uHighlightStrength;
  uniform vec3 uHoverLocus1;
  uniform vec3 uHoverLocus2;
  uniform vec3 uHoverLocus3;
  uniform vec3 uHoverRadii;
  uniform float uHoverStrength;
  uniform vec3 uMouse3D;

  void main() {
    float d1 = length(position - uLocus1) / max(0.05, uLocusRadii.x);
    float d2 = length(position - uLocus2) / max(0.05, uLocusRadii.y);
    float d3 = length(position - uLocus3) / max(0.05, uLocusRadii.z);
    float minDist = min(d1, min(d2, d3));
    vRegionMask = smoothstep(1.25, 0.15, minDist) * uHighlightStrength;

    float hd1 = length(position - uHoverLocus1) / max(0.05, uHoverRadii.x);
    float hd2 = length(position - uHoverLocus2) / max(0.05, uHoverRadii.y);
    float hd3 = length(position - uHoverLocus3) / max(0.05, uHoverRadii.z);
    float hMinDist = min(hd1, min(hd2, hd3));
    vHoverMask = smoothstep(1.2, 0.15, hMinDist) * uHoverStrength;

    // Slight local focus on individual cells near the 3D cursor
    float cursorDist = length(uMouse3D - position);
    vCursorFocus = smoothstep(0.42, 0.02, cursorDist);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float sizeBoost = 0.85 + max(vRegionMask, vHoverMask) * 1.45 + vCursorFocus * 0.5;
    gl_PointSize = clamp(aRandom * 18.0 * sizeBoost * (1.0 / max(0.25, -mvPosition.z)), 1.5, 25.0);
  }
`;

const IMPULSE_FRAGMENT_SHADER = `
  varying float vRegionMask;
  varying float vHoverMask;
  varying float vCursorFocus;

  uniform vec3 uBaseColor;
  uniform vec3 uEmotionColor;
  uniform vec3 uHoverColor;
  uniform float uIsolateRegion;
  uniform float uHoverStrength;

  void main() {
    float dist = length(gl_PointCoord.xy - vec2(0.5));
    if (dist > 0.5) discard;

    float core = smoothstep(0.5, 0.08, dist);
    float isolateFactor = clamp(max(uIsolateRegion, uHoverStrength * 1.35), 0.0, 1.0);

    // Non-highlighted cells become cool muted slate-silver; highlighted cells glow with pure emotion pigment
    vec3 restingBase = mix(uBaseColor, vec3(0.20, 0.28, 0.42), 0.35);
    vec3 inactiveSilver = vec3(0.58, 0.64, 0.72);
    vec3 baseTint = mix(restingBase, inactiveSilver, isolateFactor);

    vec3 activeTint = uEmotionColor * 0.85;
    vec3 hoverTint = uHoverColor * 0.85;

    float rFocus = smoothstep(0.04, 0.5, vRegionMask);
    float hFocus = smoothstep(0.04, 0.5, vHoverMask);

    vec3 color = mix(baseTint, activeTint, clamp(rFocus * 1.2 + vCursorFocus * 0.45, 0.0, 1.0));
    color = mix(color, hoverTint, clamp(hFocus * 1.2, 0.0, 1.0));

    float combinedFocus = max(rFocus, hFocus);
    float flowAlpha = mix(0.48 + combinedFocus * 0.42 + vCursorFocus * 0.3, 0.06 + combinedFocus * 0.90 + vCursorFocus * 0.35, isolateFactor);
    float alpha = core * flowAlpha;
    gl_FragColor = vec4(clamp(color, vec3(0.0), vec3(1.0)), clamp(alpha, 0.0, 0.96));
  }
`;

const LUT_STEPS = 100;

export class Brain3DEngine {
  constructor(containerId, callbacks = {}) {
    this.container = document.getElementById(containerId);
    this.callbacks = callbacks;

    this.currentEmotion = EMOTIONS[0];
    this.hoveredEmotion = null;
    this.firingSpeedMultiplier = 1.0;

    this.curves = [];
    this.curveLUTs = [];
    this.filamentMaterials = [];
    this.impulseTravelers = [];
    this.scanVertices = [];

    this.targetBrainRotY = -0.35;
    this.targetCamPos = null;
    this.tempDirVec = new THREE.Vector3();
    this.targetHoverStrength = 0.0;
    this.targetHoverColor = new THREE.Color('#FF2A85');
    this.isPointerDown = false;
    this.pointerDownPos = new THREE.Vector2();
    this.tempLocusWorld = new THREE.Vector3();

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointerNDC = new THREE.Vector2(99, 99);
    this.mouse3D = new THREE.Vector3(99, 99, 99);
    this.targetMouse3D = new THREE.Vector3(99, 99, 99);
    this.interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.tempVec = new THREE.Vector3();

    if (this.container) {
      this.init();
    }
  }

  init() {
    const rect = this.container.getBoundingClientRect();
    this.containerLeft = rect.left + window.scrollX;
    this.containerTop = rect.top + window.scrollY;
    this.containerWidth = rect.width || window.innerWidth;
    this.containerHeight = rect.height || window.innerHeight;
    const width = this.containerWidth;
    const height = this.containerHeight;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xf8fafc, 0.045);

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.03, 100);
    this.camera.position.set(0.0, 0.35, 3.65);

    // 2. WebGL Renderer
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    this.renderer.setClearColor(0xf8fafc, 0);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(dpr);
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.domElement.style.touchAction = 'pan-y';
    this.container.appendChild(this.renderer.domElement);

    // 3. Post-Processing Bloom with NaN-safe HalfFloat RenderTarget
    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      colorSpace: THREE.SRGBColorSpace
    });
    this.composer = new EffectComposer(this.renderer, renderTarget);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(Math.floor(width * 0.5), Math.floor(height * 0.5)),
      0.88,
      0.52,
      0.22
    );
    this.composer.addPass(this.bloomPass);

    // 4. OrbitControls — Seamless 360° User-Controlled Orbit (Scroll Allowed for Webpage)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.75;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.target.set(0, 0.04, 0);

    // 5. Root Brain Group (Compact scale centered cleanly in right column)
    this.brainGroup = new THREE.Group();
    this.brainGroup.position.set(0, 0.02, 0);
    this.brainGroup.scale.setScalar(width < 768 ? 0.78 : 0.68);
    this.brainGroup.rotation.y = this.targetBrainRotY;
    this.scene.add(this.brainGroup);

    // Shared Shader Uniforms for Emotion & Region Highlighting
    this.sharedUniforms = {
      uTime: { value: 0 },
      uZoomFade: { value: 1.0 },
      uBaseColor: { value: new THREE.Color('#4f46e5') },
      uEmotionColor: { value: new THREE.Color('#0284c7') },
      uLocus1: { value: new THREE.Vector3(-0.35, 0.48, 0.95) },
      uLocus2: { value: new THREE.Vector3(0.35, 0.48, 0.95) },
      uLocus3: { value: new THREE.Vector3(0.0, 0.52, -0.78) },
      uLocusRadii: { value: new THREE.Vector3(0.85, 0.85, 0.9) },
      uHighlightStrength: { value: 0.55 },
      uIsolateRegion: { value: 0.0 },
      uHoverColor: { value: new THREE.Color('#e11d48') },
      uHoverLocus1: { value: new THREE.Vector3(0, 0, 0) },
      uHoverLocus2: { value: new THREE.Vector3(0, 0, 0) },
      uHoverLocus3: { value: new THREE.Vector3(0, 0, 0) },
      uHoverRadii: { value: new THREE.Vector3(0.65, 0.65, 0.65) },
      uHoverStrength: { value: 0.0 },
      uMouse3D: { value: this.mouse3D }
    };

    // 6. Build Real 3D MRI Cortical Pathways, Shrink-Wrapped MRI Hull & Flowing Synaptic Impulses
    this.buildMRICorticalFilaments();
    this.buildMRIShrinkWrappedHull();
    this.buildFlowingSynapticImpulses();
    this.buildCorticalScanPointCloud();

    // 7. Apply Initial Emotion State
    this.selectEmotion(this.currentEmotion.id, false);

    // 8. Event Listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('pointermove', (e) => this.onPointerMove(e), { passive: true });
    this.renderer.domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e), { passive: true });
    window.addEventListener('pointerup', (e) => this.onPointerUp(e), { passive: true });

    // 9. Start Render Loop
    this.animate();
  }

  buildMRICorticalFilaments() {
    this.filamentGroup = new THREE.Group();
    this.brainGroup.add(this.filamentGroup);

    BRAIN_PATHS.forEach((flatCoords) => {
      const pts = [];
      for (let i = 0; i < flatCoords.length - 2; i += 3) {
        const v = new THREE.Vector3(flatCoords[i], flatCoords[i + 1], flatCoords[i + 2]);
        pts.push(v);
        this.scanVertices.push(v);
      }
      if (pts.length >= 3) {
        const curve = new THREE.CatmullRomCurve3(pts);
        this.curves.push({ curve, isPrimary: true });
      }
    });

    const step = Math.max(1, Math.floor(this.scanVertices.length / 100));
    for (let i = 0; i < this.scanVertices.length; i += step) {
      const vA = this.scanVertices[i];
      let bestV = null;
      let bestDist = 999;

      for (let j = (i + 17) % this.scanVertices.length, count = 0; count < 75; j = (j + 13) % this.scanVertices.length, count++) {
        const vB = this.scanVertices[j];
        const d = vA.distanceTo(vB);
        if (d > 0.24 && d < 0.72 && d < bestDist) {
          bestDist = d;
          bestV = vB;
        }
      }

      if (bestV) {
        const mid1 = new THREE.Vector3().lerpVectors(vA, bestV, 0.33).multiplyScalar(0.86);
        const mid2 = new THREE.Vector3().lerpVectors(vA, bestV, 0.67).multiplyScalar(0.86);
        const subCurve = new THREE.CatmullRomCurve3([vA.clone(), mid1, mid2, bestV.clone()]);
        this.curves.push({ curve: subCurve, isPrimary: false });
      }
    }

    const samplePt = new THREE.Vector3();
    this.curves.forEach(({ curve }) => {
      const lut = new Float32Array((LUT_STEPS + 1) * 3);
      for (let s = 0; s <= LUT_STEPS; s++) {
        curve.getPoint(s / LUT_STEPS, samplePt);
        lut[s * 3] = samplePt.x;
        lut[s * 3 + 1] = samplePt.y;
        lut[s * 3 + 2] = samplePt.z;
      }
      this.curveLUTs.push(lut);
    });

    this.curves.forEach(({ curve, isPrimary }, idx) => {
      const segments = isPrimary ? 56 : 24;
      const radius = isPrimary ? 0.0042 : 0.0024;
      const tubeGeo = new THREE.TubeGeometry(curve, segments, radius, 4, false);

      const mat = new THREE.ShaderMaterial({
        vertexShader: FILAMENT_VERTEX_SHADER,
        fragmentShader: FILAMENT_FRAGMENT_SHADER,
        uniforms: {
          uTime: this.sharedUniforms.uTime,
          uSpeed: { value: (isPrimary ? 2.2 : 1.6) + (idx % 7) * 0.18 },
          uPhase: { value: (idx * 0.137) % 1.0 },
          uMouse3D: this.sharedUniforms.uMouse3D,
          uBaseColor: this.sharedUniforms.uBaseColor,
          uEmotionColor: this.sharedUniforms.uEmotionColor,
          uLocus1: this.sharedUniforms.uLocus1,
          uLocus2: this.sharedUniforms.uLocus2,
          uLocus3: this.sharedUniforms.uLocus3,
          uLocusRadii: this.sharedUniforms.uLocusRadii,
          uHighlightStrength: this.sharedUniforms.uHighlightStrength,
          uIsolateRegion: this.sharedUniforms.uIsolateRegion,
          uHoverColor: this.sharedUniforms.uHoverColor,
          uHoverLocus1: this.sharedUniforms.uHoverLocus1,
          uHoverLocus2: this.sharedUniforms.uHoverLocus2,
          uHoverLocus3: this.sharedUniforms.uHoverLocus3,
          uHoverRadii: this.sharedUniforms.uHoverRadii,
          uHoverStrength: this.sharedUniforms.uHoverStrength,
          uOpacityScale: { value: isPrimary ? 0.92 : 0.48 }
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending
      });

      const mesh = new THREE.Mesh(tubeGeo, mat);
      this.filamentGroup.add(mesh);
      this.filamentMaterials.push(mat);
    });
  }

  buildMRIShrinkWrappedHull() {
    this.cortexMaterial = new THREE.ShaderMaterial({
      vertexShader: CORTEX_VERTEX_SHADER,
      fragmentShader: CORTEX_FRAGMENT_SHADER,
      uniforms: {
        uTime: this.sharedUniforms.uTime,
        uZoomFade: this.sharedUniforms.uZoomFade,
        uBaseColor: this.sharedUniforms.uBaseColor,
        uEmotionColor: this.sharedUniforms.uEmotionColor,
        uLocus1: this.sharedUniforms.uLocus1,
        uLocus2: this.sharedUniforms.uLocus2,
        uLocus3: this.sharedUniforms.uLocus3,
        uLocusRadii: this.sharedUniforms.uLocusRadii,
        uHighlightStrength: this.sharedUniforms.uHighlightStrength,
        uHoverColor: this.sharedUniforms.uHoverColor,
        uHoverLocus1: this.sharedUniforms.uHoverLocus1,
        uHoverLocus2: this.sharedUniforms.uHoverLocus2,
        uHoverLocus3: this.sharedUniforms.uHoverLocus3,
        uHoverRadii: this.sharedUniforms.uHoverRadii,
        uHoverStrength: this.sharedUniforms.uHoverStrength,
        uMouse3D: this.sharedUniforms.uMouse3D
      },
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      blending: THREE.NormalBlending
    });

    const leftScan = this.scanVertices.filter((v) => v.x <= 0.04);
    const rightScan = this.scanVertices.filter((v) => v.x >= -0.04);

    const buildHemisphereHull = (isRight, targetPoints) => {
      const sign = isRight ? 1 : -1;
      const geo = new THREE.IcosahedronGeometry(1.0, 3);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      const centroid = new THREE.Vector3(sign * 0.42, 0.05, 0.0);

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const dir = v.clone().normalize();
        const probe = new THREE.Vector3(
          centroid.x + dir.x * 0.65,
          centroid.y + dir.y * 1.15,
          centroid.z + dir.z * 1.35
        );

        let sumX = 0, sumY = 0, sumZ = 0, sumW = 0;
        for (let j = 0; j < targetPoints.length; j++) {
          const sp = targetPoints[j];
          const dx = probe.x - sp.x;
          const dy = probe.y - sp.y;
          const dz = probe.z - sp.z;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < 0.48) {
            const w = 1.0 / (0.015 + d2 * d2);
            sumX += sp.x * w;
            sumY += sp.y * w;
            sumZ += sp.z * w;
            sumW += w;
          }
        }

        if (sumW > 0.0001) {
          v.set(sumX / sumW, sumY / sumW, sumZ / sumW);
          v.addScaledVector(dir, 0.028);
        } else {
          v.copy(probe).multiplyScalar(0.85);
        }

        pos.setXYZ(i, v.x, v.y, v.z);
      }

      geo.computeVertexNormals();
      return new THREE.Mesh(geo, this.cortexMaterial);
    };

    this.leftHull = buildHemisphereHull(false, leftScan);
    this.rightHull = buildHemisphereHull(true, rightScan);
    this.brainGroup.add(this.leftHull, this.rightHull);
  }

  buildFlowingSynapticImpulses() {
    const densityPerCurve = 12;
    const totalImpulses = this.curves.length * densityPerCurve;

    const positions = new Float32Array(totalImpulses * 3);
    const randoms = new Float32Array(totalImpulses);

    let ptr = 0;
    for (let i = 0; i < this.curves.length; i++) {
      const { isPrimary } = this.curves[i];
      const lut = this.curveLUTs[i];

      for (let j = 0; j < densityPerCurve; j++) {
        const startT = Math.random();
        const lutIdx = Math.floor(startT * LUT_STEPS) * 3;

        positions[ptr * 3] = lut[lutIdx];
        positions[ptr * 3 + 1] = lut[lutIdx + 1];
        positions[ptr * 3 + 2] = lut[lutIdx + 2];
        randoms[ptr] = isPrimary ? 0.45 + Math.random() * 0.65 : 0.25 + Math.random() * 0.45;

        this.impulseTravelers.push({
          lut,
          t: startT,
          baseSpeed: (0.0014 + Math.random() * 0.0026) * (isPrimary ? 1.15 : 0.85)
        });
        ptr++;
      }
    }

    this.impulseGeo = new THREE.BufferGeometry();
    this.impulseGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.impulseGeo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    this.impulseMat = new THREE.ShaderMaterial({
      vertexShader: IMPULSE_VERTEX_SHADER,
      fragmentShader: IMPULSE_FRAGMENT_SHADER,
      uniforms: {
        uBaseColor: this.sharedUniforms.uBaseColor,
        uEmotionColor: this.sharedUniforms.uEmotionColor,
        uLocus1: this.sharedUniforms.uLocus1,
        uLocus2: this.sharedUniforms.uLocus2,
        uLocus3: this.sharedUniforms.uLocus3,
        uLocusRadii: this.sharedUniforms.uLocusRadii,
        uHighlightStrength: this.sharedUniforms.uHighlightStrength,
        uIsolateRegion: this.sharedUniforms.uIsolateRegion,
        uHoverColor: this.sharedUniforms.uHoverColor,
        uHoverLocus1: this.sharedUniforms.uHoverLocus1,
        uHoverLocus2: this.sharedUniforms.uHoverLocus2,
        uHoverLocus3: this.sharedUniforms.uHoverLocus3,
        uHoverRadii: this.sharedUniforms.uHoverRadii,
        uHoverStrength: this.sharedUniforms.uHoverStrength,
        uMouse3D: this.sharedUniforms.uMouse3D
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this.impulsePoints = new THREE.Points(this.impulseGeo, this.impulseMat);
    this.brainGroup.add(this.impulsePoints);
  }

  buildCorticalScanPointCloud() {
    const count = this.scanVertices.length;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const v = this.scanVertices[i];
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const staticNodeMat = new THREE.PointsMaterial({
      color: 0x475569,
      size: 0.012,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this.scanCloudPoints = new THREE.Points(geo, staticNodeMat);
    this.brainGroup.add(this.scanCloudPoints);
  }

  selectEmotion(emotionId, animateTransition = true, rotateBrain = true) {
    const emo = EMOTIONS.find((e) => e.id === emotionId) || EMOTIONS[0];
    this.currentEmotion = emo;
    this.firingSpeedMultiplier = emo.firingSpeed;
    this.hoveredEmotion = null;
    this.targetHoverStrength = 0.0;

    const targetColor = new THREE.Color(emo.color);
    const secondaryColor = new THREE.Color(emo.secondaryColor);

    const l1 = emo.loci[0] || { x: 0, y: 0, z: 0, radius: 0.7 };
    const l2 = emo.loci[1] || l1;
    const l3 = emo.loci[2] || l1;
    const isolateVal = emo.id === 'resting' ? 0.0 : 1.0;

    if (window.gsap && animateTransition) {
      gsap.to(this.sharedUniforms.uEmotionColor.value, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.9,
        ease: 'power2.out'
      });
      gsap.to(this.sharedUniforms.uBaseColor.value, {
        r: secondaryColor.r,
        g: secondaryColor.g,
        b: secondaryColor.b,
        duration: 0.9,
        ease: 'power2.out'
      });
      gsap.to(this.sharedUniforms.uLocus1.value, { x: l1.x, y: l1.y, z: l1.z, duration: 0.85, ease: 'power2.out' });
      gsap.to(this.sharedUniforms.uLocus2.value, { x: l2.x, y: l2.y, z: l2.z, duration: 0.85, ease: 'power2.out' });
      gsap.to(this.sharedUniforms.uLocus3.value, { x: l3.x, y: l3.y, z: l3.z, duration: 0.85, ease: 'power2.out' });
      gsap.to(this.sharedUniforms.uLocusRadii.value, {
        x: l1.radius,
        y: l2.radius,
        z: l3.radius,
        duration: 0.85
      });
      gsap.to(this.sharedUniforms.uHighlightStrength, {
        value: emo.id === 'resting' ? 0.45 : 1.15,
        duration: 0.85
      });
      gsap.to(this.sharedUniforms.uIsolateRegion, {
        value: isolateVal,
        duration: 0.85,
        ease: 'power2.out'
      });
    } else {
      this.sharedUniforms.uEmotionColor.value.copy(targetColor);
      this.sharedUniforms.uBaseColor.value.copy(secondaryColor);
      this.sharedUniforms.uLocus1.value.set(l1.x, l1.y, l1.z);
      this.sharedUniforms.uLocus2.value.set(l2.x, l2.y, l2.z);
      this.sharedUniforms.uLocus3.value.set(l3.x, l3.y, l3.z);
      this.sharedUniforms.uLocusRadii.value.set(l1.radius, l2.radius, l3.radius);
      this.sharedUniforms.uIsolateRegion.value = isolateVal;
    }

    if (rotateBrain && emo.cameraMacro) {
      this.targetBrainRotY = -Math.atan2(emo.cameraMacro.x, emo.cameraMacro.z) * 0.72;
      if (animateTransition) {
        this.targetCamPos = new THREE.Vector3(0, 0.25, 3.65);
      }
    }

    if (this.callbacks.onEmotionChange) {
      this.callbacks.onEmotionChange(emo);
    }
  }

  detectEmotionAtClientXY(clientX, clientY) {
    if (!this.renderer || !this.container) return null;
    const rect = this.container.getBoundingClientRect();
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;
    this.pointerNDC.x = (relX / (rect.width || 1)) * 2 - 1;
    this.pointerNDC.y = -(relY / (rect.height || 1)) * 2 + 1;

    const insideCanvas =
      this.pointerNDC.x >= -1.0 &&
      this.pointerNDC.x <= 1.0 &&
      this.pointerNDC.y >= -1.0 &&
      this.pointerNDC.y <= 1.0;

    if (!insideCanvas) {
      this.targetMouse3D.set(99, 99, 99);
      return null;
    }

    this.interactionPlane.normal.copy(this.camera.position).normalize();
    this.raycaster.setFromCamera(this.pointerNDC, this.camera);
    if (this.raycaster.ray.intersectPlane(this.interactionPlane, this.tempVec)) {
      this.brainGroup.worldToLocal(this.tempVec);
      this.targetMouse3D.copy(this.tempVec);
    }

    let bestEmotion = null;
    let bestScore = -999;

    if (this.raycaster.ray.distanceToPoint(this.brainGroup.position) < 1.55) {
      for (let i = 1; i < EMOTIONS.length; i++) {
        const emo = EMOTIONS[i];
        const loci = emo.loci;
        for (let j = 0; j < loci.length; j++) {
          const loc = loci[j];
          this.tempLocusWorld.set(loc.x, loc.y, loc.z).applyMatrix4(this.brainGroup.matrixWorld);
          const perpDist = this.raycaster.ray.distanceToPoint(this.tempLocusWorld);
          const hitRadius = (loc.radius || 0.55) * 0.85;
          if (perpDist < hitRadius) {
            const camDist = this.camera.position.distanceTo(this.tempLocusWorld);
            const closeness = 1.0 - perpDist / hitRadius;
            const score = closeness * 1.5 - camDist * 0.28;
            if (score > bestScore) {
              bestScore = score;
              bestEmotion = emo;
            }
          }
        }
      }
    }

    return bestEmotion;
  }

  onPointerDown(e) {
    this.isPointerDown = true;
    this.targetCamPos = null;
    this.pointerDownPos.set(e.clientX, e.clientY);
    this.pointerDownEmotion = this.detectEmotionAtClientXY(e.clientX, e.clientY);
  }

  setCanonicalView(viewId) {
    this.targetBrainRotY = 0;
    switch (viewId) {
      case 'front':
        this.targetCamPos = new THREE.Vector3(0, 0.2, 3.65);
        break;
      case 'back':
        this.targetCamPos = new THREE.Vector3(0, 0.2, -3.65);
        break;
      case 'top':
        this.targetCamPos = new THREE.Vector3(0, 3.62, 0.35);
        break;
      case 'base':
        this.targetCamPos = new THREE.Vector3(0, -3.55, 0.45);
        break;
      case 'left':
        this.targetCamPos = new THREE.Vector3(-3.65, 0.2, 0);
        break;
      case 'right':
        this.targetCamPos = new THREE.Vector3(3.65, 0.2, 0);
        break;
      default:
        break;
    }
  }

  projectBrainDirection(lx, ly, lz) {
    if (!this.brainGroup || !this.camera) return { vx: lx, vy: ly, vz: lz };
    const rotY = this.brainGroup.rotation.y;
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const wx = lx * cosY + lz * sinY;
    const wy = ly;
    const wz = -lx * sinY + lz * cosY;

    this.tempDirVec.set(wx, wy, wz).transformDirection(this.camera.matrixWorldInverse);
    return {
      vx: this.tempDirVec.x,
      vy: this.tempDirVec.y,
      vz: this.tempDirVec.z
    };
  }

  onPointerUp(e) {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;

    const dx = e.clientX - this.pointerDownPos.x;
    const dy = e.clientY - this.pointerDownPos.y;
    const moveDistSq = dx * dx + dy * dy;

    // If user clicked or tapped (not dragged to orbit) on a brain region, select that emotion and stick it
    if (moveDistSq < 64) {
      const tappedEmo =
        this.pointerDownEmotion ||
        this.detectEmotionAtClientXY(e.clientX, e.clientY) ||
        this.hoveredEmotion;
      if (tappedEmo) {
        this.setHoveredEmotionPreview(null);
        this.selectEmotion(tappedEmo.id, true, false);
      }
    }
    this.pointerDownEmotion = null;
  }

  setHoveredEmotionPreview(emo) {
    if (emo === this.hoveredEmotion) return;
    this.hoveredEmotion = emo;
    if (emo) {
      this.targetHoverColor.set(emo.color);
      const hl1 = emo.loci[0] || { x: 0, y: 0, z: 0, radius: 0.65 };
      const hl2 = emo.loci[1] || hl1;
      const hl3 = emo.loci[2] || hl1;
      this.sharedUniforms.uHoverLocus1.value.set(hl1.x, hl1.y, hl1.z);
      this.sharedUniforms.uHoverLocus2.value.set(hl2.x, hl2.y, hl2.z);
      this.sharedUniforms.uHoverLocus3.value.set(hl3.x, hl3.y, hl3.z);
      this.sharedUniforms.uHoverRadii.value.set(hl1.radius, hl2.radius, hl3.radius);
      this.targetHoverStrength = 0.85;
    } else {
      this.targetHoverStrength = 0.0;
    }

    if (this.callbacks.onEmotionHover) {
      this.callbacks.onEmotionHover(emo);
    }
  }

  onPointerMove(e) {
    if (!this.renderer || this.isPointerDown || e.pointerType === 'touch') return;
    const bestEmotion = this.detectEmotionAtClientXY(e.clientX, e.clientY);
    this.setHoveredEmotionPreview(bestEmotion);
  }

  onResize() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.containerLeft = rect.left + window.scrollX;
    this.containerTop = rect.top + window.scrollY;
    this.containerWidth = rect.width || window.innerWidth;
    this.containerHeight = rect.height || window.innerHeight;
    const width = this.containerWidth;
    const height = this.containerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    if (this.brainGroup) {
      this.brainGroup.scale.setScalar(width < 768 ? 0.78 : 0.68);
    }
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
    this.bloomPass.resolution.set(Math.floor(width * 0.5), Math.floor(height * 0.5));
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsed = this.clock.getElapsedTime();
    this.sharedUniforms.uTime.value = elapsed;
    this.mouse3D.lerp(this.targetMouse3D, 0.25);

    // Smoothly interpolate hover highlight strength and color
    this.sharedUniforms.uHoverStrength.value +=
      (this.targetHoverStrength - this.sharedUniforms.uHoverStrength.value) * 0.14;
    this.sharedUniforms.uHoverColor.value.lerp(this.targetHoverColor, 0.18);

    this.brainGroup.rotation.y += (this.targetBrainRotY - this.brainGroup.rotation.y) * 0.06;

    if (this.targetCamPos) {
      this.camera.position.lerp(this.targetCamPos, 0.1);
      const len = this.camera.position.length();
      if (len > 0.01) {
        this.camera.position.multiplyScalar(3.65 / len);
      }
      if (this.camera.position.distanceTo(this.targetCamPos) < 0.04) {
        this.targetCamPos = null;
      }
    }

    const camDist = this.camera.position.distanceTo(this.controls.target);
    this.sharedUniforms.uZoomFade.value = THREE.MathUtils.smoothstep(camDist, 0.55, 2.1);

    if (this.impulseGeo) {
      const posArr = this.impulseGeo.attributes.position.array;
      const speedMult = this.firingSpeedMultiplier;
      const travelers = this.impulseTravelers;

      for (let i = 0, n = travelers.length; i < n; i++) {
        const item = travelers[i];
        let t = item.t + item.baseSpeed * speedMult;
        if (t >= 1.0) t -= 1.0;
        item.t = t;

        const exactIdx = t * LUT_STEPS;
        const idx0 = Math.floor(exactIdx);
        const frac = exactIdx - idx0;
        const lut = item.lut;
        const b0 = idx0 * 3;
        const b1 = b0 + 3;

        posArr[i * 3] = lut[b0] + (lut[b1] - lut[b0]) * frac;
        posArr[i * 3 + 1] = lut[b0 + 1] + (lut[b1 + 1] - lut[b0 + 1]) * frac;
        posArr[i * 3 + 2] = lut[b0 + 2] + (lut[b1 + 2] - lut[b0 + 2]) * frac;
      }
      this.impulseGeo.attributes.position.needsUpdate = true;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

