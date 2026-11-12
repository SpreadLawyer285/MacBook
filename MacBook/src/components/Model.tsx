import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

type ModelProps = {
  url: string;
  targetSize: number;
  position?: [number, number, number];
  lidOpen?: number;
  lidOpenRef?: { current: number };
  interactive?: boolean;
};

const keyboardLegendRows = [
  {
    x: -82.8,
    labels: [
      "`",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "-",
      "=",
      "⌫",
    ],
  },
  {
    x: -61.4,
    labels: ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]"],
  },
  {
    x: -40.1,
    labels: [
      "caps lock",
      "A",
      "S",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      ";",
      "'",
      "enter",
    ],
  },
  {
    x: -18.7,
    labels: [
      "shift",
      "§",
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
      ",",
      ".",
      "/",
      "shift",
    ],
  },
] as const;

const additionalKeyLegends: Record<string, string> = {
  Cube001: "esc",
  Cube015: "→",
  Cube014: "↓",
  Cube013: "←",
  Cube016: "↑",
  Cube011: "command",
  Cube010: "option",
  Cube067: "fn",
  Cube066: "control",
  Cube065: "option",
  Cube007: "command",
};

const keyboardLegendRotation = new THREE.Quaternion()
  .setFromRotationMatrix(
    new THREE.Matrix4().set(0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1),
  )
  .premultiply(
    new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      Math.PI,
    ),
  );

const smallerKeyCharacters = new Set([
  "`",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "-",
  "=",
  "[",
  "]",
  "\\",
  ";",
  "'",
  "§",
  ",",
  ".",
  "/",
  "⌫",
]);

export function Model({
  url,
  targetSize,
  position = [0, 0, 0],
  lidOpen = 1,
  lidOpenRef,
  interactive = false,
}: ModelProps) {
  const source = useLoader(FBXLoader, url);
  const lidPivotRef = useRef<THREE.Group>(null);
  const activePressRef = useRef<{
    pointerId: number;
    mesh: THREE.Mesh;
    position: THREE.Vector3;
    colors: { material: THREE.Material; color: THREE.Color }[];
  } | null>(null);
  const model = useMemo(() => {
    const object = source.clone(true);
    object.updateMatrixWorld(true);
    const baseMesh = object.getObjectByName("Plane");
    const baseBounds = baseMesh
      ? new THREE.Box3().setFromObject(baseMesh)
      : null;

    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.castShadow = true;
      child.receiveShadow = true;
      child.material = Array.isArray(child.material)
        ? child.material.map((material) => makeOpaque(material))
        : makeOpaque(child.material);
    });

    const lidMesh = object.getObjectByName("Plane001");
    let lidPivot: THREE.Group | null = null;
    let closedAngle = 0;
    if (lidMesh instanceof THREE.Mesh) {
      lidMesh.geometry.computeBoundingBox();
      const bounds = lidMesh.geometry.boundingBox;
      if (bounds) {
        const hingeInGeometry = new THREE.Vector3(
          bounds.min.x,
          (bounds.min.y + bounds.max.y) / 2,
          0,
        );
        let hinge = hingeInGeometry.clone().applyMatrix4(lidMesh.matrixWorld);
        if (baseBounds && lidMesh.parent) {
          const targetHinge = hinge.clone();
          targetHinge.y =
            baseBounds.max.y + (bounds.max.y - bounds.min.y) / 2 - 7;
          targetHinge.x -= 3;
          const parent = lidMesh.parent;
          const localOffset = parent
            .worldToLocal(targetHinge)
            .sub(parent.worldToLocal(hinge.clone()));
          lidMesh.position.add(localOffset);
          object.updateMatrixWorld(true);
          hinge = hingeInGeometry.clone().applyMatrix4(lidMesh.matrixWorld);
        }

        const center = bounds
          .getCenter(new THREE.Vector3())
          .applyMatrix4(lidMesh.matrixWorld);
        object.worldToLocal(hinge);
        object.worldToLocal(center);

        lidPivot = new THREE.Group();
        lidPivot.position.copy(hinge);
        object.add(lidPivot);
        lidPivot.attach(lidMesh);
        const screenAngle = Math.atan2(center.y - hinge.y, center.x - hinge.x);
        closedAngle = -screenAngle - THREE.MathUtils.degToRad(0.3);
      }
    }

    object.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(object);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = targetSize / Math.max(size.x, size.z);
    addKeyboardLegends(object);

    return {
      object,
      center: center.multiplyScalar(-scale),
      scale,
      lidPivot,
      closedAngle,
    };
  }, [source, targetSize]);

  useEffect(() => {
    lidPivotRef.current = model.lidPivot;
  }, [model]);

  useEffect(() => {
    if (!interactive) return;

    function releasePress(event: PointerEvent) {
      const press = activePressRef.current;
      if (!press || press.pointerId !== event.pointerId) return;

      restorePress(press);
      activePressRef.current = null;
    }

    window.addEventListener("pointerup", releasePress);
    window.addEventListener("pointercancel", releasePress);

    return () => {
      window.removeEventListener("pointerup", releasePress);
      window.removeEventListener("pointercancel", releasePress);
      const press = activePressRef.current;
      if (press) {
        restorePress(press);
        activePressRef.current = null;
      }
    };
  }, [interactive]);

  useFrame((_, delta) => {
    const lidPivot = lidPivotRef.current;
    if (!lidPivot) return;
    const openAmount = lidOpenRef?.current ?? lidOpen;
    const targetAngle =
      model.closedAngle * (1 - THREE.MathUtils.clamp(openAmount, 0, 1));
    lidPivot.rotation.z = THREE.MathUtils.damp(
      lidPivot.rotation.z,
      targetAngle,
      7,
      delta,
    );
  });

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    if (activePressRef.current) return;
    const mesh = event.object;
    if (!(mesh instanceof THREE.Mesh)) return;

    let materials: THREE.Material[];
    if (mesh.name === "Cube002") {
      if (event.face?.materialIndex !== 1 || !Array.isArray(mesh.material))
        return;
      materials = [mesh.material[1]];
    } else if (/^Cube\d*$/.test(mesh.name)) {
      materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
    } else {
      return;
    }

    activePressRef.current = {
      pointerId: event.pointerId,
      mesh,
      position: mesh.position.clone(),
      colors: materials.flatMap((material) =>
        "color" in material && material.color instanceof THREE.Color
          ? [{ material, color: material.color.clone() }]
          : [],
      ),
    };

    const color = "#383b40";
    materials.forEach((material) => setMaterialColor(material, color));
    if (mesh.name !== "Cube002") mesh.position.y -= 1.5;
  }

  return (
    <group position={position}>
      <primitive
        object={model.object}
        position={model.center}
        scale={model.scale}
        onPointerDown={interactive ? handlePointerDown : undefined}
      />
    </group>
  );
}

