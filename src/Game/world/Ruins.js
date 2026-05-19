import * as THREE from "three"
import Game from "../Game"

const BW = 1.4
const BH = 0.7
const BD = 0.9

export default class Ruins {
  constructor(config = {}) {
    this.game = new Game()
    this.scene = this.game.scene
    this.cx = config.x ?? 0
    this.cy = config.y ?? 0
    this.cz = config.z ?? 0

    this.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#9e8868"),
      roughness: 1.0,
      metalness: 0.0,
    })

    this.buildBlocks(config.blocks ?? [])
    this.buildPillars(config.pillars ?? [])
  }

  buildBlocks(blocks) {
    if (blocks.length === 0) return

    const geo = new THREE.BoxGeometry(BW, BH, BD)
    const mesh = new THREE.InstancedMesh(geo, this.material, blocks.length)
    mesh.castShadow = true
    mesh.receiveShadow = true

    const matrix = new THREE.Matrix4()
    blocks.forEach(([dx, dy, dz, rx, ry], i) => {
      matrix.compose(
        new THREE.Vector3(this.cx + dx, this.cy + dy, this.cz + dz),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, 0)),
        new THREE.Vector3(1, 1, 1),
      )
      mesh.setMatrixAt(i, matrix)
    })

    this.scene.add(mesh)
  }

  buildPillars(pillars) {
    const geo = new THREE.CylinderGeometry(0.4, 0.45, 3.0, 8)

    pillars.forEach(({ dx, dy, dz, rx, ry, rz }) => {
      const mesh = new THREE.Mesh(geo, this.material)
      mesh.position.set(this.cx + dx, this.cy + dy, this.cz + dz)
      mesh.rotation.set(rx, ry, rz)
      mesh.castShadow = true
      mesh.receiveShadow = true
      this.scene.add(mesh)
    })
  }
}
