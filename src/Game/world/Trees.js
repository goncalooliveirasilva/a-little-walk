import * as THREE from "three"
import Game from "../Game"
import Foliage from "./Foliage"
import { trees } from "./mapConfig"

export default class Trees {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources
    this.debug = this.game.debug

    this.foliageHeight = 3
    this.positions = trees

    this.trunkColor = "#5c3a1e"
    this.foliageScale = 0.5
    this.clusters = [
      { y: -0.5, x: -0.6, z: 0, scale: 1.1 },
      { y: -0.8, x: 0, z: -0.2, scale: 0.75 },
      { y: 0.1, x: -0.7, z: -0.5, scale: 1.0 },
      { y: -0.1, x: 0.4, z: 0.2, scale: 1.05 },
      { y: -0.5, x: -0.2, z: -0.4, scale: 0.85 },
      { y: -0.2, x: 0, z: 0.6, scale: 0.95 },
      { y: -0.2, x: 0.6, z: -0.2, scale: 0.85 },
    ]

    this.foliage = new Foliage({
      planeCount: 40,
      planeSize: 1.2,
      minRadius: 0.2,
      maxRadius: 0.8,
      color: "#4db34d",
      colorDark: "#2a6e2a",
      texture: this.resources.items.leafsTexture,
      noiseTexture: this.resources.items.perlinTexture,
    })

    this.setTrunks()
    this.setFoliage()
    this.setDebug()
  }

  setTrunks() {
    const model = this.resources.items.tree01Model.scene

    for (let i = 0; i < this.positions.length; i++) {
      const pos = this.positions[i]
      const s = pos.scale
      const tree = model.clone()

      tree.position.set(pos.x, 0, pos.z)
      tree.scale.set(s, s, s)
      tree.rotation.y = Math.random() * Math.PI * 2

      tree.traverse((child) => {
        if (child.isMesh) {
          // child.castShadow = true
          // child.receiveShadow = true
          child.material = child.material.clone()
          child.material.color.set(this.trunkColor)
        }
      })

      this.scene.add(tree)
    }
  }

  setFoliage() {
    const count = this.positions.length
    if (count === 0) return

    const totalInstances = count * this.clusters.length

    this.foliageMesh = new THREE.InstancedMesh(
      this.foliage.geometry,
      this.foliage.material,
      totalInstances,
    )

    const matrix = new THREE.Matrix4()
    let instanceIndex = 0

    for (let i = 0; i < count; i++) {
      const pos = this.positions[i]
      const s = pos.scale

      for (const cluster of this.clusters) {
        const fs = s * this.foliageScale * cluster.scale
        matrix.compose(
          new THREE.Vector3(
            pos.x + cluster.x * s,
            this.foliageHeight * s + cluster.y * s,
            pos.z + cluster.z * s,
          ),
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          ),
          new THREE.Vector3(fs, fs, fs),
        )
        this.foliageMesh.setMatrixAt(instanceIndex, matrix)
        instanceIndex++
      }
    }

    this.scene.add(this.foliageMesh)
  }

  update() {
    this.foliage.update(this.game.time.elapsed * 0.001)
  }

  rebuildFoliage() {
    if (this.foliageMesh) {
      this.scene.remove(this.foliageMesh)
      this.foliageMesh.dispose()
    }
    this.setFoliage()
  }

  setDebug() {
    if (!this.debug.active) return

    this.debugFolder = this.game.debugFolder.addFolder({
      title: "Trees",
      expanded: false,
    })

    this.debugFolder
      .addBinding(this, "foliageHeight", {
        label: "Foliage height",
        min: 0,
        max: 10,
        step: 0.1,
      })
      .on("change", () => this.rebuildFoliage())

    this.debugFolder
      .addBinding(this, "foliageScale", {
        label: "Foliage scale",
        min: 0.1,
        max: 3,
        step: 0.05,
      })
      .on("change", () => this.rebuildFoliage())

    // Per-cluster controls
    this.clusters.forEach((cluster, index) => {
      const clusterFolder = this.debugFolder.addFolder({
        title: `Cluster ${index + 1}`,
        expanded: false,
      })

      clusterFolder
        .addBinding(cluster, "x", { min: -3, max: 3, step: 0.1 })
        .on("change", () => this.rebuildFoliage())

      clusterFolder
        .addBinding(cluster, "y", { min: -3, max: 3, step: 0.1 })
        .on("change", () => this.rebuildFoliage())

      clusterFolder
        .addBinding(cluster, "z", { min: -3, max: 3, step: 0.1 })
        .on("change", () => this.rebuildFoliage())

      clusterFolder
        .addBinding(cluster, "scale", { min: 0.1, max: 2, step: 0.05 })
        .on("change", () => this.rebuildFoliage())
    })
  }
}