function addKeyboardLegends(object: THREE.Group) {
  object.updateMatrixWorld(true);
  const inverseObjectMatrix = object.matrixWorld.clone().invert();
  const keys: {
    mesh: THREE.Mesh;
    position: THREE.Vector3;
    bounds: THREE.Box3;
  }[] = [];
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh) || !/^Cube\d*$/.test(child.name)) return;
    if (child.name === "Cube002") return;
    child.geometry.computeBoundingBox();
    const geometryBounds = child.geometry.boundingBox;
    if (!geometryBounds) return;

    const meshToObject = inverseObjectMatrix
      .clone()
      .multiply(child.matrixWorld);
    keys.push({
      mesh: child,
      position: object.worldToLocal(
        child.getWorldPosition(new THREE.Vector3()),
      ),
      bounds: geometryBounds.clone().applyMatrix4(meshToObject),
    });
  });

  const labels = keyboardLegendRows.flatMap((row) =>
    row.labels.slice(
      0,
      keys.filter(({ position }) => Math.abs(position.x - row.x) < 2).length,
    ),
  );
  const allLabels = [
    ...new Set([...labels, ...Object.values(additionalKeyLegends)]),
  ];
  const { texture, uvFor, aspectFor } = createKeyboardLegendAtlas(allLabels);
  const legendMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.1,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  object.updateMatrixWorld(true);
  keyboardLegendRows.forEach((row) => {
    const rowKeys = keys
      .filter(({ position }) => Math.abs(position.x - row.x) < 2)
      .sort((a, b) => b.position.z - a.position.z);

    rowKeys.slice(0, row.labels.length).forEach(({ mesh, bounds }, index) => {
      const label = row.labels[index];
      addLegendToKey(
        object,
        mesh,
        bounds,
        label,
        legendMaterial,
        uvFor,
        aspectFor,
      );
    });
  });

  keys.forEach(({ mesh, bounds }) => {
    const label = additionalKeyLegends[mesh.name];
    if (label) {
      addLegendToKey(
        object,
        mesh,
        bounds,
        label,
        legendMaterial,
        uvFor,
        aspectFor,
      );
    }
  });
}

