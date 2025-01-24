import { Object3D, PerspectiveCamera, Vector3 } from "three";
import { IUpdateable } from "./common";


export class CameraRig extends Object3D implements IUpdateable {
    private _azimuth = new Object3D();
    private _polar = new Object3D();
    private _dolly = new Object3D();
    camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)

    targetVector = new Vector3();

    followSpeed = 10;

    constructor() {
        super();

        this.add(this._polar);
        this._polar.add(this._azimuth);
        this._azimuth.add(this._dolly);
        this._polar.rotation.y = Math.PI
        this._azimuth.rotation.x = -1.00
        this._dolly.position.z = 8;
        // this.camera.position.z = -5
        this._dolly.add(this.camera)

        // found it nicer to flip the world view this way :D
        this.camera.scale.x = -1
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(delta: number, time?: number) {

        const intermediateVector = new Vector3().lerpVectors(this.position, this.targetVector, delta * this.followSpeed);

        this.position.copy(intermediateVector);

    }

}