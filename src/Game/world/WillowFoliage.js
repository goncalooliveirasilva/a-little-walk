import * as THREE from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import vertexShader from "../shaders/willow/vertex.glsl"
import fragmentShader from "../shaders/willow/fragment.glsl"

export default class WillowFoliage {
  constructor({
    planeCount = 40,
    planeWidth = 0.4,
    planeHeight = 1.5,
    hangLength = 1.5,
    minRadius = 0.1,
    maxRadius = 0.5,
    color = "#7bc44c",
    colorDark = "#3a7a1e",
    texture = null,
    noiseTexture = null,
    windStrength = 1.5,
    windSpeed = 0.03,
    seed = 54321,
  }) {
    this.planeCount = planeCount
    this.planeWidth = planeWidth
    this.planeHeight = planeHeight
    this.hangLength = hangLength
    this.minRadius = minRadius
    this.maxRadius = maxRadius
    this.color = color
    this.colorDark = colorDark
    this.texture = texture
    this.noiseTexture = noiseTexture
    this.windStrength = windStrength
    this.windSpeed = windSpeed
    this.seed = seed

    this.setGeometry()
    this.setMaterial()
  }

  seededRandom() {
    this.seed = (this.seed * 16807 + 0) % 2147483647
    return (this.seed - 1) / 2147483646
  }

  setGeometry() {
    const planes = []

    for (let i = 0; i < this.planeCount; i++) {
      const plane = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight)

      const angle = this.seededRandom() * Math.PI * 2
      const radius =
        this.minRadius + this.seededRandom() * (this.maxRadius - this.minRadius)
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      // Hang downward from the cluster attachment point
      const y = -(this.seededRandom() * this.hangLength)

      // Random rotation
      const randomRotation = (this.seededRandom() - 0.5) * Math.PI
      plane.rotateY(angle + Math.PI * 0.5 + randomRotation)
      plane.translate(x, y, z)

      const rand = this.seededRandom()
      const randArray = new Float32Array(plane.attributes.position.count).fill(
        rand,
      )
      plane.setAttribute("aRandom", new THREE.BufferAttribute(randArray, 1))

      planes.push(plane)
    }

    this.geometry = mergeGeometries(planes)
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
        ...THREE.UniformsUtils.clone(THREE.UniformsLib.lights),
        uColor: { value: new THREE.Color(this.color) },
        uColorDark: { value: new THREE.Color(this.colorDark) },
        uTexture: { value: this.texture },
        uTime: { value: 0 },
        uNoiseTexture: { value: this.noiseTexture },
        uWindStrength: { value: this.windStrength },
        uWindSpeed: { value: this.windSpeed },
      },
      fog: true,
      lights: true,
    })
  }

  update(elapsedTime) {
    this.material.uniforms.uTime.value = elapsedTime
  }
}
