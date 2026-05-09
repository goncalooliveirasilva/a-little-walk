import * as THREE from "three"
import Game from "../Game"

export default class WoodenBeehive {
  constructor({ x, z, y = 0, rotation = 0, scale = 1.3 }) {
    this.game = new Game()
    this.scene = this.game.scene

    this.group = new THREE.Group()
    this.group.position.set(x, y, z)
    this.group.rotation.y = rotation
    this.scale = scale

    this.buildWoodenhive()
  }

  buildWoodenhive() {
    this.setMaterials()
    this.buildLegs()
    this.buildBottomBoard()
    this.buildBroodBox()
    this.buildEntrance()
    this.buildHoneySuperBox()
    this.buildInnerCover()
    this.buildRoof()

    this.group.scale.set(this.scale, this.scale, this.scale)
    this.scene.add(this.group)
  }

  setMaterials() {
    this.woodMaterial = new THREE.MeshStandardMaterial({ color: "#c8841a" })
    this.woodLightMaterial = new THREE.MeshStandardMaterial({
      color: "#e09c30",
    })
    this.roofMaterial = new THREE.MeshStandardMaterial({ color: "#6b4424" })
    this.darkMaterial = new THREE.MeshStandardMaterial({ color: "#2a1408" })
  }

  buildLegs() {
    const legGeometry = new THREE.BoxGeometry(0.08, 0.3, 0.08)

    const leg1 = new THREE.Mesh(legGeometry, this.woodMaterial)
    leg1.position.set(0.33, 0.15, 0.28)

    const leg2 = new THREE.Mesh(legGeometry, this.woodMaterial)
    leg2.position.set(-0.33, 0.15, 0.28)

    const leg3 = new THREE.Mesh(legGeometry, this.woodMaterial)
    leg3.position.set(0.33, 0.15, -0.28)

    const leg4 = new THREE.Mesh(legGeometry, this.woodMaterial)
    leg4.position.set(-0.33, 0.15, -0.28)

    this.group.add(leg1, leg2, leg3, leg4)
  }

  buildBottomBoard() {
    const bottomBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.86, 0.04, 0.78),
      this.woodMaterial,
    )
    bottomBoard.position.set(0, 0.32, 0)
    this.group.add(bottomBoard)
  }

  buildBroodBox() {
    const broodBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.45, 0.7),
      this.woodMaterial,
    )
    broodBox.position.set(0, 0.565, 0)
    this.group.add(broodBox)
  }

  buildEntrance() {
    const entrance = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.03, 0.02),
      this.darkMaterial,
    )
    entrance.position.set(0, 0.5, 0.36)
    this.group.add(entrance)
  }

  buildHoneySuperBox() {
    const superBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.32, 0.7),
      this.woodLightMaterial,
    )
    superBox.position.set(0, 0.95, 0)
    this.group.add(superBox)
  }

  buildInnerCover() {
    const innerCover = new THREE.Mesh(
      new THREE.BoxGeometry(0.82, 0.04, 0.72),
      this.woodMaterial,
    )
    innerCover.position.set(0, 1.13, 0)
    this.group.add(innerCover)
  }

  buildRoof() {
    const roofMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.96, 0.08, 0.86),
      this.roofMaterial,
    )
    roofMesh.position.set(0, 1.19, 0)
    this.group.add(roofMesh)
  }
}
