import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import Events from "./Events"
import { TextureLoader } from "three"
import Game from "../Game"

export default class Resources extends Events {
  constructor(sources) {
    super()

    this.game = new Game()
    this.overlay = this.game.overlay

    this.sources = sources

    // Setup
    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {}

    this.loadingManager = new THREE.LoadingManager(
      () => this.onLoad(),
      (url, loaded, total) => this.onProgress(loaded, total),
    )

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("/draco/")

    this.loaders.gltfLoader = new GLTFLoader(this.loadingManager)
    this.loaders.gltfLoader.setDRACOLoader(dracoLoader)
    this.loaders.textureLoader = new TextureLoader(this.loadingManager)
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file)
        })
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file)
        })
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file
    this.loaded++
    if (this.loaded === this.toLoad) {
      this.trigger("ready")
    }
  }

  onLoad() {
    this.overlay.onReady()
  }

  onProgress(loaded, total) {
    this.overlay.setProgress(loaded / total)
  }
}
