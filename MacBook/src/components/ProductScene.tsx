import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Model } from './Model'

type SceneBeat = {
  id: string
  lidOpen: number
  position: [number, number, number]
  rotation: [number, number, number]
  cameraPosition: [number, number, number]
  target: [number, number, number]
}

const sceneBeats: SceneBeat[] = [
  {
    id: 'top',
    lidOpen: 0,
    position: [-0.2, 0.05, 0.25],
    rotation: [0, 0.06, -0.42],
    cameraPosition: [9.5, 0.55, 0],
    target: [0, -1.35, 0],
  },
  {
    id: 'design',
    lidOpen: 1,
    position: [-0.2, 0.3, 0],
    rotation: [-0.1, -0.18, 0.02],
    cameraPosition: [0, 0.3, 8.6],
    target: [0, 0, 0],
  },
  {
    id: 'keyboard',
    lidOpen: 1,
    position: [0.32, -0.12, 0],
    rotation: [-0.12, -0.52, 0.02],
    cameraPosition: [0, 3.8, 5.7],
    target: [0, -0.35, 0],
  },
  {
    id: 'trackpad',
    lidOpen: 1,
    position: [0.45, -0.22, 0],
    rotation: [-0.12, -0.52, -0.02],
    cameraPosition: [1.2, 3.3, 2],
    target: [1.2, -1.2, 0],
  },
  {
    id: 'ports',
    lidOpen: 1,
    position: [0.22, -0.05, 0],
    rotation: [0.05, 1.28, 0],
    cameraPosition: [1, 0.5, 7.1],
    target: [0, 0, 0],
  },
  {
    id: 'rotation',
    lidOpen: 1,
    position: [0.12, 0.05, 0],
    rotation: [0.16, 3.45, 0.02],
    cameraPosition: [0, 0.5, 8.4],
    target: [0, 0, 0],
  },
  {
    id: 'pro-line',
    lidOpen: 1,
    position: [0.2, 0.12, 0],
    rotation: [-0.06, 5.65, 0],
    cameraPosition: [0, 0.35, 8.8],
    target: [0, 0, 0],
  },
]

function blendVector(
  from: [number, number, number],
  to: [number, number, number],
  amount: number,
): [number, number, number] {
  return [
    THREE.MathUtils.lerp(from[0], to[0], amount),
    THREE.MathUtils.lerp(from[1], to[1], amount),
    THREE.MathUtils.lerp(from[2], to[2], amount),
  ]
}

function getCurrentBeat(): SceneBeat {
  const focusY = window.innerHeight * 0.52
  const visibleBeats = sceneBeats.flatMap((beat) => {
    const section = document.getElementById(beat.id)
    if (!section) return []

    const bounds = section.getBoundingClientRect()
    return [{ beat, centerY: bounds.top + bounds.height * 0.5 }]
  })

  if (visibleBeats.length === 0) return sceneBeats[0]

  const nextIndex = visibleBeats.findIndex(({ centerY }) => centerY >= focusY)
  if (nextIndex === 0) return visibleBeats[0].beat
  if (nextIndex < 0) return visibleBeats[visibleBeats.length - 1].beat

  const previous = visibleBeats[nextIndex - 1]
  const next = visibleBeats[nextIndex]
  const amount = THREE.MathUtils.smoothstep(
    (focusY - previous.centerY) / (next.centerY - previous.centerY),
    0,
    1,
  )

  return {
    id: next.beat.id,
    position: blendVector(previous.beat.position, next.beat.position, amount),
    rotation: blendVector(previous.beat.rotation, next.beat.rotation, amount),
    lidOpen: THREE.MathUtils.lerp(previous.beat.lidOpen, next.beat.lidOpen, amount),
    cameraPosition: blendVector(previous.beat.cameraPosition, next.beat.cameraPosition, amount),
    target: blendVector(previous.beat.target, next.beat.target, amount),
  }
}

