import { Color, Object3D, Scene } from "three";
import { MapGrid } from "./mapGrid";
import { Player } from "./player";
import { IUpdateable } from "./common";


export class Level implements IUpdateable {

    private static _current: Level;

    static set current(level: Level) {
        this._current = level;
    }
    static get current() {
        return this._current;
    }

    private _scene: Scene = new Scene();
    private _groundGrid: MapGrid;

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
    constructor(gridSize: number, obstacles: { x: number, y: number }[]) {
        this._groundGrid = new MapGrid(gridSize);
        this._scene.add(this._groundGrid);
        this._scene.add(this._player)
        this.scene.background = new Color(0.7, 0.7, 0.7)
        this._groundGrid.setObstacles(obstacles);
    }
    update(delta: number, timePassed: number): void {

        this._player.obstacles = this._groundGrid.obstacleColliders;
        this._player.update(delta, timePassed);
    }
}