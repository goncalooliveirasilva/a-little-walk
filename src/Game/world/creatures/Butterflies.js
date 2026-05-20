import * as THREE from "three"
import { clone } from "three/addons/utils/SkeletonUtils.js"
import Game from "../../Game"

const MAX_SPEED = 1.5
const MODEL_NAMES = [
  "butterfly01Model",
  "butterfly02Model",
  "butterfly03Model",
  "butterfly04Model",
  "butterfly05Model",
]

export default class Butterflies {
  constructor({ x, z, radius = 6, count = 5, y = 1, scale = 1 }) {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources

    this.center = new THREE.Vector3(x, y, z)
    this.radius = radius
    this.count = count
    this.scale = scale
    this.time = 0

    this.butterflies = []
    this.setButterflies()
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

  setButterflies() {
    for (let i = 0; i < this.count; i++) {
      const modelName =
        MODEL_NAMES[Math.floor(Math.random() * MODEL_NAMES.length)]
      const resource = this.resources.items[modelName]
      if (!resource) continue

      const model = clone(resource.scene)
      model.scale.setScalar(this.scale)

      const pos = this.randomTarget()
      model.position.copy(pos)

      const vel = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5)
        .normalize()
        .multiplyScalar(MAX_SPEED)

      const wobbleOffset = Math.random() * Math.PI * 2
      const target = this.randomTarget()

      let mixer = null
      if (resource.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model)
        for (const clip of resource.animations) {
          mixer.clipAction(clip).play()
        }
        mixer.setTime(Math.random() * resource.animations[0].duration)
      }

      this.scene.add(model)
      this.butterflies.push({ model, mixer, pos, vel, target, wobbleOffset })
    }
  }

  update() {
    const delta = this.game.time.delta * 0.001
    this.time += delta

    for (const b of this.butterflies) {
      if (b.pos.distanceTo(b.target) < 0.6) {
        b.target = this.randomTarget()
      }

      const toTarget = new THREE.Vector3()
        .subVectors(b.target, b.pos)
        .setY(0)
        .normalize()
      b.vel.lerp(toTarget.multiplyScalar(MAX_SPEED), delta * 2)
      b.vel.clampLength(MAX_SPEED * 0.3, MAX_SPEED)

      b.pos.x += b.vel.x * delta
      b.pos.z += b.vel.z * delta
      b.pos.y = this.center.y + Math.sin(this.time * 3 + b.wobbleOffset) * 0.3

      b.model.position.copy(b.pos)

      if (b.vel.lengthSq() > 0.01) {
        const yaw = Math.atan2(b.vel.x, b.vel.z) + Math.PI
        b.model.rotation.set(0, yaw, 0)
      }

      if (b.mixer) b.mixer.update(delta)
    }
  }
}
