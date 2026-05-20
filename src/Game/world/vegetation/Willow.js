import * as THREE from "three"
import Game from "../../Game"
import WillowFoliage from "./WillowFoliage"

export default class Willow {
  constructor(config = {}) {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources
    this.debug = this.game.debug

    this.name = config.name || "Willow"
    this.modelName = config.model || "tree04Model"
    this.positions = config.positions || []
    this.foliageHeight = config.foliageHeight || 3.01
    this.foliageScale = config.foliageScale || 1.02
    this.clusters = config.clusters || [
      // Outer ring
      { x: 1.4, y: 0.0, z: 0.0, scale: 1.0 },
      { x: 1.0, y: 0.0, z: 1.0, scale: 0.9 },
      { x: 0.0, y: 0.0, z: 1.4, scale: 1.0 },
      { x: -1.0, y: 0.0, z: 1.0, scale: 0.9 },
      { x: -1.4, y: 0.0, z: 0.0, scale: 1.0 },
      { x: -1.0, y: 0.0, z: -1.0, scale: 0.9 },
      { x: 0.0, y: 0.0, z: -1.4, scale: 1.0 },
      { x: 1.0, y: 0.0, z: -1.0, scale: 0.9 },
      // Inner ring (slightly higher)
      { x: 0.6, y: 0.4, z: 0.6, scale: 0.85 },
      { x: -0.6, y: 0.4, z: 0.6, scale: 0.85 },
      { x: -0.6, y: 0.4, z: -0.6, scale: 0.85 },
      { x: 0.6, y: 0.4, z: -0.6, scale: 0.85 },
    ]

    this.scaleFactor = 1.0

    this.foliage = new WillowFoliage({
      planeCount: config.planeCount || 80,
      planeWidth: config.planeWidth,
      planeHeight: config.planeHeight,
      hangLength: config.hangLength,
      minRadius: config.minRadius || 1,
      maxRadius: config.maxRadius,
      color: config.color || "#16ed2f",
      colorDark: config.colorDark || "#287308",
      texture: this.resources.items.leafs03Texture,
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

    this.debugParams = {
      color: this.foliage.color,
      colorDark: this.foliage.colorDark,
    }

    this.debugFolder = this.game.debugFolder.addFolder({
      title: this.name,
      expanded: false,
    })

    this.debugFolder
      .addBinding(this, "foliageHeight", {
        label: "Foliage height",
        min: 0,
        max: 15,
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

    this.debugFolder
      .addBinding(this.debugParams, "color", { label: "Color" })
      .on("change", (e) => {
        this.foliage.material.uniforms.uColor.value.set(e.value)
      })

    this.debugFolder
      .addBinding(this.debugParams, "colorDark", { label: "Color dark" })
      .on("change", (e) => {
        this.foliage.material.uniforms.uColorDark.value.set(e.value)
      })
  }
}
