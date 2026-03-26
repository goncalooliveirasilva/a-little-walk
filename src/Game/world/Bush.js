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
      { x: 3, y: 0.5, z: 0 },
      { x: -2, y: 0.5, z: 3 },
      { x: 5, y: 0.5, z: -2 },
    ]

    this.setMesh()
    this.setDebug()
  }

  setMesh() {
    const count = this.positions.length
    this.mesh = new THREE.InstancedMesh(
      this.foliage.geometry,
      this.foliage.material,
      count,
    )

    const matrix = new THREE.Matrix4()
    const scale = new THREE.Vector3(0.7, 0.7, 0.7)

    for (let i = 0; i < count; i++) {
      const pos = this.positions[i]
      matrix.compose(
        new THREE.Vector3(pos.x, pos.y, pos.z),
        new THREE.Quaternion(),
        scale,
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
