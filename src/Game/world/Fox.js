import * as THREE from "three"
import Game from "../Game"

export default class Fox {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources
    this.time = this.game.time
    this.input = this.game.input
    this.debug = this.game.debug

    // Movement
    this.walkSpeed = 2
    this.runSpeed = 5
    this.rotationSpeed = 5
    this.direction = new THREE.Vector3()
    this.currentState = "idle"

    // Setup
    this.resource = this.resources.items.foxModel
    this.setModel()
    this.setAnimation()

    // Debug
    this.setDebug()
  }

  setModel() {
    this.model = this.resource.scene
    this.model.scale.set(0.02, 0.02, 0.02)

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
      }
    })

    this.scene.add(this.model)
  }

  setAnimation() {
    this.animation = {}
    this.animation.mixer = new THREE.AnimationMixer(this.model)

    this.animation.actions = {}

    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.resource.animations[0],
    )
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.resource.animations[1],
    )
    this.animation.actions.running = this.animation.mixer.clipAction(
      this.resource.animations[2],
    )

    this.animation.actions.current = this.animation.actions.idle
    this.animation.actions.current.play()

    this.animation.play = (name) => {
      const newAction = this.animation.actions[name]
      const oldAction = this.animation.actions.current

      newAction.reset()
      newAction.play()
      newAction.crossFadeFrom(oldAction, 1)
      this.animation.actions.current = newAction
    }
  }

  setDebug() {
    if (!this.debug.active) return

    this.debugFolder = this.game.debugFolder.addFolder({
      title: "Fox",
      expanded: false,
    })

    const debugObject = {
      playIdle: () => this.animation.play("idle"),
      playWalking: () => this.animation.play("walking"),
      playRunning: () => this.animation.play("running"),
    }

    this.debugFolder
      .addButton({ title: "Play Idle" })
      .on("click", debugObject.playIdle)
    this.debugFolder
      .addButton({ title: "Play Walking" })
      .on("click", debugObject.playWalking)
    this.debugFolder
      .addButton({ title: "Play Running" })
      .on("click", debugObject.playRunning)
  }

  updateMovement(delta) {
    // Movement direction
    this.direction.set(0, 0, 0)
    if (this.input.forward) this.direction.z -= 1
    if (this.input.backward) this.direction.z += 1
    if (this.input.left) this.direction.x -= 1
    if (this.input.right) this.direction.x += 1

    if (this.input.moving) {
      this.direction.normalize()

      const isRunning = this.input.shift
      const speed = isRunning ? this.runSpeed : this.walkSpeed

      // Move
      this.model.position.addScaledVector(this.direction, speed * delta)

      // Rotate to face movement direction
      const targetAngle = Math.atan2(this.direction.x, this.direction.z)
      const angleDiff = this.shortestAngle(this.model.rotation.y, targetAngle)
      this.model.rotation.y += angleDiff * this.rotationSpeed * delta

      // Switch animation
      const targetState = isRunning ? "running" : "walking"
      if (this.currentState !== targetState) {
        this.animation.play(targetState)
        this.currentState = targetState
      }
    } else if (this.currentState !== "idle") {
      this.animation.play("idle")
      this.currentState = "idle"
    }
  }

  shortestAngle(from, to) {
    let diff = to - from
    while (diff > Math.PI) diff -= Math.PI * 2
    while (diff < -Math.PI) diff += Math.PI * 2
    return diff
  }

  update() {
    const delta = this.time.delta * 0.001
    this.updateMovement(delta)
    this.animation.mixer.update(delta)
  }
}
