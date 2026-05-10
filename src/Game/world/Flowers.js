import * as THREE from "three"
import Game from "../Game"
import vertexShader from "../shaders/flowers/vertex.glsl"
import fragmentShader from "../shaders/flowers/fragment.glsl"

export default class Flowers {
  constructor(groups) {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources

    this.materials = []

    for (const group of groups) {
      this.createGroup(group)
    }
  }

  setGeometry(size) {
    const geometry = new THREE.PlaneGeometry(size, size)
    geometry.rotateX(-Math.PI / 2)
    return geometry
  }

  setMaterial(textureName, color) {
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uTexture: { value: this.resources.items[textureName] },
          uNoiseTexture: { value: this.resources.items.perlinTexture },
          uWindStrength: { value: 0.3 },
          uWindSpeed: { value: 0.06 },
        },
      ]),
      transparent: true,
      fog: true,
    })

    this.materials.push(material)
    return material
  }

  createGroup({ texture, color = "#ffffff", positions, size = 0.5, y = 0.05 }) {
    if (!positions.length) return

    const geometry = this.setGeometry(size)
    const material = this.setMaterial(texture, color)
    const mesh = new THREE.InstancedMesh(geometry, material, positions.length)

    const matrix = new THREE.Matrix4()
    for (let i = 0; i < positions.length; i++) {
      const { x, z, scale = 1 } = positions[i]
      matrix.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
        ),
        new THREE.Vector3(scale, scale, scale),
      )
      mesh.setMatrixAt(i, matrix)
    }

    this.scene.add(mesh)
  }

  update() {
    const elapsed = this.game.time.elapsed * 0.001
    for (const material of this.materials) {
      material.uniforms.uTime.value = elapsed
    }
  }

  setDebug() {}
}
