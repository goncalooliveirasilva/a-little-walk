import * as THREE from "three"
import * as CANNON from "cannon-es"
import Game from "../Game"

export default class Floor {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.debug = this.game.debug
    this.physics = this.game.physics

    this.color = "#046504"

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
    this.setBody()
    this.setDebug()
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(500, 500)
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      color: this.color,
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.receiveShadow = true
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

  setDebug() {
    if (!this.debug.active) return

    this.debugParams = {
      color: this.color,
    }

    this.debugFolder = this.game.debugFolder.addFolder({
      title: "Floor",
      expanded: false,
    })

    this.debugFolder
      .addBinding(this.debugParams, "color", { label: "Color" })
      .on("change", (e) => {
        this.material.color.set(e.value)
      })
  }
}
