export default class Input {
  constructor() {
    this.keys = {}

    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true
    })

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false
    })
  }

  isPressed(code) {
    return !!this.keys[code]
  }

  get forward() {
    return this.isPressed("KeyW") || this.isPressed("ArrowUp")
  }

  get backward() {
    return this.isPressed("KeyS") || this.isPressed("ArrowDown")
  }

  get left() {
    return this.isPressed("KeyA") || this.isPressed("ArrowLeft")
  }

  get right() {
    return this.isPressed("KeyD") || this.isPressed("ArrowRight")
  }

  get shift() {
    return this.isPressed("ShiftLeft") || this.isPressed("ShiftRight")
  }

  get moving() {
    return this.forward || this.backward || this.left || this.right
  }
}
