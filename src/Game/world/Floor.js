import * as THREE from "three"
import Game from "../Game"

export default class Floor {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene

    // this.setGeometry()
    // this.setMaterial()
    // this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(10, 10)
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial()
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.scene.add(this.mesh)
  }
}
