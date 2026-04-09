import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Game from "./Game"

export default class Camera {
  constructor() {
    this.game = new Game()
    this.sizes = this.game.sizes
    this.scene = this.game.scene
    this.canvas = this.game.canvas
    this.debug = this.game.debug

    // Third-person camera (spherical coordinates around target)
    this.spherical = {
      theta: 0.31, // horizontal angle
      phi: 1.35, // vertical angle (radians from top, clamped)
      distance: 15.2, // distance from target
      minDistance: 8,
      maxDistance: 25,
      minPhi: 0.7, // don't go too high
      maxPhi: 1.5, // don't go below ground
    }
    this.mouseSensitivity = 0.003
    this.zoomSpeed = 1
    this.followSmoothing = 5
    this.currentLookAt = new THREE.Vector3()
    this.isMouseDown = false

    this.setInstance()

    if (this.debug.active) {
      this.setOrbitControls()
    } else {
      this.setMouseControls()
    }
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100,
    )
    this.instance.position.set(0, 5, 10)
    this.scene.add(this.instance)
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
  }

  setMouseControls() {
    // Click to lock pointer
    this.canvas.addEventListener("click", () => {
      this.canvas.requestPointerLock().catch(() => {})
    })

    // Mouse movement controls camera rotation (only when locked)
    window.addEventListener("mousemove", (e) => {
      if (document.pointerLockElement !== this.canvas) return

      this.spherical.theta -= e.movementX * this.mouseSensitivity
      this.spherical.phi = Math.max(
        this.spherical.minPhi,
        Math.min(
          this.spherical.maxPhi,
          this.spherical.phi - e.movementY * this.mouseSensitivity,
        ),
      )
    })

    // Scroll to zoom
    this.canvas.addEventListener("wheel", (e) => {
      this.spherical.distance = Math.max(
        this.spherical.minDistance,
        Math.min(
          this.spherical.maxDistance,
          this.spherical.distance + e.deltaY * 0.01 * this.zoomSpeed,
        ),
      )
    })
  }

  setTarget(target) {
    this.target = target
    this.currentLookAt.copy(target.position)
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  updateFollow(delta) {
    if (!this.target) return

    // Convert spherical to cartesian offset
    const { theta, phi, distance } = this.spherical
    const offset = new THREE.Vector3(
      distance * Math.sin(phi) * Math.sin(theta),
      distance * Math.cos(phi),
      distance * Math.sin(phi) * Math.cos(theta),
    )

    // Desired position = target + offset
    const desiredPosition = this.target.position.clone().add(offset)

    // Smooth follow
    this.instance.position.lerp(desiredPosition, this.followSmoothing * delta)

    // Smooth look-at
    this.currentLookAt.lerp(this.target.position, this.followSmoothing * delta)
    this.instance.lookAt(this.currentLookAt)
  }

  update() {
    if (this.debug.active) {
      this.controls.update()
    } else {
      this.updateFollow(this.game.time.delta * 0.001)
    }
  }
}
