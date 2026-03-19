import * as THREE from "three"
import * as CANNON from "cannon-es"
import Game from "../Game"

export default class Cube {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.physics = this.game.physics

    this.size = 1

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
    this.setBody()
  }

  setGeometry() {
    this.geometry = new THREE.BoxGeometry(
      this.size * 2,
      this.size * 2,
      this.size * 2,
    )
    this.edgesGeometry = new THREE.EdgesGeometry(this.geometry)
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial()
    this.lines = new THREE.LineSegments(
      this.edgesGeometry,
      new THREE.LineBasicMaterial({ color: 0x000000 }),
    )
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.add(this.lines)
    this.scene.add(this.mesh)
  }

  setBody() {
    this.body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(this.size, this.size, this.size)),
      position: new CANNON.Vec3(0, 10, 0),
    })
    this.physics.world.addBody(this.body)
  }

  update() {
    this.mesh.position.copy(this.body.position)
    this.mesh.quaternion.copy(this.body.quaternion)
  }
}
