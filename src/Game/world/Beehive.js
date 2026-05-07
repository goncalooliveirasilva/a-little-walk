import * as THREE from "three"
import Game from "../Game"

const HANG_HEIGHT = 4
const FOLLOW_THRESHOLD = 5

export default class Beehive {
  constructor({ x, z, y = HANG_HEIGHT, offsetX = 0, offsetZ = 0, scale = 1 }) {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources

    this.beeCount = 50
    this.swarm_radius = 1

    this.position = new THREE.Vector3(x + offsetX, y, z + offsetZ)
    this.swarmCenter = this.position.clone()
    this.followBlend = 0
    this.scale = scale

    this.setModel()
    this.setBees()
  }

  setModel() {
    const resource = this.resources.items.beehiveModel
    if (!resource) return

    this.model = resource.scene.clone()
    this.model.position.copy(this.position)
    this.model.scale.set(this.scale, this.scale, this.scale)
    this.scene.add(this.model)
  }

  setBees() {
    const positions = new Float32Array(this.beeCount * 3)
    const colors = new Float32Array(this.beeCount * 3)

    const yellow = new THREE.Color("#ffcc00")
    const black = new THREE.Color("#111111")

    this.beeData = []
    for (let i = 0; i < this.beeCount; i++) {
      const r = 0.3 + Math.random() * this.swarm_radius
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const speed = 0.8 + Math.random() * 3
      const wobbleAngle = Math.random() * Math.PI * 2
      const wobbleSpeed = 1.5 + Math.random() * 2
      this.beeData.push({ r, theta, phi, speed, wobbleAngle, wobbleSpeed })

      positions[i * 3 + 0] =
        this.position.x + r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = this.position.y + r * Math.cos(phi)
      positions[i * 3 + 2] =
        this.position.z + r * Math.sin(phi) * Math.sin(theta)

      // 30% chance of being black
      const c = Math.random() < 0.3 ? black : yellow
      colors[i * 3 + 0] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      vertexColors: true,
    })

    this.bees = new THREE.Points(geometry, material)
    this.scene.add(this.bees)
  }

  update() {
    const delta = this.game.time.delta * 0.001

    // Blend swarm center toward fox when close enough
    const fox = this.game?.world?.fox?.model
    if (fox) {
      const dist = fox.position.distanceTo(this.position)
      const targetBlend = Math.max(0, 1 - dist / FOLLOW_THRESHOLD)
      this.followBlend = THREE.MathUtils.lerp(
        this.followBlend,
        targetBlend,
        delta * 3,
      )
      this.swarmCenter.lerpVectors(
        this.position,
        fox.position,
        this.followBlend,
      )
    }

    const positions = this.bees.geometry.attributes.position.array

    for (let i = 0; i < this.beeData.length; i++) {
      const bee = this.beeData[i]

      bee.theta += delta * bee.speed
      bee.wobbleAngle += delta * bee.wobbleSpeed

      positions[i * 3 + 0] =
        this.swarmCenter.x + bee.r * Math.sin(bee.phi) * Math.cos(bee.theta)
      positions[i * 3 + 1] =
        this.swarmCenter.y +
        bee.r * Math.cos(bee.phi) +
        Math.sin(bee.wobbleAngle) * 0.15
      positions[i * 3 + 2] =
        this.swarmCenter.z + bee.r * Math.sin(bee.phi) * Math.sin(bee.theta)
    }

    this.bees.geometry.attributes.position.needsUpdate = true
  }
}
