import * as THREE from "three"
import Game from "../Game"

export default class Environment {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.debug = this.game.debug

    this.setSunLight()
    this.setAmbientLight()

    // Debug
    this.setDebug()
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 4)
    this.sunLight.castShadow = true
    this.sunLight.position.set(30, 40, 20)

    // Large frustum so trees/rocks across the world still cast shadows
    this.sunLight.shadow.camera.left = -60
    this.sunLight.shadow.camera.right = 60
    this.sunLight.shadow.camera.top = 60
    this.sunLight.shadow.camera.bottom = -60
    this.sunLight.shadow.camera.near = 0.5
    this.sunLight.shadow.camera.far = 150
    this.sunLight.shadow.mapSize.set(2048, 2048)
    this.sunLight.shadow.normalBias = 0.05

    this.scene.add(this.sunLight)
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight("#ffffff", 1.4)
    this.scene.add(this.ambientLight)
  }

  setDebug() {
    if (!this.debug.active) return

    this.debugParams = {
      sunLightColor: "#ffffff",
      ambientLightColor: "#ffffff",
    }

    this.debugFolder = this.game.debugFolder.addFolder({
      title: "Environment",
      expanded: false,
    })

    this.debugFolder.addBinding(this.sunLight, "intensity", {
      label: "Sun intensity",
      min: 0,
      max: 10,
      step: 0.001,
    })

    this.debugFolder.addBinding(this.sunLight.position, "x", {
      label: "Sun X",
      min: -5,
      max: 5,
      step: 0.001,
    })

    this.debugFolder.addBinding(this.sunLight.position, "y", {
      label: "Sun Y",
      min: -5,
      max: 5,
      step: 0.001,
    })

    this.debugFolder.addBinding(this.sunLight.position, "z", {
      label: "Sun Z",
      min: -5,
      max: 5,
      step: 0.001,
    })

    this.debugFolder.addBinding(this.ambientLight, "intensity", {
      label: "Ambient intensity",
      min: 0,
      max: 10,
      step: 0.001,
    })

    this.debugFolder
      .addBinding(this.debugParams, "sunLightColor", { label: "sunLightColor" })
      .on("change", (e) => {
        this.sunLight.color.set(e.value)
      })

    this.debugFolder
      .addBinding(this.debugParams, "ambientLightColor", {
        label: "ambientLightColor",
      })
      .on("change", (e) => {
        this.ambientLight.color.set(e.value)
      })
  }
}
