import { clamp } from '@/common/helpers';
import { PALETTE } from '@/design-system/palette';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';

const RADIUS = 5;
export class ThreeEngine {
  public scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private gltFLoader: GLTFLoader;
  public controls: OrbitControls;
  private light: THREE.DirectionalLight;
  private isAnimating: boolean;
  private animationMixer: THREE.AnimationMixer;
  private clips: THREE.AnimationClip[];
  private clock: THREE.Clock;
  // Angles for the light rotation
  private phi = Math.PI / 2; // vertical angle
  private theta = 0; // horizontal angle (in radians)

  constructor(canvas: HTMLCanvasElement) {
    const width = canvas.width;
    const height = canvas.height;
    this.isAnimating = true;
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    // this.camera.aspect = width / height;
    // this.camera.updateProjectionMatrix();
    // this.renderer.setSize(width, height);

    // Light
    this.camera.position.z = 5;
    this.light = new THREE.DirectionalLight(0xffffff, 3);
    this.light.position.set(-1, 2, 4);
    this.scene.add(this.light);

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    this.controls.enablePan = false;

    // Set Model Loader
    this.gltFLoader = new GLTFLoader();

    this.clock = new THREE.Clock();
  }

  loadModel(url: string) {
    this.gltFLoader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        this.scene.add(model);
        this.animationMixer = new THREE.AnimationMixer(model);
        this.clips = gltf.animations;
        this.playAnimation('heartbeat');
        this.renderer.render(this.scene, this.camera);
      },
      undefined,
      (err) => {
        console.error(err);
      }
    );
  }

  playAnimation(animation: string) {
    const clip = THREE.AnimationClip.findByName(this.clips, animation);
    if (clip) {
      const action = this.animationMixer.clipAction(clip);
      action.play();
      this.animate();
    }
  }

  handleResize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  rotateLight(deltaX: number, deltaY: number) {
    const ROT_SPEED = 0.005;

    this.theta -= deltaX * ROT_SPEED;
    this.phi += deltaY * ROT_SPEED;

    // Clamp vertical angle so the light never flips
    this.phi = clamp(this.phi, 0.1, Math.PI - 0.1);

    const x = RADIUS * Math.sin(this.phi) * Math.cos(this.theta);
    const y = RADIUS * Math.cos(this.phi);
    const z = RADIUS * Math.sin(this.phi) * Math.sin(this.theta);
    this.light.position.set(x, y, z);
    this.light.lookAt(0, 0, 0);

    this.animate();
  }

  setIsAnimating = (bool: boolean) => {
    this.isAnimating = bool;
  };

  getIsAnimating = () => {
    return this.isAnimating;
  };

  animate = () => {
    this.renderer.setAnimationLoop(() => {
      if (this.isAnimating) {
        const deltaTime = this.clock.getDelta();
        this.animationMixer.update(deltaTime);
      }
      this.renderer.render(this.scene, this.camera);
    });
  };

  dispose() {
    this.renderer.dispose();
  }
}

export const useThree = (canvas: HTMLCanvasElement | null, url: string) => {
  const threeEngine = useRef<ThreeEngine | null>(null);

  useEffect(() => {
    if (!canvas) {
      return;
    }
    const engine = new ThreeEngine(canvas);
    threeEngine.current = engine;

    engine.scene.background = new THREE.Color(PALETTE.brand[800]);

    const onResize = () => {
      const rect = canvas.getBoundingClientRect();
      engine.handleResize(rect.width, rect.height);
    };
    // engine.handleResize(canvas.width, canvas.height);
    // window.addEventListener('resize', onResize);
    onResize();
    engine.loadModel(url);
    return () => {
      // window.removeEventListener('resize', onResize);
      if (threeEngine.current) {
        threeEngine.current.dispose();
      }
      threeEngine.current = null;
    };
  }, [canvas, url]);

  return {
    threeEngine,
  };
};
