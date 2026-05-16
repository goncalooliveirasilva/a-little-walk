import * as THREE from "three"
import Game from "../Game"
import Floor from "./Floor"
// import Cube from "./Cube"
import Grass from "./Grass"
import Fox from "./Fox"
import Environment from "./Environment"
import Bush from "./Bushes"
import Trees from "./Trees"
import Willow from "./Willow"
import Rocks from "./Rocks"
import Fences from "./Fences"
import {
  bushes,
  bushes2,
  trees01,
  trees02,
  rocks,
  fences,
  woodenBeeHives,
  bees as beesConfig,
  beehive as beehiveConfig,
  butterflies as butterfliesConfig,
  flowers as flowersConfig,
  willows,
} from "./mapConfig"
import Fog from "./Fog"
import Sky from "./Sky"
import Water from "./Water"
import Birds from "./Birds"
import Beehive from "./Beehive"
import Butterflies from "./Butterflies"
import WoodenBeehive from "./WoodenBeehive"
import Bees from "./Bees"
import Flowers from "./Flowers"

export default class World {
  constructor() {
    this.game = new Game()
    this.game.world = this
    this.scene = this.game.scene
    this.resources = this.game.resources
    this.worldSize = 100

    // Setup
    this.resources.on("ready", () => {
      this.floor = new Floor()
      this.fox = new Fox()
      this.game.camera.setTarget(this.fox.model)
      this.grass = new Grass()
      this.bush = new Bush({
        texture: null,
        positions: bushes,
        color: "#c8e210",
        colorDark: "#6c8f00",
        name: "Bushes",
      })
      this.bush2 = new Bush({
        texture: "leafs02Texture",
        positions: bushes2,
        color: "#ebc211",
        colorDark: "#5f3c0d",
        name: "Bushes 02",
      })

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

      this.willow = new Willow({ name: "Willow", positions: willows })

      this.rocks = new Rocks({ positions: rocks })
      this.fences = new Fences({ positions: fences })
      this.birds = new Birds({ x: 0, y: 8, z: 0 })
      this.beehive = new Beehive(beehiveConfig)
      this.woodenBeehives = woodenBeeHives.map(
        (config) => new WoodenBeehive(config),
      )
      // TODO: pass positions to the constructor
      this.bees = beesConfig.map((config) => new Bees(config))
      this.butterflies = butterfliesConfig.map(
        (config) => new Butterflies(config),
      )
      this.flowers = new Flowers(flowersConfig)
    })

    this.environment = new Environment()
    this.fog = new Fog()
    this.sky = new Sky()
    this.water = new Water()
    // this.cube = new Cube()
  }

  update() {
    // this.cube.update()
    if (this.fox) this.fox.update()
    if (this.grass) this.grass.update()
    if (this.bush) this.bush.update()
    if (this.bush2) this.bush2.update()
    if (this.trees01) this.trees01.update()
    if (this.trees02) this.trees02.update()
    if (this.sky) this.sky.update()
    if (this.water) this.water.update()
    if (this.birds) this.birds.update()
    if (this.beehive) this.beehive.update()
    if (this.bees) this.bees.forEach((b) => b.update())
    if (this.butterflies) this.butterflies.forEach((b) => b.update())
    if (this.flowers) this.flowers.update()
    if (this.willow) this.willow.update()
  }
}
