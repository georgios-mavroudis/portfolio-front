import {
  OrthographicCamera,
  useAnimations,
  useGLTF,
  useKeyboardControls,
  useTexture,
} from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, type FC, type RefObject } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CONTROLS, type Control } from './utils';
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';

type Props = {
  width: number;
  height: number;
  onGameOver: () => void;
  scoreDisplayRef: React.RefObject<HTMLParagraphElement | null>;
};

const toRand = (deg: number) => deg * (Math.PI / 180);
const SCALE = 19;

const PLAYER_HITBOX = new THREE.Vector3(1, 1, 0.5);
const PLAYER_CROUCH_HITBOX = new THREE.Vector3(1, 0.7, 0.5);
const BIRD_OBSTACLE_HITBOX = new THREE.Vector3(1, 0.3, 0.7);
const STATIC_OBSTACLE_HITBOX = new THREE.Vector3(1, 0.8, 0.5);
const _center = new THREE.Vector3();

// --- Obstacles ---
type ObstacleType = 'bird_low' | 'bird_mid' | 'bird_high' | 'static';
const OBSTACLE_TYPES: ObstacleType[] = ['bird_low', 'bird_mid', 'bird_high', 'static'];

const OBSTACLE_Y: Record<ObstacleType, number> = {
  bird_low: 0.2,
  bird_mid: 0.8,
  bird_high: 1.4,
  static: 0,
};

const isBird = (type: ObstacleType) =>
  type === 'bird_low' || type === 'bird_mid' || type === 'bird_high';
const randomType = (): ObstacleType =>
  OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];

// --- Single obstacle ---

type ObstacleProps = {
  startX: number;
  speed: React.RefObject<number>;
  hitbox: THREE.Box3;
  birdScene: THREE.Group<THREE.Object3DEventMap>;
  birdAnimations: THREE.AnimationClip[];
  rockScene: THREE.Group<THREE.Object3DEventMap>;
  allGroupRefs: React.RefObject<THREE.Group | null>[];
  groupRef: React.RefObject<THREE.Group | null>;
};

const Obstacle: FC<ObstacleProps> = ({
  startX,
  speed,
  hitbox,
  birdScene,
  birdAnimations,
  rockScene,
  allGroupRefs,
  groupRef,
}) => {
  const typeRef = useRef<ObstacleType>(randomType());

  const clonedBird = useMemo(() => {
    const clone = SkeletonUtils.clone(birdScene);
    clone.visible = isBird(typeRef.current);
    return clone;
  }, [birdScene]);
  const clonedRock = useMemo(() => {
    const clone = SkeletonUtils.clone(rockScene);
    clone.visible = !isBird(typeRef.current);
    return clone;
  }, [rockScene]);
  const { actions } = useAnimations(birdAnimations, clonedBird);

  useEffect(() => {
    const fly = actions['fly'];
    if (isBird(typeRef.current)) {
      fly?.setLoop(THREE.LoopRepeat, Infinity);
      fly?.play();
    }
  }, [actions]);

  useFrame((_, dt) => {
    const group = groupRef.current;
    if (!group) return;

    const nextX = group.position.x - dt * speed.current;

    if (nextX <= -SCALE / 2 - SCALE * 0.1) {
      const newType = randomType();
      typeRef.current = newType;

      clonedBird.visible = isBird(newType);
      clonedRock.visible = !isBird(newType);

      const fly = actions['fly'];
      if (isBird(newType)) {
        fly?.setLoop(THREE.LoopRepeat, Infinity);
        fly?.play();
      } else {
        fly?.stop();
      }

      const maxX = Math.max(...allGroupRefs.map((r) => r.current?.position.x ?? 0));
      group.position.set(
        maxX + speed.current * (1.2 + Math.random() * 0.8),
        OBSTACLE_Y[newType],
        0
      );
      group.rotation.y = isBird(newType) ? -Math.PI / 2 : toRand(Math.random() * 150);
    } else {
      group.position.x = nextX;
    }

    const hitboxVector = isBird(typeRef.current) ? BIRD_OBSTACLE_HITBOX : STATIC_OBSTACLE_HITBOX;
    hitbox.setFromCenterAndSize(
      _center.set(group.position.x, group.position.y + hitboxVector.y / 2, 0),
      hitboxVector
    );
  });

  const initialType = typeRef.current;

  return (
    <group
      ref={groupRef}
      position={[startX, OBSTACLE_Y[initialType], 0]}
      rotation={[0, isBird(initialType) ? -Math.PI / 2 : toRand(Math.random() * 150), 0]}
    >
      <primitive object={clonedBird} />
      <primitive object={clonedRock} />
    </group>
  );
};

