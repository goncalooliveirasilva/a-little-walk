import * as THREE from "three"
import { clone } from "three/addons/utils/SkeletonUtils.js"
import Game from "../Game"

const BIRD_COUNT = 12
const MAX_SPEED = 4
const OFFSET_RADIUS = 4 // how far each bird drifts from the flock center

export default class Birds {
  constructor(config = {}) {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources

    this.count = config.count ?? BIRD_COUNT
    this.origin = new THREE.Vector3(config.x ?? 0, config.y ?? 8, config.z ?? 0)
    this.attractorAngle = 0
    this.attractor = this.origin.clone()

    this.birds = []
    this.setBirds()
  }

  setBirds() {
    const resource = this.resources.items.birdModel
    if (!resource) return

    const clip = resource.animations[0] ?? null

    for (let i = 0; i < this.count; i++) {
      const model = clone(resource.scene)
      model.scale.setScalar(0.1)

      const pos = new THREE.Vector3(
        this.origin.x + (Math.random() - 0.5) * 8,
        this.origin.y + (Math.random() - 0.5) * 4,
        this.origin.z + (Math.random() - 0.5) * 8,
      )
      model.position.copy(pos)

      const vel = new THREE.Vector3(
        Math.random() - 0.5,
        (Math.random() - 0.5) * 0.2,
        Math.random() - 0.5,
      )
        .normalize()
        .multiplyScalar(MAX_SPEED)

      const offsetAngle = Math.random() * Math.PI * 2
      const dip = { offset: 0, timer: Math.random() * 5 }

      let mixer = null
      if (clip) {
        mixer = new THREE.AnimationMixer(model)
        mixer.clipAction(clip).play()
        mixer.setTime(Math.random() * clip.duration)
      }

      this.scene.add(model)
      this.birds.push({ model, mixer, pos, vel, offsetAngle, dip })
    }
  }

  update() {
    const delta = this.game.time.delta * 0.001

    this.attractorAngle += delta * 0.15
    this.attractor.set(
      this.origin.x + Math.cos(this.attractorAngle) * 45,
      this.origin.y + Math.sin(this.attractorAngle * 0.4) * 3,
      this.origin.z + Math.sin(this.attractorAngle) * 45,
    )

    for (const bird of this.birds) {
      // Occasionally dip lower for a few seconds
      bird.dip.timer -= delta
      if (bird.dip.timer <= 0) {
        bird.dip.offset = Math.random() < 0.4 ? -(Math.random() * 3 + 1) : 0
        bird.dip.timer = 3 + Math.random() * 5
      }

      bird.offsetAngle += delta * (0.2 + Math.random() * 0.1)
      const target = new THREE.Vector3(
        this.attractor.x + Math.cos(bird.offsetAngle) * OFFSET_RADIUS,
        this.attractor.y +
          Math.sin(bird.offsetAngle * 0.7) * OFFSET_RADIUS * 0.5 +
          bird.dip.offset,
        this.attractor.z + Math.sin(bird.offsetAngle) * OFFSET_RADIUS,
      )

      const toTarget = new THREE.Vector3()
        .subVectors(target, bird.pos)
        .normalize()
      bird.vel.lerp(toTarget.multiplyScalar(MAX_SPEED), delta * 2)
      bird.vel.clampLength(MAX_SPEED * 0.5, MAX_SPEED)

      bird.pos.addScaledVector(bird.vel, delta)
      bird.model.position.copy(bird.pos)

      // Face direction of travel
      if (bird.vel.lengthSq() > 0.01) {
        const yaw = Math.atan2(bird.vel.x, bird.vel.z) + Math.PI
        const hSpeed = Math.sqrt(bird.vel.x ** 2 + bird.vel.z ** 2)
        const pitch = Math.atan2(-bird.vel.y, hSpeed)
        bird.model.rotation.set(pitch, yaw, 0, "YXZ")
      }

      if (bird.mixer) bird.mixer.update(delta)
    }
  }
}
