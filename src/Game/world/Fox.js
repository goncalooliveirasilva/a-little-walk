import * as THREE from "three"
import Game from "../Game"

export default class Fox {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources
    this.time = this.game.time
    this.debug = this.game.debug

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

  update() {
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}
