import { Color, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Scene, Vector3 } from "three";
import { Forcefield, MapGrid } from "./mapGrid";
import { Player } from "./player";
import { IUpdateable } from "./common";
import { AssetManager } from "./assetManager";


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
    }




    update(delta: number, timePassed: number): void {

        this._player.obstacles = this._groundGrid.obstacles;
        this._player.update(delta, timePassed);

        this._groundGrid.forceFields.forEach(field => {

            const effectInfluence = field.getTargetMagnitude(this.player);
            // if (effectInfluence > 0) {

            // }
        })
    }

}