function FloatingProduct({
  interactive = false,
  lidOpen = interactive ? 1 : 0,
}: {
  interactive?: boolean
  lidOpen?: number
}) {
  const productRef = useRef<THREE.Group>(null)
  const targetRef = useRef(new THREE.Vector3())
  const lidOpenRef = useRef(interactive ? 1 : 0)

  useFrame((state, delta) => {
    const product = productRef.current
    if (!product) return

    if (interactive) {
      lidOpenRef.current = lidOpen
      product.position.y = Math.sin(state.clock.elapsedTime * 1.15) * 0.07
      return
    }

    const explorer = document.getElementById('explore')
    const pose = getCurrentBeat()
    lidOpenRef.current = pose.lidOpen
    const elapsed = state.clock.elapsedTime
    const explorerBounds = explorer?.getBoundingClientRect()
    const explorerIsVisible = explorerBounds
      ? explorerBounds.top < 0 && explorerBounds.bottom > 0
      : false
    product.visible = !explorerIsVisible
    product.position.x = THREE.MathUtils.damp(product.position.x, pose.position[0], 7, delta)
    product.position.y = THREE.MathUtils.damp(
      product.position.y,
      pose.position[1] + Math.sin(elapsed * 1.25) * 0.07,
      7,
      delta,
    )
    product.position.z = THREE.MathUtils.damp(product.position.z, pose.position[2], 7, delta)
    product.rotation.x = THREE.MathUtils.damp(product.rotation.x, pose.rotation[0], 7, delta)
    product.rotation.y = THREE.MathUtils.damp(product.rotation.y, pose.rotation[1], 7, delta)
    product.rotation.z = THREE.MathUtils.damp(product.rotation.z, pose.rotation[2], 7, delta)
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      pose.cameraPosition[0],
      5,
      delta,
    )
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      pose.cameraPosition[1],
      5,
      delta,
    )
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      pose.cameraPosition[2],
      5,
      delta,
    )
    targetRef.current.x = THREE.MathUtils.damp(targetRef.current.x, pose.target[0], 5, delta)
    targetRef.current.y = THREE.MathUtils.damp(targetRef.current.y, pose.target[1], 5, delta)
    targetRef.current.z = THREE.MathUtils.damp(targetRef.current.z, pose.target[2], 5, delta)
    state.camera.lookAt(targetRef.current)
  })

  return (
    <group ref={productRef}>
      <Model
        url="/Macbook1.fbx"
        targetSize={4.25}
        lidOpenRef={lidOpenRef}
        interactive={interactive}
      />
    </group>
  )
}

function StudioLighting() {
  return (
    <>
      <hemisphereLight args={['#ffffff', '#b8c0cc', 2.1]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 6]} intensity={2.2} castShadow />
      <directionalLight position={[-5, 2, -4]} intensity={1.15} color="#dbeafe" />
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.2}
        scale={9}
        blur={2.5}
        far={5}
      />
    </>
  )
}

function ExplorerCamera() {
  const width = useThree((state) => state.size.width)

  return (
    <PerspectiveCamera
      makeDefault
      position={[4, 2.1, 7.6]}
      fov={width <= 760 ? 56 : 42}
    />
  )
}

export function ProductScene() {
  return (
    <div className="scroll-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.25, 9.5], fov: 36 }}
        gl={{ alpha: true, antialias: true }}
      >
        <StudioLighting />
        <Suspense fallback={null}>
          <FloatingProduct />
        </Suspense>
      </Canvas>
    </div>
  )
}

type ExplorerCanvasProps = {
  resetToken: number
  lidOpen: number
}

const defaultExplorerCameraPosition = new THREE.Vector3(4, 2.1, 7.6)
const defaultExplorerTarget = new THREE.Vector3(0, 0, 0)

function ExplorerViewReset({
  resetToken,
  controlsRef,
}: {
  resetToken: number
  controlsRef: RefObject<OrbitControlsImpl | null>
}) {
  const camera = useThree((state) => state.camera)
  const previousResetToken = useRef(resetToken)
  const animationRef = useRef<{
    elapsed: number
    fromPosition: THREE.Vector3
    fromTarget: THREE.Vector3
    controlsWereEnabled: boolean
  } | null>(null)

  useEffect(() => {
    if (previousResetToken.current === resetToken) return

    const controls = controlsRef.current
    if (!controls) return

    previousResetToken.current = resetToken
    animationRef.current = {
      elapsed: 0,
      fromPosition: camera.position.clone(),
      fromTarget: controls.target.clone(),
      controlsWereEnabled: animationRef.current?.controlsWereEnabled ?? controls.enabled,
    }
    controls.enabled = false
  }, [camera, controlsRef, resetToken])

  useFrame((_, delta) => {
    const animation = animationRef.current
    const controls = controlsRef.current
    if (!animation || !controls) return

    animation.elapsed = Math.min(animation.elapsed + delta, 0.7)
    const progress = THREE.MathUtils.smoothstep(animation.elapsed, 0, 0.7)
    camera.position.lerpVectors(
      animation.fromPosition,
      defaultExplorerCameraPosition,
      progress,
    )
    controls.target.lerpVectors(animation.fromTarget, defaultExplorerTarget, progress)
    controls.update()

    if (animation.elapsed === 0.7) {
      controls.enabled = animation.controlsWereEnabled
      animationRef.current = null
    }
  })

  return null
}

export function ExplorerCanvas({ resetToken, lidOpen }: ExplorerCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
    >
      <StudioLighting />
      <ExplorerCamera />
      <Suspense fallback={null}>
        <FloatingProduct interactive lidOpen={lidOpen} />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        target={[0, 0, 0]}
        enableDamping
        enablePan={false}
        dampingFactor={0.08}
        minDistance={4.5}
        maxDistance={11}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 1.75}
      />
      <ExplorerViewReset resetToken={resetToken} controlsRef={controlsRef} />
    </Canvas>
  )
}
