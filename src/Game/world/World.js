import * as THREE from "three"
import Game from "../Game"
import Floor from "./Floor"
// import Cube from "./Cube"
import Grass from "./Grass"
import Fox from "./Fox"
import Environment from "./Environment"
import Bush from "./Bushes"
import Trees from "./Trees"
import Rocks from "./Rocks"
import { trees01, trees02, rocks } from "./mapConfig"
import Fog from "./Fog"
import Sky from "./Sky"

export default class World {
  constructor() {
    this.game = new Game()
    this.game.world = this
    this.scene = this.game.scene
    this.resources = this.game.resources
    this.worldSize = 100

    // Setup
    this.resources.on("ready", () => {
      this.fox = new Fox()
      this.game.camera.setTarget(this.fox.model)
      this.grass = new Grass()
      this.bush = new Bush()

      // Trees
      this.trees01 = new Trees({
        name: "Trees 01",
        model: "tree01Model",
        positions: trees01,
        color: "#db5309",
        colorDark: "#9c5d04",
        foliageHeight: 3.4,
      })
      this.trees02 = new Trees({
        name: "Trees 02",
        model: "tree02Model",
        positions: trees02,
        color: "#19e019",
        colorDark: "#07b207",
        foliageScale: 0.6,
        foliageHeight: 2.8,
        clusters: [
          { y: 0, x: 0, z: 0.2, scale: 1.1 },
          { y: -0.5, x: 0.1, z: -0.4, scale: 0.9 },
          { y: -0.8, x: 0, z: 0.1, scale: 0.8 },
        ],
      })

      this.rocks = new Rocks({ positions: rocks })
    })

    this.floor = new Floor()
    this.environment = new Environment()
    this.fog = new Fog()
    this.sky = new Sky()
    // this.cube = new Cube()
  }

  update() {
    // this.cube.update()
    if (this.fox) this.fox.update()
    if (this.grass) this.grass.update()
    if (this.bush) this.bush.update()
    if (this.trees01) this.trees01.update()
    if (this.trees02) this.trees02.update()
    if (this.sky) this.sky.update()
  }
}
