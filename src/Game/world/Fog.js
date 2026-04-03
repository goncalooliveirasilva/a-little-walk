import * as THREE from "three"
import Game from "../Game"

export default class Fog {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.debug = this.game.debug

    this.color = "#9bfff8"
    this.near = 28
    this.far = 63

    this.setFog()
    this.setDebug()
  }

  setFog() {
    this.scene.fog = new THREE.Fog(this.color, this.near, this.far)
    this.scene.background = new THREE.Color(this.color)
  }

  setDebug() {
    if (!this.debug.active) return

    this.debugParams = {
      color: this.color,
    }

    this.debugFolder = this.game.debugFolder.addFolder({
      title: "Fog",
      expanded: false,
    })

    this.debugFolder
      .addBinding(this.debugParams, "color", { label: "Color" })
      .on("change", (e) => {
        this.scene.fog.color.set(e.value)
        this.scene.background.set(e.value)
      })

    this.debugFolder.addBinding(this.scene.fog, "near", {
      label: "Near",
      min: 0,
      max: 100,
      step: 1,
    })

    this.debugFolder.addBinding(this.scene.fog, "far", {
      label: "Far",
      min: 10,
      max: 200,
      step: 1,
    })
  }
}