// --- Ground tiles ---

const TILE_WIDTH = 4;
const TILE_DEPTH = 15;
const GROUND_X_ROT = -1.2;
// World-Y height of one tile row after rotation
const GROUND_ROW_Y_STEP = TILE_DEPTH * Math.cos(Math.abs(GROUND_X_ROT));
// World-Z depth of one tile row after rotation (rows step toward viewer)
const GROUND_ROW_Z_STEP = -TILE_DEPTH * Math.sin(GROUND_X_ROT);
const GROUND_TILES_PER_ROW = 10;
const GROUND_NUM_ROWS = 3;

const BackgroundTrees: FC<{ speed: React.RefObject<number>; screenRatio: number }> = ({
  speed,
  screenRatio,
}) => {
  const { scene: acacia02Scene } = useGLTF('/acacia_02.glb');
  const { scene: acacia03Scene } = useGLTF('/acacia_03.glb');
  // const groupRef0 = useRef<THREE.Group>(null);
  const groupRef1 = useRef<THREE.Group>(null);
  const groupRef2 = useRef<THREE.Group>(null);
  const allGroupRefs = useMemo(() => [groupRef1, groupRef2], []);
  const startX2 = SCALE / 2 + SCALE * 0.9;
  const startX3 = SCALE / 2 + SCALE * 1.6;

  useFrame((_, dt) => {
    for (const groupRef of allGroupRefs) {
      const group = groupRef.current;
      if (!group) return;

      const nextX = group.position.x - dt * speed.current;
      const idx = allGroupRefs.indexOf(groupRef);
      if (nextX <= -SCALE / 2 - SCALE * 0.1) {
        const maxX = Math.max(...allGroupRefs.map((r) => r.current?.position.x ?? 0));
        group.position.set(
          maxX + speed.current * (1.2 + Math.random() * 0.3),
          [1.8, 2, 2.4][idx],
          -2
        );
        group.rotation.y = toRand(Math.random() * 150);
      } else {
        group.position.x = nextX;
      }
    }
  });

  return (
    <>
      <group
        ref={groupRef1}
        position={[startX2, 6 * screenRatio, -2]}
        rotation={[0, toRand(Math.random() * 150), 0]}
        scale={[0.6, 0.6, 0.6]}
      >
        <primitive object={acacia03Scene} />
      </group>
      <group
        ref={groupRef2}
        position={[startX3, 4 * screenRatio, -2]}
        rotation={[0, toRand(Math.random() * 150), 0]}
        scale={[0.6, 0.6, 0.6]}
      >
        <primitive object={acacia02Scene} />
      </group>
    </>
  );
};

const GroundTiles: FC<{ speed: React.RefObject<number> }> = ({ speed }) => {
  const texture = useTexture('/rocky_ground_BaseColor.png');
  const meshRefs = useRef<(THREE.Mesh | null)[]>(
    Array(GROUND_TILES_PER_ROW * GROUND_NUM_ROWS).fill(null)
  );

  useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, TILE_DEPTH / TILE_WIDTH);
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((_, dt) => {
    for (let col = 0; col < GROUND_TILES_PER_ROW; col++) {
      const lead = meshRefs.current[col];
      if (!lead) continue;
      const nextX = lead.position.x - dt * speed.current;
      let newX: number;
      if (nextX < -SCALE / 2 - TILE_WIDTH / 2) {
        const maxX = Math.max(
          ...Array.from(
            { length: GROUND_TILES_PER_ROW },
            (_, c) => meshRefs.current[c]?.position.x ?? -Infinity
          )
        );
        newX = maxX + TILE_WIDTH;
      } else {
        newX = nextX;
      }
      for (let row = 0; row < GROUND_NUM_ROWS; row++) {
        const mesh = meshRefs.current[row * GROUND_TILES_PER_ROW + col];
        if (mesh) mesh.position.x = newX;
      }
    }
  });

  return (
    <>
      {Array.from({ length: GROUND_TILES_PER_ROW * GROUND_NUM_ROWS }, (_, idx) => {
        const col = idx % GROUND_TILES_PER_ROW;
        const row = Math.floor(idx / GROUND_TILES_PER_ROW);
        return (
          <mesh
            key={idx}
            ref={(el) => {
              meshRefs.current[idx] = el;
            }}
            position={[
              -SCALE / 2 + (col + 0.5) * TILE_WIDTH,
              -row * GROUND_ROW_Y_STEP,
              -(TILE_DEPTH / 2 - 5) + row * GROUND_ROW_Z_STEP,
            ]}
            rotation={[GROUND_X_ROT, 0, 0]}
          >
            <planeGeometry args={[5, TILE_DEPTH]} />
            <meshStandardMaterial map={texture} />
          </mesh>
        );
      })}
    </>
  );
};

