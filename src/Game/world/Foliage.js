import * as THREE from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import foliageVertexShader from "../shaders/foliage/vertex.glsl"
import foliageFragmentShader from "../shaders/foliage/fragment.glsl"

export default class Foliage {
  constructor({
    planeCount = 30,
    planeSize = 1.5,
    minRadius = 0.3,
    maxRadius = 1.0,
    color = "#4db34d",
    texture = null,
    noiseTexture = null,
    windStrength = 1,
    windSpeed = 0.06,
  }) {
    this.planeCount = planeCount
    this.planeSize = planeSize
    this.minRadius = minRadius
    this.maxRadius = maxRadius
    this.color = color
    this.texture = texture
    this.noiseTexture = noiseTexture
    this.windStrength = windStrength
    this.windSpeed = windSpeed

    this.setGeometry()
    this.setMaterial()
  }

  setGeometry() {
    const planes = []

    for (let i = 0; i < this.planeCount; i++) {
      const plane = new THREE.PlaneGeometry(this.planeSize, this.planeSize)

      const spherical = new THREE.Spherical(
        this.minRadius + Math.random() * (this.maxRadius - this.minRadius),
        Math.PI * 2 * Math.random(),
        Math.PI * Math.random(),
      )
      const position = new THREE.Vector3().setFromSpherical(spherical)

      const normal = position.clone().normalize()
      const quaternion = new THREE.Quaternion()
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
      plane.applyQuaternion(quaternion)

      plane.rotateZ(Math.random() * Math.PI * 2)
      plane.translate(position.x, position.y, position.z)

      planes.push(plane)
    }

    this.geometry = mergeGeometries(planes)
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: foliageVertexShader,
      fragmentShader: foliageFragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uColor: { value: new THREE.Color(this.color) },
        uAlphaMap: { value: this.texture },
        uAlphaTest: { value: 0.5 },
        uTime: { value: 0 },
        uNoiseTexture: { value: this.noiseTexture },
        uWindStrength: { value: this.windStrength },
        uWindSpeed: { value: this.windSpeed },
      },
    })
  }

  update(elapsedTime) {
    this.material.uniforms.uTime.value = elapsedTime
  }
}
