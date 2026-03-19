import * as THREE from "three"
import * as CANNON from "cannon-es"
import Game from "../Game"

export default class Floor {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.physics = this.game.physics

    // this.setGeometry()
    // this.setMaterial()
    // this.setMesh()
    this.setBody()
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

  setBody() {
    this.body = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    })
    this.body.quaternion.setFromEuler(-Math.PI * 0.5, 0, 0)
    this.physics.world.addBody(this.body)
  }
}
