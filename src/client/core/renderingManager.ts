import { Scene, WebGLRenderer } from "three"
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CameraRig } from "./cameraRig";
import { Level } from "./level";
import { IUpdateable } from "./common";

// camera, rendering all that jazz
export class RenderingManager implements IUpdateable {

    private _renderer = new WebGLRenderer()
    private _targetLevel?: Level;
    private _cameraRig = new CameraRig();

    set level(lev: Level) {
        this._targetLevel = lev;
        this._targetLevel.add(this._cameraRig)
    }
    // get level() {
    //     return this._targetLevel;
    // }

    // use this as some placeholderish thing of something fails?
    private _emptyLevel = new Level();

    // orbitControls: OrbitControls;

    constructor() {
        // this.camera.position.z = 2
        this._renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this._renderer.domElement)

        const onWindowResize = () => {
            this._cameraRig.camera.aspect = window.innerWidth / window.innerHeight
            this._cameraRig.camera.updateProjectionMatrix()
            this._renderer.setSize(window.innerWidth, window.innerHeight)
            if (this._targetLevel !== undefined) this.update(0)
        }
        window.addEventListener('resize', onWindowResize, false)
    }

    update(delta: number, time?: number) {
        // this.orbitControls.update();
        // level.add(this.cameraRig);
        this._cameraRig.update(delta, time)
        if (this._targetLevel) {
            this._renderer.render(this._targetLevel.scene, this._cameraRig.camera);
        }
    }

}