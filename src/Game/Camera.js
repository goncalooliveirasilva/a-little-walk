import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Game from "./Game"

const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0

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
      if (isMobile) {
        this.setTouchControls()
      }
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

  setTouchControls() {
    const SENSITIVITY = 0.005
    let cameraTouch = null
    let pinchTouch = null

    window.addEventListener("touchstart", (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i]
        if (this.game.input._consumedTouchIds.has(touch.identifier)) continue
        if (!cameraTouch) {
          cameraTouch = {
            id: touch.identifier,
            lastX: touch.clientX,
            lastY: touch.clientY,
          }
          this.game.input._consumedTouchIds.add(touch.identifier)
        } else if (!pinchTouch) {
          pinchTouch = {
            id: touch.identifier,
            lastX: touch.clientX,
            lastY: touch.clientY,
          }
          this.game.input._consumedTouchIds.add(touch.identifier)
          this._lastPinchDist = Math.hypot(
            cameraTouch.lastX - pinchTouch.lastX,
            cameraTouch.lastY - pinchTouch.lastY,
          )
        }
      }
    })

    window.addEventListener(
      "touchmove",
      (e) => {
        if (!cameraTouch) return

        if (pinchTouch) {
          let ct, pt
          for (let i = 0; i < e.touches.length; i++) {
            const t = e.touches[i]
            if (t.identifier === cameraTouch.id) ct = t
            if (t.identifier === pinchTouch.id) pt = t
          }
          if (ct && pt) {
            const dist = Math.hypot(
              ct.clientX - pt.clientX,
              ct.clientY - pt.clientY,
            )
            if (this._lastPinchDist !== undefined) {
              const delta = this._lastPinchDist - dist
              this.spherical.distance = Math.max(
                this.spherical.minDistance,
                Math.min(
                  this.spherical.maxDistance,
                  this.spherical.distance + delta * 0.05,
                ),
              )
            }
            this._lastPinchDist = dist
            cameraTouch.lastX = ct.clientX
            cameraTouch.lastY = ct.clientY
            pinchTouch.lastX = pt.clientX
            pinchTouch.lastY = pt.clientY
          }
          return
        }

        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i]
          if (touch.identifier === cameraTouch.id) {
            const dx = touch.clientX - cameraTouch.lastX
            const dy = touch.clientY - cameraTouch.lastY
            this.spherical.theta -= dx * SENSITIVITY
            this.spherical.phi = Math.max(
              this.spherical.minPhi,
              Math.min(
                this.spherical.maxPhi,
                this.spherical.phi - dy * SENSITIVITY,
              ),
            )
            cameraTouch.lastX = touch.clientX
            cameraTouch.lastY = touch.clientY
          }
        }
      },
      { passive: true },
    )

    const onTouchEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i]
        if (cameraTouch && touch.identifier === cameraTouch.id) {
          this.game.input._consumedTouchIds.delete(cameraTouch.id)
          cameraTouch = pinchTouch
          pinchTouch = null
          this._lastPinchDist = undefined
        } else if (pinchTouch && touch.identifier === pinchTouch.id) {
          this.game.input._consumedTouchIds.delete(pinchTouch.id)
          pinchTouch = null
          this._lastPinchDist = undefined
        }
      }
    }

    window.addEventListener("touchend", onTouchEnd)
    window.addEventListener("touchcancel", onTouchEnd)
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
