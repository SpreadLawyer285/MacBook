import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

type ModelProps = {
  url: string
  targetSize: number
  position?: [number, number, number]
  lidOpen?: number
  lidOpenRef?: { current: number }
}

export function Model({
  url,
  targetSize,
  position = [0, 0, 0],
  lidOpen = 1,
  lidOpenRef,
}: ModelProps) {
  const source = useLoader(FBXLoader, url)
  const lidPivotRef = useRef<THREE.Group>(null)
  const model = useMemo(() => {
    const object = source.clone(true)
    object.updateMatrixWorld(true)
    const baseMesh = object.getObjectByName('Plane')
    const baseBounds = baseMesh ? new THREE.Box3().setFromObject(baseMesh) : null

    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      child.castShadow = true
      child.receiveShadow = true
      child.material = Array.isArray(child.material)
        ? child.material.map((material) => makeOpaque(material))
        : makeOpaque(child.material)
    })

    const lidMesh = object.getObjectByName('Plane001')
    let lidPivot: THREE.Group | null = null
    let closedAngle = 0
    if (lidMesh instanceof THREE.Mesh) {
      lidMesh.geometry.computeBoundingBox()
      const bounds = lidMesh.geometry.boundingBox
      if (bounds) {
        const hingeInGeometry = new THREE.Vector3(
          bounds.min.x,
          (bounds.min.y + bounds.max.y) / 2,
          0,
        )
        let hinge = hingeInGeometry.clone().applyMatrix4(lidMesh.matrixWorld)
        if (baseBounds && lidMesh.parent) {
          const targetHinge = hinge.clone()
          targetHinge.y =
            baseBounds.max.y + (bounds.max.y - bounds.min.y) / 2 - 7
          targetHinge.x -= 3
          const parent = lidMesh.parent
          const localOffset = parent.worldToLocal(targetHinge).sub(
            parent.worldToLocal(hinge.clone()),
          )
          lidMesh.position.add(localOffset)
          object.updateMatrixWorld(true)
          hinge = hingeInGeometry.clone().applyMatrix4(lidMesh.matrixWorld)
        }

        const center = bounds
          .getCenter(new THREE.Vector3())
          .applyMatrix4(lidMesh.matrixWorld)
        object.worldToLocal(hinge)
        object.worldToLocal(center)

        lidPivot = new THREE.Group()
        lidPivot.position.copy(hinge)
        object.add(lidPivot)
        lidPivot.attach(lidMesh)
        const screenAngle = Math.atan2(center.y - hinge.y, center.x - hinge.x)
        closedAngle = -screenAngle - THREE.MathUtils.degToRad(0.3)
      }
    }

    object.updateMatrixWorld(true)
    const bounds = new THREE.Box3().setFromObject(object)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const scale = targetSize / Math.max(size.x, size.z)

    return { object, center: center.multiplyScalar(-scale), scale, lidPivot, closedAngle }
  }, [source, targetSize])

  useEffect(() => {
    lidPivotRef.current = model.lidPivot
  }, [model])

  useFrame((_, delta) => {
    const lidPivot = lidPivotRef.current
    if (!lidPivot) return
    const openAmount = lidOpenRef?.current ?? lidOpen
    const targetAngle = model.closedAngle * (1 - THREE.MathUtils.clamp(openAmount, 0, 1))
    lidPivot.rotation.z = THREE.MathUtils.damp(
      lidPivot.rotation.z,
      targetAngle,
      7,
      delta,
    )
  })

  return (
    <group position={position}>
      <primitive
        object={model.object}
        position={model.center}
        scale={model.scale}
      />
    </group>
  )
}

function makeOpaque(material: THREE.Material) {
  const opaqueMaterial = material.clone()
  opaqueMaterial.transparent = false
  opaqueMaterial.opacity = 1
  opaqueMaterial.depthWrite = true
  opaqueMaterial.side = THREE.DoubleSide
  opaqueMaterial.needsUpdate = true
  return opaqueMaterial
}