// --- Obstacle pool ---

type SpawnedObstaclesProps = {
  speed: React.RefObject<number>;
  obstacleBoxes: THREE.Box3[];
};

const SpawnedObstacles: FC<SpawnedObstaclesProps> = ({ speed, obstacleBoxes }) => {
  const { scene: birdScene, animations: birdAnimations } = useGLTF('/bird.glb');
  const { scene: rockScene } = useGLTF('/rock.glb');
  const groupRef0 = useRef<THREE.Group>(null);
  const groupRef1 = useRef<THREE.Group>(null);
  const groupRef2 = useRef<THREE.Group>(null);
  const allGroupRefs = useMemo(() => [groupRef0, groupRef1, groupRef2], []);

  return (
    <>
      <Obstacle
        startX={SCALE / 2 + SCALE * 0.2}
        speed={speed}
        hitbox={obstacleBoxes[0]}
        birdScene={birdScene}
        birdAnimations={birdAnimations}
        rockScene={rockScene}
        allGroupRefs={allGroupRefs}
        groupRef={groupRef0}
      />
      <Obstacle
        startX={SCALE / 2 + SCALE * 0.9}
        speed={speed}
        hitbox={obstacleBoxes[1]}
        birdScene={birdScene}
        birdAnimations={birdAnimations}
        rockScene={rockScene}
        allGroupRefs={allGroupRefs}
        groupRef={groupRef1}
      />
      <Obstacle
        startX={SCALE / 2 + SCALE * 1.6}
        speed={speed}
        hitbox={obstacleBoxes[2]}
        birdScene={birdScene}
        birdAnimations={birdAnimations}
        rockScene={rockScene}
        allGroupRefs={allGroupRefs}
        groupRef={groupRef2}
      />
    </>
  );
};

// --- Sky gradient background ---

const SKY_UNIFORMS = {
  topColor: { value: new THREE.Color('#77a3ee') },
  bottomColor: { value: new THREE.Color('#87ceeb') },
};

const SKY_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`;

const SKY_FRAG = `
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  varying vec2 vUv;
  void main() {
    float t = smoothstep(0.7, 1.0, vUv.y);
    gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
  }
