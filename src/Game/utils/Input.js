const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0

export default class Input {
  constructor() {
    this.keys = {}
    this._touch = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      shift: false,
    }
    this._consumedTouchIds = new Set()
    this._joystickTouchId = null
    this._runBtnTouchId = null

    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true
    })

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false
    })

    if (isMobile) {
      this._setupJoystick()
      this._setupRunButton()
    }
  }

  _setupJoystick() {
    const RADIUS = 45

    const zone = document.createElement("div")
    zone.id = "joystick-zone"
    document.body.appendChild(zone)

    const base = document.createElement("div")
    base.id = "joystick-base"
    zone.appendChild(base)

    const thumb = document.createElement("div")
    thumb.id = "joystick-thumb"
    base.appendChild(thumb)

    let center = { x: 0, y: 0 }

    zone.addEventListener(
      "touchstart",
      (e) => {
        if (this._joystickTouchId !== null) return
        const touch = e.changedTouches[0]
        this._joystickTouchId = touch.identifier
        this._consumedTouchIds.add(touch.identifier)
        const rect = base.getBoundingClientRect()
        center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        }
        e.preventDefault()
      },
      { passive: false },
    )

    window.addEventListener(
      "touchmove",
      (e) => {
        if (this._joystickTouchId === null) return
        let touch = null
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === this._joystickTouchId) {
            touch = e.changedTouches[i]
            break
          }
        }
        if (!touch) return

        const dx = touch.clientX - center.x
        const dy = touch.clientY - center.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const clamped = Math.min(dist, RADIUS)
        const angle = Math.atan2(dy, dx)

        thumb.style.transform = `translate(${Math.cos(angle) * clamped}px, ${Math.sin(angle) * clamped}px)`

        const nx = dx / Math.max(dist, 1)
        const ny = dy / Math.max(dist, 1)

        this._touch.forward = ny < -0.3
        this._touch.backward = ny > 0.3
        this._touch.left = nx < -0.3
        this._touch.right = nx > 0.3

        e.preventDefault()
      },
      { passive: false },
    )

    const endJoystick = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this._joystickTouchId) {
          this._consumedTouchIds.delete(this._joystickTouchId)
          this._joystickTouchId = null
          this._touch.forward = false
          this._touch.backward = false
          this._touch.left = false
          this._touch.right = false
          thumb.style.transform = "translate(0px, 0px)"
          return
        }
      }
    }

    window.addEventListener("touchend", endJoystick)
    window.addEventListener("touchcancel", endJoystick)
  }

  _setupRunButton() {
    const btn = document.createElement("div")
    btn.id = "run-button"
    btn.textContent = "RUN"
    document.body.appendChild(btn)

    btn.addEventListener(
      "touchstart",
      (e) => {
        if (this._runBtnTouchId !== null) return
        const touch = e.changedTouches[0]
        this._runBtnTouchId = touch.identifier
        this._consumedTouchIds.add(touch.identifier)
        this._touch.shift = true
        btn.classList.add("active")
        e.preventDefault()
      },
      { passive: false },
    )

    const endRun = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this._runBtnTouchId) {
          this._consumedTouchIds.delete(this._runBtnTouchId)
          this._runBtnTouchId = null
          this._touch.shift = false
          btn.classList.remove("active")
          return
        }
      }
    }

    btn.addEventListener("touchend", endRun)
    btn.addEventListener("touchcancel", endRun)
  }

  isPressed(code) {
    return !!this.keys[code]
  }

  get forward() {
    return (
      this._touch.forward || this.isPressed("KeyW") || this.isPressed("ArrowUp")
    )
  }

  get backward() {
    return (
      this._touch.backward ||
      this.isPressed("KeyS") ||
      this.isPressed("ArrowDown")
    )
  }

  get left() {
    return (
      this._touch.left || this.isPressed("KeyA") || this.isPressed("ArrowLeft")
    )
  }

  get right() {
    return (
      this._touch.right ||
      this.isPressed("KeyD") ||
      this.isPressed("ArrowRight")
    )
  }

  get shift() {
    return (
      this._touch.shift ||
      this.isPressed("ShiftLeft") ||
      this.isPressed("ShiftRight")
    )
  }

  get moving() {
    return this.forward || this.backward || this.left || this.right
  }
}
