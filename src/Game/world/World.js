import * as THREE from "three"
import Game from "../Game"
import Floor from "./Floor"
// import Cube from "./Cube"
import Grass from "./Grass"
import Fox from "./Fox"
import Environment from "./Environment"

export default class World {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources

    // Setup
    this.resources.on("ready", () => {
      this.fox = new Fox()
      this.game.camera.setTarget(this.fox.model)
      this.grass = new Grass()
    })

    this.floor = new Floor()
    this.environment = new Environment()
    // this.cube = new Cube()
  }

  update() {
    // this.cube.update()
    if (this.fox) this.fox.update()
    if (this.grass) this.grass.update()
  }
}
