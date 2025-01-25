import { Color, Mesh, MeshBasicMaterial, Object3D, Raycaster, SphereGeometry, Vector3 } from "three";


export class RaycastManager {

    private static instance: RaycastManager;

    private _raycaster = new Raycaster()

    private static _helperFrom: Mesh;
    private static _helperTo: Mesh;

    private constructor() { }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new RaycastManager();
        this._helperFrom = new Mesh(new SphereGeometry())
        this._helperFrom.scale.set(0.1, 0.15, 0.1)
        this._helperFrom.material = new MeshBasicMaterial({
            color: new Color(0, 0, 1)
        })
        // this._helper = line
        this._helperTo = this._helperFrom.clone();
        this._helperTo.material = new MeshBasicMaterial({
            color: new Color(0, 1, 1)
        })
        return this.instance;
    }

    raycast(from: Vector3, to: Vector3, against: Object3D[], distance: number) {
        // console.log("zapp")

        // Level.current.add(RaycastManager._helperFrom);
        // Level.current.add(RaycastManager._helperTo);

        RaycastManager._helperFrom.position.copy(from);
        RaycastManager._helperTo.position.copy(from).add(to.clone().multiplyScalar(distance));

        this._raycaster.far = distance;
        this._raycaster.set(from, to);
        const intersects = this._raycaster.intersectObjects(against)
        return intersects;
    }
}