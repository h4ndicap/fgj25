import { Object3D, Raycaster, Vector3 } from "three";


export class RaycastManager {

    private static instance: RaycastManager;

    private _raycaster = new Raycaster()

    private constructor() { }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new RaycastManager();
        return this.instance;
    }

    raycast(from: Vector3, to: Vector3, against: Object3D[]) {
        // console.log("zapp")

        this._raycaster.set(from, to);
        const intersects = this._raycaster.intersectObjects(against, false)
        return intersects;
    }
}