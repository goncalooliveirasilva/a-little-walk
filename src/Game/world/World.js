import * as THREE from "three"
import Game from "../Game"
import Floor from "./Floor"
import Cube from "./Cube"

export default class World {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene

    // Setup
    this.floor = new Floor()
    this.cube = new Cube()
  }

  update() {
    this.cube.update()
  }
}
