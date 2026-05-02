import * as THREE from "three"
import Game from "../Game"
import vertexShader from "../shaders/water/vertex.glsl"
import fragmentShader from "../shaders/water/fragment.glsl"

export default class Water {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.time = this.game.time
    this.debug = this.game.debug

    this.depthColor = "#0000ff"
    this.surfaceColor = "#8888ff"

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
    this.setDebug()
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(20, 20, 128, 128)
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uTime: { value: 0 },
        uBigWavesSpeed: { value: 0.75 },
        uDepthColor: { value: new THREE.Color(this.depthColor) },
        uSurfaceColor: { value: new THREE.Color(this.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
      },
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.position.y = 5
    this.scene.add(this.mesh)
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsed * 0.001
  }

  setDebug() {
    if (!this.debug.active) return

    this.debugFolder = this.game.debugFolder.addFolder({
      title: "Water",
      expanded: false,
    })

    this.debugFolder.addBinding(
      this.material.uniforms.uBigWavesElevation,
      "value",
      {
        label: "uBigWavesElevation",
        min: 0,
        max: 1,
        step: 0.001,
      },
    )

    this.debugFolder.addBinding(
      this.material.uniforms.uBigWavesSpeed,
      "value",
      {
        label: "uBigWavesSpeed",
        min: 0,
        max: 5,
        step: 0.001,
      },
    )

    this.debugParams = {
      uBigWavesFrequencyX: this.material.uniforms.uBigWavesFrequency.value.x,
      uBigWavesFrequencyY: this.material.uniforms.uBigWavesFrequency.value.y,
      depthColor: this.depthColor,
      surfaceColor: this.surfaceColor,
    }

    this.debugFolder
      .addBinding(this.debugParams, "uBigWavesFrequencyX", {
        label: "uBigWavesFrequencyX",
        min: 0,
        max: 10,
        step: 0.001,
      })
      .on("change", (e) => {
        this.material.uniforms.uBigWavesFrequency.value.x = e.value
      })

    this.debugFolder
      .addBinding(this.debugParams, "uBigWavesFrequencyY", {
        label: "uBigWavesFrequencyY",
        min: 0,
        max: 10,
        step: 0.001,
      })
      .on("change", (e) => {
        this.material.uniforms.uBigWavesFrequency.value.y = e.value
      })

    this.debugFolder.addBinding(this.material.uniforms.uColorOffset, "value", {
      label: "uColorOffset",
      min: 0,
      max: 1,
      step: 0.001,
    })

    this.debugFolder.addBinding(
      this.material.uniforms.uColorMultiplier,
      "value",
      { label: "uColorMultiplier", min: 0, max: 10, step: 0.001 },
    )

    this.debugFolder
      .addBinding(this.debugParams, "depthColor", { label: "Depth Color" })
      .on("change", (e) => {
        this.material.uniforms.uDepthColor.value.set(e.value)
      })

    this.debugFolder
      .addBinding(this.debugParams, "surfaceColor", { label: "Surface Color" })
      .on("change", (e) => {
        this.material.uniforms.uSurfaceColor.value.set(e.value)
      })
  }
}