function addLegendToKey(
  object: THREE.Group,
  mesh: THREE.Mesh,
  bounds: THREE.Box3,
  label: string,
  material: THREE.MeshBasicMaterial,
  uvFor: Map<string, readonly [number, number, number, number]>,
  aspectFor: Map<string, number>,
) {
  const isArrow = ["←", "↑", "↓", "→"].includes(label);
  const maxWidth = (bounds.max.z - bounds.min.z) * (isArrow ? 0.96 : 0.86);
  const maxHeight = (bounds.max.x - bounds.min.x) * (isArrow ? 0.96 : 0.76);
  const aspect = aspectFor.get(label) ?? 1;
  const height = Math.min(maxHeight, maxWidth / aspect);
  const geometry = new THREE.PlaneGeometry(height * aspect, height);
  const uv = geometry.attributes.uv;
  const [u0, v0, u1, v1] = uvFor.get(label)!;
  uv.setXY(0, u0, v0);
  uv.setXY(1, u1, v0);
  uv.setXY(2, u0, v1);
  uv.setXY(3, u1, v1);
  uv.needsUpdate = true;

  const legend = new THREE.Mesh(geometry, material);
  legend.position.set(
    (bounds.min.x + bounds.max.x) / 2,
    bounds.max.y + 0.05,
    (bounds.min.z + bounds.max.z) / 2,
  );
  legend.quaternion.copy(keyboardLegendRotation);
  legend.raycast = () => {};
  object.add(legend);
  object.updateMatrixWorld(true);
  mesh.attach(legend);
}

function createKeyboardLegendAtlas(labels: string[]) {
  const columns = 8;
  const rows = Math.ceil(labels.length / columns);
  const cellSize = 64;
  const canvas = document.createElement("canvas");
  canvas.width = columns * cellSize;
  canvas.height = rows * cellSize;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create keyboard legends");

  context.fillStyle = "rgba(235, 239, 245, 0.82)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  const aspectFor = new Map<string, number>();
  labels.forEach((label, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const isArrow = ["←", "↑", "↓", "→"].includes(label);
    const fontSize = isArrow
      ? 52
      : smallerKeyCharacters.has(label)
        ? label === "⌫"
          ? 18
          : 26
        : label.length > 4
          ? 18
          : label.length > 1
            ? 26
            : 40;
    context.font = `${fontSize}px Arial, sans-serif`;
    aspectFor.set(
      label,
      Math.max(0.45, context.measureText(label).width / fontSize),
    );
    context.save();
    context.translate(
      column * cellSize + cellSize / 2,
      row * cellSize + cellSize / 2,
    );
    context.rotate(Math.PI);
    context.fillText(label, 0, 0);
    context.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const uvFor = new Map(
    labels.map((label, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      return [
        label,
        [
          column / columns,
          1 - (row + 1) / rows,
          (column + 1) / columns,
          1 - row / rows,
        ] as const,
      ] as const;
    }),
  );
  return { texture, uvFor, aspectFor };
}

function setMaterialColor(
  material: THREE.Material,
  color: THREE.ColorRepresentation,
) {
  if ("color" in material && material.color instanceof THREE.Color) {
    material.color.set(color);
  }
}

function restorePress(press: {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
  colors: { material: THREE.Material; color: THREE.Color }[];
}) {
  press.mesh.position.copy(press.position);
  press.colors.forEach(({ material, color }) => {
    if ("color" in material && material.color instanceof THREE.Color) {
      material.color.copy(color);
    }
  });
}

function makeOpaque(material: THREE.Material) {
  const opaqueMaterial = material.clone();
  opaqueMaterial.transparent = false;
  opaqueMaterial.opacity = 1;
  opaqueMaterial.depthWrite = true;
  opaqueMaterial.side = THREE.DoubleSide;
  opaqueMaterial.needsUpdate = true;
  return opaqueMaterial;
}
