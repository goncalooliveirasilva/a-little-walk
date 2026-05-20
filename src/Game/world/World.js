import * as THREE from "three"
import Game from "../Game"
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
  cherryTrees,
  ruins as ruinsConfig,
} from "./mapConfig"

// terrain
import Floor from "./terrain/Floor"
import Grass from "./terrain/Grass"
import Water from "./terrain/Water"
import Fog from "./terrain/Fog"

// atmosphere
import Sky from "./atmosphere/Sky"
import Environment from "./atmosphere/Environment"

// vegetation
import Bush from "./vegetation/Bushes"
import Trees from "./vegetation/Trees"
import Willow from "./vegetation/Willow"
import Flowers from "./vegetation/Flowers"

// structures
import Fences from "./structures/Fences"
import Rocks from "./structures/Rocks"
import Ruins from "./structures/Ruins"
import Beehive from "./structures/Beehive"
import WoodenBeehive from "./structures/WoodenBeehive"

// creatures
import Fox from "./creatures/Fox"
import Birds from "./creatures/Birds"
import Bees from "./creatures/Bees"
import Butterflies from "./creatures/Butterflies"

// sound
import BeeSound from "./sound/BeeSound"
import AmbienceSound from "./sound/AmbienceSound"

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
      this.cherryTrees = new Trees({
        name: "Cherry Trees",
        model: "tree03Model",
        positions: cherryTrees,
        color: "#ffb7c5",
        colorDark: "#d45c7a",
        foliageHeight: 3.4,
        planeCount: 20,
        rotation: 0,
        clusters: [
          { x: -0.4, y: 0.8, z: 0.0, scale: 1.0 },
          { x: 0, y: 0, z: 0.1, scale: 0.95 },
          { x: 0.6, y: -0.8, z: 0.5, scale: 1.0 },
          { x: -0.3, y: -0.1, z: 1.3, scale: 1.1 },
          { x: -0.6, y: -0.1, z: -0.5, scale: 1.1 },
          { x: -0.3, y: -1.0, z: -0.3, scale: 1.05 },
          { x: 0.3, y: 0.6, z: 0.5, scale: 1.05 },
          { x: 0.3, y: 0.4, z: 1.2, scale: 1 },
          { x: 0.3, y: 0.2, z: -0.3, scale: 1 },
          { x: -0.5, y: -0.7, z: 0.7, scale: 1.15 },
        ],
      })

      this.rocks = new Rocks({ positions: rocks })
      this.fences = new Fences({ positions: fences })
      this.birds = new Birds({ x: 0, y: 8, z: 0 })
      this.beehive = new Beehive(beehiveConfig)
      this.woodenBeehives = woodenBeeHives.map(
        (config) => new WoodenBeehive(config),
      )

      this.bees = beesConfig.map((config) => new Bees(config))
      this.butterflies = butterfliesConfig.map(
        (config) => new Butterflies(config),
      )
      this.flowers = new Flowers(flowersConfig)
      this.ruins = ruinsConfig.map((config) => new Ruins(config))

      // Sounds
      this.beeSound = new BeeSound()
      this.ambienceSound = new AmbienceSound()
    })

    this.environment = new Environment()
    this.fog = new Fog()
    this.sky = new Sky()
    this.water = new Water()
  }

  update() {
    if (this.fox) this.fox.update()
    if (this.grass) this.grass.update()
    if (this.bush) this.bush.update()
    if (this.bush2) this.bush2.update()
    if (this.trees01) this.trees01.update()
    if (this.trees02) this.trees02.update()
    if (this.cherryTrees) this.cherryTrees.update()
    if (this.sky) this.sky.update()
    if (this.water) this.water.update()
    if (this.birds) this.birds.update()
    if (this.beehive) this.beehive.update()
    if (this.bees) this.bees.forEach((b) => b.update())
    if (this.butterflies) this.butterflies.forEach((b) => b.update())
    if (this.flowers) this.flowers.update()
    if (this.willow) this.willow.update()
    if (this.beeSound) this.beeSound.update()
    if (this.ambienceSound) this.ambienceSound.update()
  }
}
