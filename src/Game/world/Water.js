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

    this.depthColor = "#1794e5"
    this.surfaceColor = "#8dc7ed"

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
    this.setDebug()
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(35, 35, 512, 512)
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uBigWavesElevation: { value: 0.125 },
        uBigWavesFrequency: { value: new THREE.Vector2(1.15, 1.91) },
        uTime: { value: 0 },
        uBigWavesSpeed: { value: 0.52 },
        uDepthColor: { value: new THREE.Color(this.depthColor) },
        uSurfaceColor: { value: new THREE.Color(this.surfaceColor) },
        uColorOffset: { value: 0.1 },
        uColorMultiplier: { value: 5 },
        uSmallWavesElevation: { value: 0.18 },
        uSmallWavesFrequency: { value: 1.5 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },
      },
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    // this.mesh.position.y = 5
    this.mesh.position.set(-33.5, -1.5, 31)
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

    this.debugFolder.addBinding(
      this.material.uniforms.uSmallWavesElevation,
      "value",
      { label: "uSmallWavesElevation", min: 0, max: 1, step: 0.001 },
    )

    this.debugFolder.addBinding(
      this.material.uniforms.uSmallWavesFrequency,
      "value",
      { label: "uSmallWavesFrequency", min: 0, max: 30, step: 0.001 },
    )

    this.debugFolder.addBinding(
      this.material.uniforms.uSmallWavesSpeed,
      "value",
      { label: "uSmallWavesSpeed", min: 0, max: 4, step: 0.001 },
    )

    this.debugFolder.addBinding(
      this.material.uniforms.uSmallIterations,
      "value",
      { label: "uSmallIterations", min: 0, max: 8, step: 1 },
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