`;

const SkyGradient = () => (
  <mesh renderOrder={-1}>
    <planeGeometry args={[2, 2]} />
    <shaderMaterial
      uniforms={SKY_UNIFORMS}
      vertexShader={SKY_VERT}
      fragmentShader={SKY_FRAG}
      depthTest={false}
      depthWrite={false}
    />
  </mesh>
);

// --- Game ---

const Mountains: FC<{ speed: RefObject<number> }> = ({ speed }) => {
  const mesh = useRef<THREE.Mesh | null>(null);
  // const mesh2 = useRef<THREE.Mesh | null>(null);
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(200, 100, 60, 60);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Stack noise layers for natural silhouette
      const z =
        Math.sin(x * 0.05) * 12 +
        Math.sin(x * 0.1 + y * 0.1) * 8 +
        Math.sin(x * 0.2) * 4 +
        Math.random() * 2;
      pos.setZ(i, z);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, dt) => {
    if (!mesh.current) return;
    const nextX = mesh.current.position.x - dt * speed.current * 0.5;
    if (nextX <= -40) {
      mesh.current.position.x = SCALE / 2 + SCALE * 0.1;
    } else {
      mesh.current.position.x = nextX;
    }
  });

  return (
    <>
      <mesh
        ref={mesh}
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -5, -60]}
        scale={[0.5, 0.5, 0.5]}
      >
        <meshStandardMaterial color="#66490b" flatShading />
      </mesh>
    </>
  );
};
export const Game: FC<Props> = ({ width, height, onGameOver: onGameOver, scoreDisplayRef }) => {
  const { scene, animations } = useGLTF('/cat.glb');
  const { actions, mixer } = useAnimations(animations, scene);
  const lionState = useRef<Control>(CONTROLS.run);
  const [, getKeys] = useKeyboardControls<Control>();
  const speed = useRef(8);
  const lionGroupRef = useRef<THREE.Group>(null);
  const rootBoneRef = useRef<THREE.Object3D | null>(null);
  const playerBox = useRef(new THREE.Box3());
  const obstacleBoxes = useRef<THREE.Box3[]>([
    new THREE.Box3(),
    new THREE.Box3(),
    new THREE.Box3(),
  ]);
  const gameOver = useRef(false);
  const score = useRef(0);

  useEffect(() => {
    const run = actions['run'];
    const jump = actions['jump'];
    const crouch = actions['crouch'];

    if (run) {
      run.reset();
      run.setLoop(THREE.LoopRepeat, Infinity);
      run.fadeIn(0.2).play();
    }
    if (crouch) {
      crouch.reset();
      crouch.setLoop(THREE.LoopRepeat, Infinity);
    }
    if (jump) {
      jump.setLoop(THREE.LoopOnce, 1);
      jump.clampWhenFinished = true;
    }

    const onFinished = (e: THREE.Event & { action: THREE.AnimationAction }) => {
      if (!run || !jump || !crouch) return;
      if (e.action === jump) {
        jump.fadeOut(0.1);
        lionState.current = CONTROLS.run;
        run.reset().fadeIn(0.15).play();
      }
    };
    mixer.addEventListener('finished', onFinished);
    return () => mixer.addEventListener('finished', onFinished);
  }, [actions, mixer]);

  useEffect(() => {
    scene.traverse((child) => {
      if (
        !rootBoneRef.current &&
        (child as THREE.Bone).isBone &&
        !(child.parent as THREE.Bone)?.isBone
      ) {
        rootBoneRef.current = child;
      }
    });
  }, [scene]);

  useFrame((_, dt) => {
    if (gameOver.current) return;

    const { jump, crouch } = getKeys();
    const run = actions['run'];
    const jumpAnim = actions['jump'];
    const crouchAnim = actions['crouch'];
    if (!run || !jumpAnim || !crouchAnim) return;

    if (jump && lionState.current !== CONTROLS.jump) {
      lionState.current = CONTROLS.jump;
      run.fadeOut(0);
      jumpAnim.reset().fadeIn(0).play();
    } else if (crouch && lionState.current !== CONTROLS.crouch) {
      if (lionState.current === CONTROLS.jump) {
        jumpAnim.fadeOut(0.1);
      } else {
        run.fadeOut(0.1);
      }
      lionState.current = CONTROLS.crouch;
      crouchAnim.reset().fadeIn(0.05).play();
    } else if (!crouch && lionState.current === CONTROLS.crouch) {
      crouchAnim.fadeOut(0.1);
      lionState.current = CONTROLS.run;
      run.reset().fadeIn(0.05).play();
    }

    speed.current += dt * 0.1;
    score.current += speed.current * dt * 5;
    if (scoreDisplayRef.current) {
      scoreDisplayRef.current.textContent = String(Math.floor(score.current)).padStart(5, '0');
    }

    if (lionGroupRef.current) {
      const isCrouch = lionState.current === CONTROLS.crouch;
      const hitbox = isCrouch ? PLAYER_CROUCH_HITBOX : PLAYER_HITBOX;
      const boneY = rootBoneRef.current?.position.y ?? 0;
      const hitboxCenterY = boneY + hitbox.y / 2;

      playerBox.current.setFromCenterAndSize(
        _center.set(lionGroupRef.current.position.x, hitboxCenterY, 0),
        hitbox
      );

      for (const box of obstacleBoxes.current) {
        if (playerBox.current.intersectsBox(box)) {
          gameOver.current = true;
          onGameOver();
          break;
        }
      }
    }
  });

  return (
    <>
      <SkyGradient />
      <Suspense>
        <OrthographicCamera
          makeDefault
          position={[0, 2, 1]}
          zoom={width / SCALE}
          args={[-width / 2, width / 2, height / 2, -height / 2, 0, 1000]}
        />
        <directionalLight intensity={5} color="white" position={[0, 10, 0]} />
        <ambientLight intensity={1} position={[0, 10, 10]} />
        <Mountains speed={speed} />
        <GroundTiles speed={speed} />
        <BackgroundTrees speed={speed} screenRatio={height / width} />
        <group ref={lionGroupRef} position={[-SCALE * 0.4, 0, 0]}>
          <primitive object={scene} rotation={[0, Math.PI / 2, 0]} />
        </group>
        <SpawnedObstacles speed={speed} obstacleBoxes={obstacleBoxes.current} />
      </Suspense>
    </>
  );
};
