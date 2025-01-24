import { Object3D, PerspectiveCamera } from "three";


export class CameraRig extends Object3D {
    private _azimuth = new Object3D();
    private _polar = new Object3D();
    private _dolly = new Object3D();
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)

    constructor() {
        super();

        this.add(this._polar);
        this._polar.add(this._azimuth);
        this._azimuth.add(this._dolly);
        this._azimuth.rotation.x = -1
        this._dolly.position.z = 5;
        // this.camera.position.z = -5
        this._dolly.add(this.camera)
    }

    update(delta: number, time?: number) {
        // this.camera.position.copy(this._dolly.position);
        if (time) {
            // this.position.x = (Math.sin(time))
            // console.log(this.position.x)
        }
    }

}