import Game from "../Game"

const BEEHIVE_X = -49.7
const BEEHIVE_Z = -13.8
const OUTER_RADIUS = 28 // distance where sound starts
const INNER_RADIUS = 5 // distance where sound reaches max volume
const MAX_VOLUME = 0.2

export default class BeeSound {
  constructor() {
    this.game = new Game()
    this.currentVolume = 0
    this.started = false

    this.audio = new Audio("/sounds/bees/dragon-studio-beehive-asmr-482881.mp3")
    this.audio.loop = true
    this.audio.volume = 0

    document.addEventListener("click", () => this._start(), { once: true })
  }

  _start() {
    this.audio.play().catch(() => {})
    this.started = true
  }

  update() {
    if (!this.started) return
    const fox = this.game.world?.fox?.model
    if (!fox) return

    const dx = fox.position.x - BEEHIVE_X
    const dz = fox.position.z - BEEHIVE_Z
    const dist = Math.sqrt(dx * dx + dz * dz)

    let target = 0
    if (dist < OUTER_RADIUS) {
      const t = Math.max(
        0,
        Math.min(1, (OUTER_RADIUS - dist) / (OUTER_RADIUS - INNER_RADIUS)),
      )
      target = t * t * (3 - 2 * t) * MAX_VOLUME // smoothstep and capped
    }

    this.currentVolume += (target - this.currentVolume) * 0.05
    this.audio.volume = this.currentVolume
  }
}
