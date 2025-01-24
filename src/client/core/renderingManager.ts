import { Scene, WebGLRenderer } from "three"
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CameraRig } from "./cameraRig";

// camera, rendering all that jazz
export class RenderingManager {

    renderer = new WebGLRenderer()
    targetScene?: Scene;
    cameraRig = new CameraRig();

    // orbitControls: OrbitControls;

    constructor() {
        // this.camera.position.z = 2
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)

        const onWindowResize = () => {
            this.cameraRig.camera.aspect = window.innerWidth / window.innerHeight
            this.cameraRig.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            if (this.targetScene !== undefined) this.render(this.targetScene, 0)
        }
        window.addEventListener('resize', onWindowResize, false)

    }

    render(scene: Scene, delta: number, time?: number) {
        // this.orbitControls.update();
        scene.add(this.cameraRig);
        this.cameraRig.update(delta, time)
        this.renderer.render(scene, this.cameraRig.camera);
    }

}