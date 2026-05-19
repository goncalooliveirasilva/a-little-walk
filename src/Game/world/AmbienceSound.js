import Game from "../Game"

export default class AmbienceSound {
  constructor() {
    this.game = new Game()

    this.audio = new Audio(
      "/sounds/ambience/u_vr5icvkppa-nature-ambience-323729.mp3",
    )
    this.audio.loop = true
    this.audio.volume = 0.9

    this.started = false
    document.addEventListener(
      "click",
      () => {
        this.audio.play().catch(() => {})
        this.started = true
      },
      { once: true },
    )
  }

  update() {
    if (!this.started) return
    this.audio.volume = 0.8 * this.game.soundManager.getMultiplier("ambience")
  }
}
