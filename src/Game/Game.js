import * as THREE from "three"
import Debug from "./utils/Debug"
import Sizes from "./utils/Sizes"
import Time from "./utils/Time"
import Camera from "./Camera"
import Renderer from "./Renderer"
import Physics from "./Physics"
import World from "./world/World"
import Helpers from "./Helpers"
import Input from "./utils/Input"
import Resources from "./utils/Resources"
import Stats from "stats.js"
import sources from "./sources"
import Overlay from "./Overlay"
import Menu from "./Menu"

let instantce = null

export default class Game {
  constructor(canvas) {
    if (instantce) {
      return instantce
    }
    instantce = this

    // Global access
    window.game = this

    // Options
    this.canvas = canvas

    // Setup
    this.debug = new Debug()

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: "Game",
        expanded: false,
      })
    }

    this.sizes = new Sizes()
    this.time = new Time()
    this.input = new Input()
    this.scene = new THREE.Scene()
    this.overlay = new Overlay()
    this.menu = new Menu()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.physics = new Physics()
    this.world = new World()

    if (this.debug.active) {
      this.helpers = new Helpers()

      this.stats = new Stats()
      this.stats.showPanel(0)
      document.body.appendChild(this.stats.dom)
    }

    // Sizes resize event
    this.sizes.on("resize", () => {
      this.resize()
    })

    // Time tick event
    this.time.on("tick", () => {
      this.update()
    })
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    if (this.stats) this.stats.begin()
    this.camera.update()
    this.physics.update()
    this.world.update()
    this.renderer.update()
    if (this.stats) this.stats.end()
  }

  destroy() {
    this.sizes.off("resize")
    this.time.off("tick")
    // We can also remove the eventlisteners of these classes

    // Traverse the whole scene
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key]

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose()
          }
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    if (this.debug.active) {
      this.debug.ui.dispose()
    }
  }
}
