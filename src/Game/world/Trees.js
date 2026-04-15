import * as THREE from "three"
import Game from "../Game"
import Foliage from "./Foliage"

export default class Trees {
  constructor(config = {}) {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources
    this.debug = this.game.debug

    this.name = config.name || "Trees"
    this.modelName = config.model || "tree01Model"
    this.positions = config.positions || []
    this.foliageHeight = config.foliageHeight || 3
    this.foliageScale = config.foliageScale || 0.65
    this.clusters = config.clusters || [
      { y: -0.5, x: -0.6, z: 0, scale: 1.1 },
      { y: -0.8, x: 0, z: -0.2, scale: 0.75 },
      { y: 0.1, x: 0.1, z: -0.5, scale: 1.0 },
      { y: -0.1, x: 0.4, z: 0.2, scale: 1.05 },
      { y: -0.5, x: -0.2, z: -0.4, scale: 0.85 },
      { y: -0.2, x: 0, z: 0.6, scale: 0.95 },
      { y: -0.2, x: 0.6, z: -0.2, scale: 0.85 },
    ]

    this.scaleFactor = 1.2

    this.foliage = new Foliage({
      planeCount: config.planeCount || 40,
      planeSize: config.planeSize || 1.2,
      minRadius: config.minRadius || 0.2,
      maxRadius: config.maxRadius || 0.8,
      color: config.color || "#db5309",
      colorDark: config.colorDark || "#9c5d04",
      texture: this.resources.items.leafsTexture,
      noiseTexture: this.resources.items.perlinTexture,
    })

    this.setTrunks()
    this.setFoliage()
    this.setDebug()
  }

  setTrunks() {
    const model = this.resources.items[this.modelName].scene
    const count = this.positions.length
    if (count === 0) return

    let trunkGeometry, trunkMaterial
    model.traverse((child) => {
      if (child.isMesh) {
        trunkGeometry = child.geometry
        trunkMaterial = child.material
      }
    })

    this.trunkMesh = new THREE.InstancedMesh(
      trunkGeometry,
      trunkMaterial,
      count,
    )
    this.trunkMesh.castShadow = true

    const matrix = new THREE.Matrix4()
    for (let i = 0; i < count; i++) {
      const pos = this.positions[i]
      const s = pos.scale
      matrix.compose(
        new THREE.Vector3(pos.x, 0, pos.z),
        new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
        ),
        new THREE.Vector3(
          s * this.scaleFactor,
          s * this.scaleFactor,
          s * this.scaleFactor,
        ),
      )
      this.trunkMesh.setMatrixAt(i, matrix)
    }

    this.scene.add(this.trunkMesh)
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
      title: this.name,
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
