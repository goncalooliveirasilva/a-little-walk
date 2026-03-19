import Events from "./Events"

export default class Time extends Events {
  constructor() {
    super()

    // Setup
    // timestamp when the game starts and will stay the same
    this.start = Date.now()
    // current timestamp and will change on each frame
    this.current = this.start
    // how much time was spent since the start of the game
    this.elapsed = 0
    // how much time was spent since the previous frame
    // (16 by default because it is close to how many milliseconds
    // there is between two frames at 60fps)
    this.delta = 16

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }

  tick() {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    this.trigger("tick")

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }
}
