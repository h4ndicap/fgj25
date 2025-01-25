import { BoxGeometry, Color, Mesh, MeshBasicMaterial, Object3D, OrthographicCamera, Scene } from "three";


export class GuiSystem {
    private frustumSize = 1;
    static orthoCam = new OrthographicCamera();
    // static camera = new CameraRig(true);
    static guiScene = new Scene();

    private static instance: GuiSystem;

    private guiElements = new Map<string, Object3D>();

    private constructor() { }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new GuiSystem();
        const cuubio = new Mesh(new BoxGeometry())
        cuubio.material = new MeshBasicMaterial({
            color: new Color(1, 0, 0)
        })
        this.guiScene.add(cuubio);
        cuubio.position.z = -10
        this.guiScene.add(this.orthoCam);

        // this._renderer.setSize(window.innerWidth, window.innerHeight)
        // document.body.appendChild(this._renderer.domElement)

        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);

        return this.instance;
    }

    private static onWindowResize() {

        const aspect = window.innerWidth / window.innerHeight;

        GuiSystem.orthoCam.left = - 1 * aspect / 2;
        GuiSystem.orthoCam.right = 1 * aspect / 2;
        GuiSystem.orthoCam.top = 1 / 2;
        GuiSystem.orthoCam.bottom = - 1 / 2;

        GuiSystem.orthoCam.updateProjectionMatrix();

    }
    static guiRaycast() {

    }

}