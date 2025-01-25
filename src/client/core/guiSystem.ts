import { BoxGeometry, Color, Mesh, MeshBasicMaterial, Object3D, OrthographicCamera, PlaneGeometry, Raycaster, Scene, Vector2 } from "three";
import { IUpdateable } from "./common";
import { AssetManager } from "./assetManager";


// an ugly super-static class for rendering UI whenever
export class GuiSystem implements IUpdateable {
    private frustumSize = 1;
    static orthoCam = new OrthographicCamera();
    // static camera = new CameraRig(true);
    static guiScene = new Scene();
    private static pointer: Vector2 | undefined = undefined;

    private static instance: GuiSystem;

    private static guiRaycaster = new Raycaster();

    private static guiActions = new Map<Object3D, string>();
    private static guiElements: Object3D[] = [];
    static guiRoot: Object3D = new Object3D();

    private static mainchar: Mesh;
    private static package: Mesh;
    // static guiMap: any;

    private constructor() { }
    update(delta: number, timePassed: number): void {
        // throw new Error("Method not implemented.");
        // console.log("lupdate")
        if (GuiSystem.pointer !== undefined) {
            GuiSystem.guiRaycaster.setFromCamera(GuiSystem.pointer, GuiSystem.orthoCam)
            const intersects = GuiSystem.guiRaycaster.intersectObjects(GuiSystem.guiElements)
            if (intersects.length > 0) {
                const action = GuiSystem.guiActions.get(intersects[0].object)
                console.log(action)
            }
        }

        GuiSystem.mainchar.rotation.z = Math.sin(timePassed * 0.3) * 0.15
        GuiSystem.package.position.y = Math.cos(5 + timePassed * 0.2) * 0.01
        GuiSystem.package.rotation.z = -Math.cos(5 + timePassed * 0.3) * 0.15

    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new GuiSystem();
        const cuubio = new Mesh(new BoxGeometry())
        cuubio.material = new MeshBasicMaterial({
            color: new Color(1, 0, 0)
        })
        // this.guiScene.add(cuubio);
        cuubio.position.z = -10
        this.guiScene.add(this.orthoCam);

        this.guiElements.push(cuubio);
        this.guiActions.set(cuubio, 'asdfasdf')


        const cuubio2 = new Mesh(new BoxGeometry())
        cuubio2.material = new MeshBasicMaterial({
            color: new Color(0, 1, 0)
        })
        // this.guiScene.add(cuubio2);
        cuubio2.position.z = -10

        this.guiElements.push(cuubio2);
        this.guiActions.set(cuubio2, 'awefawefwef')
        cuubio2.position.x += 1
        const bgScale = 1712 / 1000
        const mainMenuBackground = new Mesh(new PlaneGeometry());
        mainMenuBackground.material = new MeshBasicMaterial({
            map: AssetManager.getInstance().getTexture('hahmoalotusruutu1.png'),
            transparent: true
        })
        mainMenuBackground.scale.setX(bgScale)


        this.package = new Mesh(new PlaneGeometry());
        this.package.material = new MeshBasicMaterial({
            map: AssetManager.getInstance().getTexture('hahmoalotusruutu2.png'),
            transparent: true
        })
        this.package.scale.setX(bgScale)


        GuiSystem.mainchar = new Mesh(new PlaneGeometry());
        GuiSystem.mainchar.material = new MeshBasicMaterial({
            map: AssetManager.getInstance().getTexture('hahmo.png'),
            transparent: true
        })
        // mainCharacter.scale.setX(bgScale)
        GuiSystem.mainchar.scale.x = 2000 / 2402
        GuiSystem.mainchar.scale.multiplyScalar(2.15)
        GuiSystem.mainchar.position.x = -0.1
        GuiSystem.mainchar.position.y = -0.6
        GuiSystem.mainchar.position.z = -7
        // this.guiActions.set(mainMenuBackground2, 'owopack')
        mainMenuBackground.position.z = -9
        this.package.position.z = -8
        // this.guiMap.set('owopack', mainMenuBackground2)

        this.guiScene.add(mainMenuBackground)
        this.guiScene.add(this.package)
        this.guiScene.add(GuiSystem.mainchar)

        // this._renderer.setSize(window.innerWidth, window.innerHeight)
        // document.body.appendChild(this._renderer.domElement)

        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
        document.addEventListener('pointermove', this.onPointerMove);

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

    private static onPointerMove(event: { clientX: number; clientY: number; }) {

        if (GuiSystem.pointer === undefined) {
            GuiSystem.pointer = new Vector2();
        }
        GuiSystem.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        GuiSystem.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
        // console.log(GuiSystem.pointer)
    }
}