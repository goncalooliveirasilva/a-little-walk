import * as THREE from "three"
import Game from "../Game"
import Foliage from "./Foliage"
import { bushes } from "./mapConfig"

export default class Bush {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources
    this.debug = this.game.debug

    this.color = "#c8e210"
    this.colorDark = "#6c8f00"

    this.foliage = new Foliage({
      planeCount: 30,
      planeSize: 1.5,
      minRadius: 0.3,
      maxRadius: 1.0,
      color: this.color,
      colorDark: this.colorDark,
      texture: this.resources.items.leafsTexture,
      noiseTexture: this.resources.items.perlinTexture,
    })

    this.positions = bushes

    this.setMesh()
    this.setDebug()
  }

  setMesh() {
    const count = this.positions.length
    if (count === 0) return

    this.mesh = new THREE.InstancedMesh(
      this.foliage.geometry,
      this.foliage.material,
      count,
    )

    const matrix = new THREE.Matrix4()

    for (let i = 0; i < count; i++) {
      const pos = this.positions[i]
      const s = pos.scale
      matrix.compose(
        new THREE.Vector3(pos.x, s * 0.5, pos.z),
        new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
        ),
        new THREE.Vector3(s, s, s),
      )
      this.mesh.setMatrixAt(i, matrix)
    }

    this.scene.add(this.mesh)
  }

  update() {
    this.foliage.update(this.game.time.elapsed * 0.001)
  }

  setDebug() {
    if (!this.debug.active) return

    this.debugParams = {
      color: this.color,
      colorDark: this.colorDark,
    }

    this.debugFolder = this.game.debugFolder.addFolder({
      title: "Bushes",
      expanded: false,
    })

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
