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
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(4, 2, -1.25)
    this.scene.add(this.sunLight)
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight("#ffffff", 0.8)
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
