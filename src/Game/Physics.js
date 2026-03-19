import * as CANNON from "cannon-es"
import Game from "./Game"

export default class Physics {
  constructor() {
    this.game = new Game()

    this.world = new CANNON.World()
    this.world.gravity.set(0, -9.81, 0)
  }

  update() {
    this.world.step(1 / 60, this.game.time.delta / 1000)
  }
}
