import { Color, Scene } from "three";
import { MapGrid } from "./mapGrid";
import { Player } from "./player";
import { IUpdateable } from "./common";


export class Level implements IUpdateable {

    private _scene: Scene = new Scene();
    private _groundGrid = new MapGrid(20);

    private _player = new Player();

    get scene() {
        return this._scene;
    }

    constructor() {
        this._scene.add(this._groundGrid);
        this._scene.add(this._player)
        this.scene.background = new Color(0.7, 0.7, 0.7)
    }
    update(delta: number, timePassed: number): void {
        this._player.update(delta, timePassed);
    }
}