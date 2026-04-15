import * as THREE from "three"
import Game from "../Game"
import vertexShader from "../shaders/sky/vertex.glsl"
import fragmentShader from "../shaders/sky/fragment.glsl"

export default class Sky {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.debug = this.game.debug

    this.params = {
      topColor: "#6ec5ff",
      horizonColor: "#ffb36b",
      horizonStart: -0.05,
      horizonEnd: 0.35,
      radius: 90,
    }

    this.setMesh()
    this.setDebug()
  }

  setMesh() {
    this.geometry = new THREE.SphereGeometry(this.params.radius, 32, 16)

    this.uniforms = {
      uTopColor: { value: new THREE.Color(this.params.topColor) },
      uHorizonColor: { value: new THREE.Color(this.params.horizonColor) },
      uHorizonStart: { value: this.params.horizonStart },
      uHorizonEnd: { value: this.params.horizonEnd },
    }

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  update() {
    // Keep the dome centered on the camera
    // so the horizon is always around the viewer
    const cam = this.game.camera.instance
    this.mesh.position.x = cam.position.x
    this.mesh.position.z = cam.position.z
  }

  setDebug() {
    if (!this.debug.active) return

    const folder = this.game.debugFolder.addFolder({
      title: "Sky",
      expanded: false,
    })

    folder
      .addBinding(this.params, "topColor", { label: "Top color" })
      .on("change", (e) => this.uniforms.uTopColor.value.set(e.value))

    folder
      .addBinding(this.params, "horizonColor", { label: "Horizon color" })
      .on("change", (e) => this.uniforms.uHorizonColor.value.set(e.value))

    folder
      .addBinding(this.params, "horizonStart", {
        label: "Horizon start",
        min: -1,
        max: 1,
        step: 0.01,
      })
      .on("change", (e) => {
        this.uniforms.uHorizonStart.value = e.value
      })

    folder
      .addBinding(this.params, "horizonEnd", {
        label: "Horizon end",
        min: -1,
        max: 1,
        step: 0.01,
      })
      .on("change", (e) => {
        this.uniforms.uHorizonEnd.value = e.value
      })
  }
}
