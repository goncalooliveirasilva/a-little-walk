import Game from "../Game"

export default class AmbienceSound {
  constructor() {
    this.game = new Game()

    this.audio = new Audio(
      "/sounds/ambience/u_vr5icvkppa-nature-ambience-323729.mp3",
    )
    this.audio.loop = true
    this.audio.volume = 0.8

    document.addEventListener(
      "click",
      () => {
        this.audio.play().catch(() => {})
      },
      { once: true },
    )
  }
}
