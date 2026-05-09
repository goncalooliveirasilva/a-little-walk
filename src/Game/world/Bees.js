import * as THREE from "three"
import Game from "../Game"

const MAX_SPEED = 2.5

export default class Bees {
  constructor({ x, z, radius = 3, count = 30, y = 1.5 }) {
    this.game = new Game()
    this.scene = this.game.scene

    this.center = new THREE.Vector3(x, y, z)
    this.radius = radius
    this.count = count
    this.time = 0

    this.beeData = []
    this.setBees()
  }

  randomTarget() {
    const angle = Math.random() * Math.PI * 2
    const r = Math.sqrt(Math.random()) * this.radius
    return new THREE.Vector3(
      this.center.x + Math.cos(angle) * r,
      this.center.y,
      this.center.z + Math.sin(angle) * r,
    )
  }

  setBees() {
    const positions = new Float32Array(this.count * 3)
    const colors = new Float32Array(this.count * 3)

    const yellow = new THREE.Color("#ffcc00")
    const black = new THREE.Color("#111111")

    for (let i = 0; i < this.count; i++) {
      const pos = this.randomTarget()
      const vel = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5)
        .normalize()
        .multiplyScalar(MAX_SPEED)
      const wobbleOffset = Math.random() * Math.PI * 2

      positions[i * 3 + 0] = pos.x
      positions[i * 3 + 1] = pos.y
      positions[i * 3 + 2] = pos.z

      const c = Math.random() < 0.3 ? black : yellow
      colors[i * 3 + 0] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      const yOffset = (Math.random() - 0.5) * 0.6
      this.beeData.push({
        pos,
        vel,
        target: this.randomTarget(),
        wobbleOffset,
        yOffset,
      })
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    this.points = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: 0.15,
        sizeAttenuation: true,
        vertexColors: true,
      }),
    )
    this.scene.add(this.points)
  }

  update() {
    const delta = this.game.time.delta * 0.001
    this.time += delta

    const positions = this.points.geometry.attributes.position.array

    for (let i = 0; i < this.beeData.length; i++) {
      const bee = this.beeData[i]

      if (bee.pos.distanceTo(bee.target) < 0.5) {
        bee.target = this.randomTarget()
      }

      const toTarget = new THREE.Vector3()
        .subVectors(bee.target, bee.pos)
        .setY(0)
        .normalize()
      bee.vel.lerp(toTarget.multiplyScalar(MAX_SPEED), delta * 3)
      bee.vel.clampLength(MAX_SPEED * 0.3, MAX_SPEED)

      bee.pos.x += bee.vel.x * delta
      bee.pos.z += bee.vel.z * delta
      bee.pos.y =
        this.center.y +
        bee.yOffset +
        Math.sin(this.time * 4 + bee.wobbleOffset) * 0.25

      positions[i * 3 + 0] = bee.pos.x
      positions[i * 3 + 1] = bee.pos.y
      positions[i * 3 + 2] = bee.pos.z
    }

    this.points.geometry.attributes.position.needsUpdate = true
  }
}
