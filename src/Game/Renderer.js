import * as THREE from "three"
import Game from "./Game"

export default class Renderer {
  constructor() {
    this.game = new Game()
    this.canvas = this.game.canvas
    this.sizes = this.game.sizes
    this.scene = this.game.scene
    this.camera = this.game.camera

    this.setInstance()
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })

    this.instance.setClearColor("#211d20")
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
