import * as THREE from "three"
import Game from "../Game"
import vertexShader from "../shaders/grass/vertex.glsl"
import fragmentShader from "../shaders/grass/fragment.glsl"

export default class Grass {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.debug = this.game.debug
    this.time = this.game.time

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
    this.setDebug()
  }

  setGeometry() {
    this.subdivisions = 400
    this.size = 70
    this.count = this.subdivisions * this.subdivisions
    this.cellSize = this.size / this.subdivisions

    const positions = new Float32Array(this.count * 3 * 2)
    // 1 random value per vertex, 3 vertices per blade
    const randoms = new Float32Array(this.count * 3)

    for (let iX = 0; iX < this.subdivisions; iX++) {
      for (let iZ = 0; iZ < this.subdivisions; iZ++) {
        // Index of this blade
        const i = iX * this.subdivisions + iZ

        // Center of this grid cell
        const x =
          (iX / this.subdivisions - 0.5) * this.size + this.cellSize * 0.5
        const z =
          (iZ / this.subdivisions - 0.5) * this.size + this.cellSize * 0.5

        // Add random offset
        const bladeX = x + (Math.random() - 0.5) * this.cellSize
        const bladeZ = z + (Math.random() - 0.5) * this.cellSize

        const i6 = i * 6
        positions[i6] = bladeX
        positions[i6 + 1] = bladeZ
        positions[i6 + 2] = bladeX
        positions[i6 + 3] = bladeZ
        positions[i6 + 4] = bladeX
        positions[i6 + 5] = bladeZ

        // Random value for all 3 vertices of this blade
        const random = Math.random()
        const i3 = i * 3
        randoms[i3] = random
        randoms[i3 + 1] = random
        randoms[i3 + 2] = random
      }
    }

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 2),
    )
    this.geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1))

    // Manual bounding sphere
    this.geometry.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(),
      this.size,
    )
  }

  setMaterial() {
    this.noiseTexture = this.game.resources.items.perlinTexture
    this.noiseTexture.wrapS = THREE.RepeatWrapping
    this.noiseTexture.wrapT = THREE.RepeatWrapping

    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          uBladeWidth: { value: 0.1 },
          uBladeHeight: { value: 0.6 },
          uBaseColor: { value: new THREE.Color(0.1, 0.3, 0.1) },
          uTipColor: { value: new THREE.Color(0.3, 0.7, 0.3) },
          uTime: { value: 0 },
          uNoiseTexture: { value: this.noiseTexture },
          uWindStrength: { value: 0.5 },
          uWindSpeed: { value: 0.06 },
          uColorVariation: { value: 0.4 },
          uPlayerPosition: { value: new THREE.Vector2(0, 0) },
          uGrassSize: { value: this.size },
        },
      ]),
      vertexShader,
      fragmentShader,
      fog: true,
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsed * 0.001
    this.material.uniforms.uPlayerPosition.value.set(
      this.game.world.fox.model.position.x,
      this.game.world.fox.model.position.z,
    )
  }

  setDebug() {
    if (!this.debug.active) return

    this.debugParams = {
      baseColor: "#1a4d1a",
      tipColor: "#4db34d",
    }

    this.debugFolder = this.game.debugFolder.addFolder({
      title: "Grass",
      expanded: false,
    })

    this.debugFolder.addBinding(this.material.uniforms.uBladeWidth, "value", {
      label: "Blade width",
      min: 0.01,
      max: 0.5,
      step: 0.01,
    })

    this.debugFolder.addBinding(this.material.uniforms.uBladeHeight, "value", {
      label: "Blade height",
      min: 0.1,
      max: 2.0,
      step: 0.01,
    })

    this.debugFolder
      .addBinding(this.debugParams, "baseColor", { label: "Base color" })
      .on("change", (e) => {
        this.material.uniforms.uBaseColor.value.set(e.value)
      })

    this.debugFolder
      .addBinding(this.debugParams, "tipColor", { label: "Tip color" })
      .on("change", (e) => {
        this.material.uniforms.uTipColor.value.set(e.value)
      })

    this.debugFolder.addBinding(
      this.material.uniforms.uColorVariation,
      "value",
      {
        label: "Color variation",
        min: 0,
        max: 0.5,
        step: 0.01,
      },
    )

    this.debugFolder.addBinding(this.material.uniforms.uWindStrength, "value", {
      label: "Wind strength",
      min: 0,
      max: 2.0,
      step: 0.01,
    })

    this.debugFolder.addBinding(this.material.uniforms.uWindSpeed, "value", {
      label: "Wind speed",
      min: 0,
      max: 1.0,
      step: 0.01,
    })
  }
}
