import { Button, Link, Text, VStack } from '@chakra-ui/react';
import { useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { FC } from 'react';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { PerspectiveCamera } from 'three';
import type { Group } from 'three';

const useCameraConfig = () => {
  const get = () => {
    if (window.matchMedia('(max-width: 480px)').matches) return { fov: 90, y: 5 };
    if (window.matchMedia('(max-width: 1024px)').matches) return { fov: 60, y: 5 };
    return { fov: 50, y: 3 };
  };
  const [config, setConfig] = useState(get);
  useEffect(() => {
    const handler = () => setConfig(get());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return config;
};

const RADIUS = 6;
const ORBIT_SPEED = 1.5;

const MODEL_URLS = [
  '/reactjs_logo.glb',
  '/python_logo.glb',
  '/blender_logo.glb',
  '/rails_logo.glb',
  '/unreal_logo.glb',
  '/threejs_logo.glb',
] as const;

const MODEL_INFO: Record<string, { label: string; description: string; href: string }> = {
  '/reactjs_logo.glb': {
    label: 'React.js',
    description: 'Check out some project samples of my past professional work made with React',
    href: 'https://smauldredd.com/samples?category=react',
  },
  '/python_logo.glb': { label: 'Python', description: 'Coming soon', href: '' },
  '/blender_logo.glb': {
    label: 'Blender',
    description: 'Check out some of my models',
    href: 'https://sketchfab.com/gmavrou',
  },
  '/rails_logo.glb': { label: 'Ruby on Rails', description: 'Coming soon', href: '' },
  '/unreal_logo.glb': {
    label: 'Unreal Engine',
    description: 'Check out the progress of my recent game development project',
    href: 'https://placeholder.com',
  },
  '/threejs_logo.glb': {
    label: 'Three.js',
    description: 'Check out some of my 3D web projects',
    href: 'https://smauldredd.com/samples?category=threejs',
  },
};

const randomValue = () => {
  const values = [0.2, 0.3, 0.4];
  return values[Math.floor(Math.random() * values.length)];
};

// The camera sits at positive Z (roughly), so the "front" position for a mesh
// is at angle = 0 on the unit circle (x=RADIUS, z=0 projected toward camera).
// Actually camera is at [0,6,12], so forward on XZ plane points toward -Z from camera,
// meaning origin is at -Z from camera. The mesh closest to the camera is at angle=0
// (x=RADIUS*cos(0), z=RADIUS*sin(0)) = (RADIUS, 0) which is off to the side.
// We want the mesh at the position with the largest Z (toward camera at z=12).
// That is angle = PI/2 in standard math (sin=1 → z=RADIUS).
const FRONT_ANGLE = Math.PI / 2;

type Ref<T> = { current: T };

type SharedState = {
  hoveredIndex: number | null;
  orbitOffset: Ref<number>;
  orbiting: Ref<boolean>;
  orbitTargetIndex: Ref<number | null>;
};

const LogoModel: FC<{
  url: string;
  index: number;
  shared: SharedState;
  onHover: (i: number | null) => void;
  onClick: (i: number) => void;
}> = ({ url, index, shared, onHover, onClick }) => {
  const { scene } = useGLTF(url);
  const ref = useRef<Group>(null);
  const { gl } = useThree();

  const baseAngle = (index / MODEL_URLS.length) * Math.PI * 2;
  const xRotSpeed = useRef(randomValue()).current;
  const yRotSpeed = useRef(randomValue()).current;
  const zRotSpeed = useRef(randomValue()).current;

  const isHovered = shared.hoveredIndex === index;

  useFrame((_, delta) => {
    if (!ref.current) return;

    // Orbit all meshes around Y axis toward target
    if (shared.orbiting.current && shared.orbitTargetIndex.current !== null) {
      const targetIndex = shared.orbitTargetIndex.current;
      const targetBaseAngle = (targetIndex / MODEL_URLS.length) * Math.PI * 2;
      // We want targetBaseAngle + orbitOffset = FRONT_ANGLE (mod 2PI)
      const desiredOffset = FRONT_ANGLE - targetBaseAngle;
      let remaining =
        (((desiredOffset - shared.orbitOffset.current) % (Math.PI * 2)) + Math.PI * 2) %
        (Math.PI * 2);
      if (remaining > Math.PI) remaining -= Math.PI * 2;

      if (Math.abs(remaining) < 0.01) {
        shared.orbitOffset.current = desiredOffset;
        shared.orbiting.current = false;
      } else {
        const step = Math.sign(remaining) * ORBIT_SPEED * delta;
        shared.orbitOffset.current += Math.abs(step) > Math.abs(remaining) ? remaining : step;
      }
    }

    const currentAngle = baseAngle + shared.orbitOffset.current;
    const x = Math.cos(currentAngle) * RADIUS;
    const z = Math.sin(currentAngle) * RADIUS;
    ref.current.position.set(x, 0, z);

    // Self-rotation only when not hovered and not orbiting
    if (!isHovered && !shared.orbiting.current) {
      ref.current.rotation.x += delta * xRotSpeed;
      ref.current.rotation.y += delta * yRotSpeed;
      ref.current.rotation.z += delta * zRotSpeed;
    } else if (isHovered) {
      ref.current.rotation.set(FRONT_ANGLE, 0, 0);
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      position={[Math.cos(baseAngle) * RADIUS, 0, Math.sin(baseAngle) * RADIUS]}
      rotation={[xRotSpeed, yRotSpeed, zRotSpeed]}
      onPointerOver={(e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        onHover(index);
        gl.domElement.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onHover(null);
        gl.domElement.style.cursor = 'default';
      }}
      onClick={(e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        onClick(index);
      }}
    />
  );
};

const CameraUpdater: FC<{ y: number; fov: number }> = ({ y, fov }) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.setY(y);
    (camera as PerspectiveCamera).fov = fov;
    (camera as PerspectiveCamera).updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  }, [camera, y, fov]);
  return null;
};

export const Skills: FC = () => {
  const cameraConfig = useCameraConfig();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const orbitOffset = useRef(0);
  const orbiting = useRef(false);
  const orbitTargetIndex = useRef<number | null>(null);

  const shared: SharedState = {
    hoveredIndex,
    orbitOffset,
    orbiting,
    orbitTargetIndex,
  };

  const handleHover = useCallback((i: number | null) => {
    setHoveredIndex(i);
  }, []);

  const handleClick = useCallback((i: number) => {
    orbitTargetIndex.current = i;
    orbiting.current = true;
    setSelectedUrl(MODEL_URLS[i]);
  }, []);

  const selectedInfo = selectedUrl ? MODEL_INFO[selectedUrl] : null;

  return (
    <VStack justifyContent="center" width="full">
      <div style={{ position: 'relative', width: '100%', height: '500px' }}>
        <Canvas
          style={{ position: 'absolute', inset: 0 }}
          gl={{ antialias: true }}
          camera={{ position: [0, cameraConfig.y, 12], fov: cameraConfig.fov }}
          onCreated={({ camera }) => {
            camera.up.set(0, 0, -1);
            camera.lookAt(0, 0, 0);
          }}
        >
          <CameraUpdater y={cameraConfig.y} fov={cameraConfig.fov} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 5]} intensity={2} />
          <Suspense fallback={null}>
            {MODEL_URLS.map((url, i) => (
              <LogoModel
                key={url}
                url={url}
                index={i}
                shared={shared}
                onHover={handleHover}
                onClick={handleClick}
              />
            ))}
          </Suspense>
        </Canvas>
        {selectedInfo && (
          <VStack position="absolute" top={0} left="50%" transform="translateX(-50%)">
            <Text textStyle="h3">{selectedInfo.label}</Text>
            <VStack textAlign="center" maxW="90%">
              <Link href={selectedInfo.href} target="_blank" rel="noopener noreferrer" width="full">
                <Button
                  variant="outline"
                  size="sm"
                  whiteSpace="normal"
                  height="auto"
                  py="2"
                  width="full"
                >
                  {selectedInfo.description}
                </Button>
              </Link>
            </VStack>
          </VStack>
        )}
      </div>
    </VStack>
  );
};

MODEL_URLS.forEach((url) => useGLTF.preload(url));
