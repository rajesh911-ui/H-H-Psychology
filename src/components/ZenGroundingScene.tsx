import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Wind, Sun, Moon, Volume2, VolumeX, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface ZenGroundingSceneProps {
  onClose?: () => void;
  isHeroEmbedded?: boolean;
}

type BreathingMode = 'box' | 'relax478' | 'coherent';
type LightingMood = 'morning' | 'golden' | 'twilight';

export const ZenGroundingScene: React.FC<ZenGroundingSceneProps> = ({ isHeroEmbedded = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [breathingMode, setBreathingMode] = useState<BreathingMode>('box');
  const [lightingMood, setLightingMood] = useState<LightingMood>('morning');
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);

  // Audio synthesis ref (pure Web Audio API, zero 404s)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{ gain: GainNode; noiseSource?: AudioNode } | null>(null);

  // Scene refs to interact from UI without recreating scene
  const sceneStateRef = useRef<{
    breathingMode: BreathingMode;
    lightingMood: LightingMood;
    breathingRingMesh: THREE.Mesh | null;
    keyLight: THREE.DirectionalLight | null;
    hemiLight: THREE.HemisphereLight | null;
    fog: THREE.Fog | null;
    renderer: THREE.WebGLRenderer | null;
    camera: THREE.PerspectiveCamera | null;
    targetScale: number;
    currentScale: number;
    targetCamX: number;
    targetCamY: number;
    targetCamZ: number;
    isDragging: boolean;
    prevMouseX: number;
    prevMouseY: number;
    orbitAngle: number;
    orbitElevation: number;
  }>({
    breathingMode: 'box',
    lightingMood: 'morning',
    breathingRingMesh: null,
    keyLight: null,
    hemiLight: null,
    fog: null,
    renderer: null,
    camera: null,
    targetScale: 1.0,
    currentScale: 1.0,
    targetCamX: 0,
    targetCamY: 2.2,
    targetCamZ: 4.8,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    orbitAngle: 0.2,
    orbitElevation: 0.35,
  });

  // Keep ref synchronized
  useEffect(() => {
    sceneStateRef.current.breathingMode = breathingMode;
  }, [breathingMode]);

  useEffect(() => {
    sceneStateRef.current.lightingMood = lightingMood;
    const { keyLight, hemiLight, fog, renderer } = sceneStateRef.current;
    if (!keyLight || !hemiLight || !fog || !renderer) return;

    if (lightingMood === 'morning') {
      keyLight.color.setHex(0xFFFAF0);
      keyLight.intensity = 1.9;
      keyLight.position.set(3, 6, 4);
      hemiLight.color.setHex(0xEBF4FA);
      hemiLight.groundColor.setHex(0xDFD6C9);
      hemiLight.intensity = 0.95;
      fog.color.setHex(0xF9F6F1);
      renderer.setClearColor(0xF9F6F1, 1);
    } else if (lightingMood === 'golden') {
      keyLight.color.setHex(0xFFE2B0);
      keyLight.intensity = 2.2;
      keyLight.position.set(4, 4.5, 3);
      hemiLight.color.setHex(0xFFE8D0);
      hemiLight.groundColor.setHex(0xC2A48C);
      hemiLight.intensity = 1.1;
      fog.color.setHex(0xF6EFE4);
      renderer.setClearColor(0xF6EFE4, 1);
    } else {
      // twilight
      keyLight.color.setHex(0x9BBBD4);
      keyLight.intensity = 1.2;
      keyLight.position.set(-2, 5, 3);
      hemiLight.color.setHex(0x3B4A54);
      hemiLight.groundColor.setHex(0x1F262B);
      hemiLight.intensity = 0.65;
      fog.color.setHex(0x232B30);
      renderer.setClearColor(0x232B30, 1);
    }
  }, [lightingMood]);

  // Audio synthesis toggle (peaceful stream white noise with soft low-pass filter)
  useEffect(() => {
    if (soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Create pink/brown noise for peaceful babbling brook
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.04;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 1.2);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        whiteNoise.start();

        audioNodesRef.current = { gain, noiseSource: whiteNoise };
      } catch (err) {
        console.warn('Web Audio could not be started:', err);
      }
    } else {
      if (audioNodesRef.current?.gain && audioCtxRef.current) {
        audioNodesRef.current.gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
        setTimeout(() => {
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
        }, 550);
      }
    }

    return () => {
      audioCtxRef.current?.close();
    };
  }, [soundEnabled]);

  // Main Three.js Scene Setup & Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xF9F6F1, 1);
    container.appendChild(renderer.domElement);

    // 2. Scene & Camera
    const scene = new THREE.Scene();
    const fog = new THREE.Fog(0xF9F6F1, 5, 14);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 30);
    camera.position.set(0, 2.2, 4.8);
    camera.lookAt(0, 0.9, 0);

    // 3. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xFFFAF0, 1.9);
    keyLight.position.set(3, 6, 4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.camera.left = -2.5;
    keyLight.shadow.camera.right = 2.5;
    keyLight.shadow.camera.top = 2.5;
    keyLight.shadow.camera.bottom = -2.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xEBF4FA, 0xDFD6C9, 0.95);
    hemiLight.position.set(0, 8, 0);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xD8E5E5, 0.7);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // 5. Procedural Textures (Zero 404s)
    // Procedural Stone Stipple Texture
    const stoneCanvas = document.createElement('canvas');
    stoneCanvas.width = 512;
    stoneCanvas.height = 512;
    const sCtx = stoneCanvas.getContext('2d')!;
    sCtx.fillStyle = '#6E6E6B';
    sCtx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 7000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = Math.floor(95 + Math.random() * 55);
      const alpha = 0.15 + Math.random() * 0.35;
      sCtx.fillStyle = `rgba(${gray}, ${gray + 2}, ${gray - 2}, ${alpha})`;
      sCtx.beginPath();
      sCtx.arc(x, y, 0.8 + Math.random() * 2.2, 0, Math.PI * 2);
      sCtx.fill();
    }
    const stoneTexture = new THREE.CanvasTexture(stoneCanvas);
    stoneTexture.colorSpace = THREE.SRGBColorSpace;
    stoneTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Procedural Sand Raked Ripple Texture
    const sandCanvas = document.createElement('canvas');
    sandCanvas.width = 512;
    sandCanvas.height = 512;
    const sandCtx = sandCanvas.getContext('2d')!;
    sandCtx.fillStyle = '#EADECE';
    sandCtx.fillRect(0, 0, 512, 512);
    sandCtx.strokeStyle = 'rgba(180, 165, 145, 0.35)';
    sandCtx.lineWidth = 2.5;
    for (let r = 20; r < 250; r += 14) {
      sandCtx.beginPath();
      sandCtx.arc(256, 256, r, 0, Math.PI * 2);
      sandCtx.stroke();
    }
    const sandTexture = new THREE.CanvasTexture(sandCanvas);
    sandTexture.colorSpace = THREE.SRGBColorSpace;
    sandTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 6. Composite 3-12 Part Procedural Zen Model Group
    const zenSanctuaryGroup = new THREE.Group();
    scene.add(zenSanctuaryGroup);

    // Part 1: Sand Foundation Platform
    const sandDiscGeo = new THREE.CylinderGeometry(2.6, 2.7, 0.08, 64);
    const sandMat = new THREE.MeshStandardMaterial({
      map: sandTexture,
      roughness: 0.92,
      metalness: 0.02,
      color: 0xF3EFE6,
    });
    const sandDisc = new THREE.Mesh(sandDiscGeo, sandMat);
    sandDisc.position.y = 0.04;
    sandDisc.receiveShadow = !isSoftwareGl;
    zenSanctuaryGroup.add(sandDisc);

    // Soft Radial Contact Shadow Plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shCtx = shadowCanvas.getContext('2d')!;
    const grad = shCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(40, 36, 32, 0.45)');
    grad.addColorStop(0.5, 'rgba(40, 36, 32, 0.2)');
    grad.addColorStop(1, 'rgba(40, 36, 32, 0)');
    shCtx.fillStyle = grad;
    shCtx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.5,
    });
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.085;
    zenSanctuaryGroup.add(shadowPlane);

    // Part 2: Base Large River Stone (Ground Anchor)
    const baseStoneGeo = new THREE.SphereGeometry(0.82, 36, 26);
    baseStoneGeo.scale(1.2, 0.48, 0.95);
    const baseStoneMat = new THREE.MeshStandardMaterial({
      map: stoneTexture,
      roughness: 0.85,
      metalness: 0.05,
      color: 0x6E756B,
    });
    const baseStone = new THREE.Mesh(baseStoneGeo, baseStoneMat);
    baseStone.position.set(0, 0.38, 0);
    baseStone.rotation.y = 0.25;
    baseStone.castShadow = !isSoftwareGl;
    baseStone.receiveShadow = !isSoftwareGl;
    zenSanctuaryGroup.add(baseStone);

    // Part 3: Middle River Pebble (Carefully Balanced)
    const midStoneGeo = new THREE.SphereGeometry(0.58, 32, 24);
    midStoneGeo.scale(1.05, 0.52, 0.88);
    const midStoneMat = new THREE.MeshStandardMaterial({
      map: stoneTexture,
      roughness: 0.72,
      metalness: 0.08,
      color: 0x889286,
    });
    const midStone = new THREE.Mesh(midStoneGeo, midStoneMat);
    midStone.position.set(-0.04, 0.76, 0.02);
    midStone.rotation.set(0.08, 0.65, -0.04);
    midStone.castShadow = !isSoftwareGl;
    midStone.receiveShadow = !isSoftwareGl;
    zenSanctuaryGroup.add(midStone);

    // Part 4: Top Crown Stone (Smooth & Refined)
    const topStoneGeo = new THREE.SphereGeometry(0.38, 30, 20);
    topStoneGeo.scale(0.95, 0.58, 0.85);
    const topStoneMat = new THREE.MeshStandardMaterial({
      map: stoneTexture,
      roughness: 0.58,
      metalness: 0.12,
      color: 0xA2ABA0,
    });
    const topStone = new THREE.Mesh(topStoneGeo, topStoneMat);
    topStone.position.set(0.02, 1.12, -0.01);
    topStone.rotation.set(-0.06, 1.2, 0.05);
    topStone.castShadow = !isSoftwareGl;
    topStone.receiveShadow = !isSoftwareGl;
    zenSanctuaryGroup.add(topStone);

    // Part 5: Stylized Bamboo Fountain Spout
    const bambooGroup = new THREE.Group();
    bambooGroup.position.set(1.4, 0.08, -0.5);
    bambooGroup.rotation.y = -0.4;
    zenSanctuaryGroup.add(bambooGroup);

    const stalkGeo = new THREE.CylinderGeometry(0.07, 0.075, 1.1, 20);
    const bambooMat = new THREE.MeshStandardMaterial({
      color: 0x7E8D6B,
      roughness: 0.65,
      metalness: 0.05,
    });
    const stalk = new THREE.Mesh(stalkGeo, bambooMat);
    stalk.position.y = 0.55;
    stalk.castShadow = !isSoftwareGl;
    bambooGroup.add(stalk);

    const spoutGeo = new THREE.CylinderGeometry(0.05, 0.055, 0.65, 18);
    const spout = new THREE.Mesh(spoutGeo, bambooMat);
    spout.position.set(-0.2, 0.95, 0);
    spout.rotation.z = Math.PI / 3;
    spout.castShadow = !isSoftwareGl;
    bambooGroup.add(spout);

    // Part 6: Smooth river pebbles around base
    const pebbleColors = [0x545B54, 0x768278, 0x939A8F, 0xB6AFA4];
    for (let p = 0; p < 7; p++) {
      const angle = (p / 7) * Math.PI * 2 + 0.3;
      const radius = 1.05 + Math.sin(p * 2.3) * 0.25;
      const pGeo = new THREE.SphereGeometry(0.12 + Math.random() * 0.08, 16, 12);
      pGeo.scale(1.2, 0.5, 0.9);
      const pMat = new THREE.MeshStandardMaterial({
        color: pebbleColors[p % pebbleColors.length],
        roughness: 0.7,
        metalness: 0.05,
      });
      const pebble = new THREE.Mesh(pGeo, pMat);
      pebble.position.set(Math.cos(angle) * radius, 0.12, Math.sin(angle) * radius);
      pebble.rotation.y = Math.random() * Math.PI;
      pebble.castShadow = !isSoftwareGl;
      zenSanctuaryGroup.add(pebble);
    }

    // Part 7: Kinetic Procedural Breathing Aura Ring (Gently pulses with breathing pace)
    const ringGeo = new THREE.TorusGeometry(1.6, 0.022, 24, 96);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xA8B5A2,
      emissive: 0x869880,
      emissiveIntensity: 0.45,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.75,
    });
    const breathingRing = new THREE.Mesh(ringGeo, ringMat);
    breathingRing.rotation.x = Math.PI / 2;
    breathingRing.position.y = 0.8;
    zenSanctuaryGroup.add(breathingRing);

    // Store in state ref
    sceneStateRef.current = {
      ...sceneStateRef.current,
      breathingRingMesh: breathingRing,
      keyLight,
      hemiLight,
      fog,
      renderer,
      camera,
    };

    // Mouse Interaction for Damped Orbit Drag
    const onPointerDown = (e: PointerEvent) => {
      sceneStateRef.current.isDragging = true;
      sceneStateRef.current.prevMouseX = e.clientX;
      sceneStateRef.current.prevMouseY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!sceneStateRef.current.isDragging) return;
      const deltaX = e.clientX - sceneStateRef.current.prevMouseX;
      const deltaY = e.clientY - sceneStateRef.current.prevMouseY;
      sceneStateRef.current.prevMouseX = e.clientX;
      sceneStateRef.current.prevMouseY = e.clientY;

      sceneStateRef.current.orbitAngle += deltaX * 0.005;
      sceneStateRef.current.orbitElevation = Math.max(0.1, Math.min(1.1, sceneStateRef.current.orbitElevation - deltaY * 0.003));
    };
    const onPointerUp = () => {
      sceneStateRef.current.isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize handler
    const onResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 7. Animation Loop with Pacing for Software WebGL & Breathing Simulation
    let frameId = 0;
    let clock = new THREE.Clock();
    let breathTimer = 0;

    // Software WebGL pacing helper
    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      breathTimer += delta;

      // Calculate breathing rhythm based on mode
      const mode = sceneStateRef.current.breathingMode;
      let cycleDuration = 16; // default box: 4 in, 4 hold, 4 out, 4 pause
      let phase: 'Inhale' | 'Hold' | 'Exhale' | 'Pause' = 'Inhale';
      let targetExpansion = 1.0;
      let remainingSec = 4;

      if (mode === 'box') {
        cycleDuration = 16;
        const progress = breathTimer % cycleDuration;
        if (progress < 4) {
          phase = 'Inhale';
          const t = progress / 4;
          targetExpansion = 0.85 + t * 0.45; // 0.85 -> 1.3
          remainingSec = Math.ceil(4 - progress);
        } else if (progress < 8) {
          phase = 'Hold';
          targetExpansion = 1.3;
          remainingSec = Math.ceil(8 - progress);
        } else if (progress < 12) {
          phase = 'Exhale';
          const t = (progress - 8) / 4;
          targetExpansion = 1.3 - t * 0.45; // 1.3 -> 0.85
          remainingSec = Math.ceil(12 - progress);
        } else {
          phase = 'Pause';
          targetExpansion = 0.85;
          remainingSec = Math.ceil(16 - progress);
        }
      } else if (mode === 'relax478') {
        cycleDuration = 19; // 4 in, 7 hold, 8 out
        const progress = breathTimer % cycleDuration;
        if (progress < 4) {
          phase = 'Inhale';
          const t = progress / 4;
          targetExpansion = 0.85 + t * 0.5;
          remainingSec = Math.ceil(4 - progress);
        } else if (progress < 11) {
          phase = 'Hold';
          targetExpansion = 1.35;
          remainingSec = Math.ceil(11 - progress);
        } else {
          phase = 'Exhale';
          const t = (progress - 11) / 8;
          targetExpansion = 1.35 - t * 0.5;
          remainingSec = Math.ceil(19 - progress);
        }
      } else {
        // coherent (5.5s in, 5.5s out)
        cycleDuration = 11;
        const progress = breathTimer % cycleDuration;
        if (progress < 5.5) {
          phase = 'Inhale';
          const t = progress / 5.5;
          targetExpansion = 0.85 + t * 0.45;
          remainingSec = Math.ceil(5.5 - progress);
        } else {
          phase = 'Exhale';
          const t = (progress - 5.5) / 5.5;
          targetExpansion = 1.3 - t * 0.45;
          remainingSec = Math.ceil(11 - progress);
        }
      }

      // Update React UI states throttled
      if (Math.floor(breathTimer * 10) % 3 === 0) {
        setBreathPhase(phase);
        setBreathSeconds(remainingSec);
      }

      // Smooth exponential damping on breathing ring scale
      const state = sceneStateRef.current;
      state.targetScale = targetExpansion;
      const smoothFactor = 1 - Math.exp(-4 * delta);
      state.currentScale += (state.targetScale - state.currentScale) * smoothFactor;

      if (state.breathingRingMesh) {
        state.breathingRingMesh.scale.set(state.currentScale, state.currentScale, state.currentScale);
        state.breathingRingMesh.rotation.z += delta * 0.15;
      }

      // Gentle auto-sway when not dragging
      if (!state.isDragging) {
        state.orbitAngle += delta * 0.04;
      }

      // Smooth camera orbit positioning with damping
      const distance = 4.6;
      const targetX = Math.sin(state.orbitAngle) * Math.cos(state.orbitElevation) * distance;
      const targetY = 0.7 + Math.sin(state.orbitElevation) * distance;
      const targetZ = Math.cos(state.orbitAngle) * Math.cos(state.orbitElevation) * distance;

      camera.position.x += (targetX - camera.position.x) * (1 - Math.exp(-5 * delta));
      camera.position.y += (targetY - camera.position.y) * (1 - Math.exp(-5 * delta));
      camera.position.z += (targetZ - camera.position.z) * (1 - Math.exp(-5 * delta));
      camera.lookAt(0, 0.75, 0);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      // Dispose Three.js resources
      sandDiscGeo.dispose();
      sandMat.dispose();
      baseStoneGeo.dispose();
      baseStoneMat.dispose();
      midStoneGeo.dispose();
      midStoneMat.dispose();
      topStoneGeo.dispose();
      topStoneMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      stoneTexture.dispose();
      sandTexture.dispose();
      shadowTex.dispose();
      renderer.dispose();
      if (dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }
    };
  }, []);

  const resetCamera = () => {
    sceneStateRef.current.orbitAngle = 0.2;
    sceneStateRef.current.orbitElevation = 0.35;
  };

  return (
    <div className={`relative w-full overflow-hidden select-none ${isHeroEmbedded ? 'h-[460px] md:h-[540px] rounded-3xl border border-[#A8B5A2]/30 shadow-lg' : 'h-[620px] rounded-3xl border border-[#A8B5A2]/25 shadow-xl'} bg-[#F9F6F1]`}>
      {/* 3D Canvas Mount (Outside any re-rendering overlays) */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing w-full h-full" />

      {/* Minimal Top Badges (Zero Viewport Occlusion) */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-full bg-white/90 text-[#2C2C2C] text-xs font-medium shadow-xs border border-[#A8B5A2]/30 flex items-center gap-2">
          <Wind className="w-3.5 h-3.5 text-[#5B6A56]" />
          <span>Interactive Mindful Sanctuary</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-[#EDF2EB] text-[#5B6A56] text-xs font-semibold border border-[#A8B5A2]/40">
          <span>{breathPhase} · {breathSeconds}s</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={resetCamera}
          title="Reset Camera View"
          className="p-2 rounded-full bg-white/90 text-[#2C2C2C] hover:bg-white transition-colors border border-[#A8B5A2]/30 shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#5B6A56]" />
        </button>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Peaceful Brook' : 'Play Gentle Brook Soundscape'}
          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs border ${
            soundEnabled 
              ? 'bg-[#5B6A56] text-white border-[#5B6A56]' 
              : 'bg-white/90 text-[#2C2C2C] border-[#A8B5A2]/30 hover:bg-white'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-[#606060]" />}
          <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Brook Audio'}</span>
        </button>
      </div>

      {/* Gentle Guided Breath Guidance Overlay (Centered, non-intrusive) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <p className="text-xs uppercase tracking-widest text-[#5B6A56] font-semibold">Follow the Kinetic Ring</p>
        <h4 className="font-serif text-2xl md:text-3xl font-medium text-[#2C2C2C] mt-0.5">
          {breathPhase}
        </h4>
        <p className="text-xs text-[#606060] mt-0.5">
          {breathPhase === 'Inhale' && 'Slowly breathe in through your nose, filling your belly.'}
          {breathPhase === 'Hold' && 'Pause softly. Allow tension in your shoulders to drop.'}
          {breathPhase === 'Exhale' && 'Gently release through your lips like a quiet sigh.'}
          {breathPhase === 'Pause' && 'Rest in the natural stillness before the next wave.'}
        </p>
      </div>

      {/* Ergonomic Unified Collapsible Bottom Dock (Zero Left/Right Occlusion) */}
      <div 
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[660px] transition-all duration-300 ${
          isControlsCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
        }`}
      >
        {/* Toggle Collapse Bar */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="px-4 py-1 rounded-t-xl bg-white text-[#2C2C2C] text-xs font-medium border-t border-x border-[#A8B5A2]/40 shadow-xs flex items-center gap-1 hover:bg-[#F9F6F1] transition-colors"
          >
            {isControlsCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#5B6A56]" />
                <span>Show Sanctuary Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#5B6A56]" />
                <span>Minimize Controls (Zen View)</span>
              </>
            )}
          </button>
        </div>

        {/* Solid / Semi-Solid Controls Surface (No laggy backdrop-filter over WebGL) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white text-[#2C2C2C] border border-[#A8B5A2]/40 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            {/* Breathing Cadence Switcher */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#606060] font-medium mr-1">Rhythm:</span>
              <button
                onClick={() => setBreathingMode('box')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  breathingMode === 'box'
                    ? 'bg-[#5B6A56] text-white font-medium shadow-xs'
                    : 'bg-[#EDF2EB] text-[#2C2C2C] hover:bg-[#E2EBE0]'
                }`}
              >
                Box (4-4-4-4)
              </button>
              <button
                onClick={() => setBreathingMode('relax478')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  breathingMode === 'relax478'
                    ? 'bg-[#5B6A56] text-white font-medium shadow-xs'
                    : 'bg-[#EDF2EB] text-[#2C2C2C] hover:bg-[#E2EBE0]'
                }`}
              >
                Deep Calm (4-7-8)
              </button>
              <button
                onClick={() => setBreathingMode('coherent')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  breathingMode === 'coherent'
                    ? 'bg-[#5B6A56] text-white font-medium shadow-xs'
                    : 'bg-[#EDF2EB] text-[#2C2C2C] hover:bg-[#E2EBE0]'
                }`}
              >
                Coherent (5s)
              </button>
            </div>

            {/* Time of Day Lighting Mood */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#606060] font-medium mr-1">Atmosphere:</span>
              <button
                onClick={() => setLightingMood('morning')}
                title="Morning Sunlight"
                className={`p-1.5 rounded-lg border transition-all ${
                  lightingMood === 'morning'
                    ? 'bg-[#5B6A56] text-white border-[#5B6A56]'
                    : 'bg-[#EDF2EB] text-[#2C2C2C] border-transparent hover:bg-[#E2EBE0]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLightingMood('golden')}
                title="Golden Hour"
                className={`p-1.5 rounded-lg border transition-all ${
                  lightingMood === 'golden'
                    ? 'bg-[#5B6A56] text-white border-[#5B6A56]'
                    : 'bg-[#EDF2EB] text-[#2C2C2C] border-transparent hover:bg-[#E2EBE0]'
                }`}
              >
                <span className="text-[11px] font-serif font-bold">Gold</span>
              </button>
              <button
                onClick={() => setLightingMood('twilight')}
                title="Evening Twilight"
                className={`p-1.5 rounded-lg border transition-all ${
                  lightingMood === 'twilight'
                    ? 'bg-[#5B6A56] text-white border-[#5B6A56]'
                    : 'bg-[#EDF2EB] text-[#2C2C2C] border-transparent hover:bg-[#E2EBE0]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[11px] text-[#606060] border-t border-[#A8B5A2]/20 pt-2">
            <span>Drag gently to rotate 3D stones</span>
            <span className="hidden sm:inline">Tactile River Rocks & Bamboo Water Sanctuary</span>
          </div>
        </div>
      </div>
    </div>
  );
};
