import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import Events from "./Events"
import { TextureLoader } from "three"

export default class Resources extends Events {
  constructor(sources) {
    super()

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

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("/draco/")

    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.gltfLoader.setDRACOLoader(dracoLoader)
    this.loaders.textureLoader = new TextureLoader()
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
}
