import { Color, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Scene, Vector3 } from "three";
import { Forcefield, MapGrid } from "./mapGrid";
import { Player } from "./player";
import { IUpdateable } from "./common";
import { AssetManager } from "./assetManager";
import { imageSizes } from "../imagefiles";


export class Level implements IUpdateable {

    private static _current: Level;

    static set current(level: Level) {
        this._current = level;
    }
    static get current() {
        return this._current;
    }


    // targets: Object3D[] = []

    private _scene: Scene = new Scene();
    private _groundGrid: MapGrid;

    private _groundBack = new Mesh(new PlaneGeometry())

    private _player = new Player();

    get player() {
        return this._player;
    }

    get scene() {
        return this._scene;
    }

    add(object: Object3D) {
        this.scene.add(object);
    }

    addRandomPlants(files: string[], size: number, amount: 100) {
        for (let index = 0; index < amount; index++) {
            const mesh = new Mesh(new PlaneGeometry())
            this.add(mesh);
            const randX = Math.random() * size - size / 2;
            const randY = Math.random() * size - size / 2;
            mesh.position.x = randX;
            mesh.position.z = randY;
            // mesh.position.y = 0.5

            const pick = Math.random() * files.length;
            const texName = files[Math.floor(pick)];
            // console.log(pick, files, texName)
            const texture = AssetManager.getInstance().getTexture(texName)
            mesh.material = new MeshBasicMaterial({
                map: texture,
                transparent: true
            })

            const imageInfo = imageSizes.get(texName);
            // const ratio = texture?.image
            // mesh.scale
            // console.log(texture?.source);
            if (imageInfo !== undefined) {
                if (imageInfo.scale) {
                    mesh.scale.copy(imageInfo?.scale)
                }
                mesh.scale.multiplyScalar(0.5 + Math.random() * 0.5)
                if (imageInfo.rotation) {
                    mesh.rotation.z = Math.random() * Math.PI
                    mesh.rotation.x = -Math.PI / 2
                }
                if (imageInfo.offset) {
                    mesh.position.add(imageInfo.offset)
                }
            } else {
                mesh.position.y = 1
            }

        }
    }

    // kind of annoying to create a jumbo constructor but it's just jamming
    constructor(gridSize: number, obstacles: { x: number, y: number }[], forcefields: Forcefield[]) {
        this._groundGrid = new MapGrid(gridSize);
        this._scene.add(this._groundGrid);
        this._scene.add(this._player)
        this.scene.background = new Color().setScalar(0.3)
        this._groundGrid.setForcefields(forcefields);
        this._groundGrid.setObstacles(obstacles);


        const groundTex = AssetManager.getInstance().getTexture('maa.png')
        groundTex?.repeat.set(2, 2)
        groundTex!.wrapS = 1002
        groundTex!.wrapT = 1002
        groundTex!.rotation = 2
        this._groundBack.material = new MeshBasicMaterial({
            map: groundTex
        })

        // this._groundBack.material.
        this._groundBack.rotation.x = -Math.PI / 2
        this._groundBack.position.y = -0.1
        this._groundBack.scale.setScalar(gridSize)
        this.add(this._groundBack)

        this.addRandomPlants(['kivikasvi.png', 'simpukka1.png', 'simpukka2.png'], 20, 100)
    }




    update(delta: number, timePassed: number): void {

        this._player.obstacles = this._groundGrid.obstacles;
        this._player.update(delta, timePassed);

        this._groundGrid.forceFields.forEach(field => {

            const effectInfluence = field.getTargetMagnitude(this.player);
            if (effectInfluence > 0) {

                const targetPos = field.getWorldPosition(new Vector3());
                const movement = new Vector3().subVectors(this.player.position, targetPos);
                const lengthToTarget = movement.length();
                const directionToTarget = movement.normalize()
                // .multiplyScalar(effectInfluence * field.force * delta);
                const positionAdjustment = directionToTarget.clone().multiplyScalar(effectInfluence * field.force)

                if (positionAdjustment.length() > this.player.maxSpeed) {
                    console.error("YOU WENT DOWN THE DRAIN! :(")
                    this.player.controlEnabled = false;
                }
                // if we would fly over the centerpoint, clamp to it, add small epsilon
                if (positionAdjustment.length() > lengthToTarget) {
                    // console.error("OVERSHOOT")
                    this.player.position.copy(targetPos)
                } else {
                    // console.warn("undershoot", positionAdjustment.length(), lengthToTarget)
                    this.player.position.add(positionAdjustment);
                }

                // console.log(...movement)


            }
        })
    }

}