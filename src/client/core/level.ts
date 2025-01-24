import { Color, Scene } from "three";
import { MapGrid } from "./mapGrid";


export class Level {

    private _scene: Scene = new Scene();
    private _groundGrid = new MapGrid(20);

    get scene() {
        return this._scene;
    }

    constructor() {
        this._scene.add(this._groundGrid);
        this.scene.background = new Color(0.7, 0.7, 0.7)
    }
}