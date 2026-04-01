import * as THREE from "three"
import Game from "../Game"
import Foliage from "./Foliage"

export default class Bush {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources
    this.debug = this.game.debug

    this.foliage = new Foliage({
      planeCount: 30,
      planeSize: 1.5,
      minRadius: 0.3,
      maxRadius: 1.0,
      color: "#c79518",
      texture: this.resources.items.leafsTexture,
      noiseTexture: this.resources.items.perlinTexture,
    })

    this.positions = [
      { x: 3, z: 2, scale: 0.7 },
      { x: -5, z: 8, scale: 0.5 },
      { x: 10, z: -3, scale: 0.8 },
      { x: -2, z: -6, scale: 0.6 },
      { x: 7, z: 5, scale: 0.9 },
    ]

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

  setDebug() {}
}
