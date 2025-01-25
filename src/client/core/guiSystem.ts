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
        GuiSystem.guiRoot.add(mainMenuBackground);
        // this.guiElements.push(mainMenuBackground);
        // this.guiActions.set(mainMenuBackground, 'background')
        // this.guiMap.set('background', mainMenuBackground)


        const mainMenuBackground2 = new Mesh(new PlaneGeometry());
        mainMenuBackground2.material = new MeshBasicMaterial({
            map: AssetManager.getInstance().getTexture('hahmoalotusruutu2.png'),
            transparent: true
        })
        mainMenuBackground2.scale.setX(bgScale)
        mainMenuBackground2.position.z = 1
        GuiSystem.guiRoot.add(mainMenuBackground2);
        this.guiElements.push(mainMenuBackground2);
        this.guiActions.set(mainMenuBackground2, 'owopack')
        mainMenuBackground.position.z = -9
        mainMenuBackground2.position.z = -8
        // this.guiMap.set('owopack', mainMenuBackground2)

        this.guiScene.add(mainMenuBackground, mainMenuBackground2)

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


/*



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
    private static guiMap: Map<string, Object3D> = new Map();

    private static guiRoot = new Object3D();

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
        // if ()
        GuiSystem.guiMap.get('owopack')!.rotation.z = Math.sin(timePassed) * 0.1;
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new GuiSystem();

        this.createGuiElements();
        this.orthoCam.near = -100

        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
        document.addEventListener('pointermove', this.onPointerMove);

        this.guiRoot.position.z = 10;

        this.guiScene.add(this.guiRoot);
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

    private static createGuiElements() {
        const bgScale = 1712 / 1000
        const mainMenuBackground = new Mesh(new PlaneGeometry());
        mainMenuBackground.material = new MeshBasicMaterial({
            map: AssetManager.getInstance().getTexture('hahmoalotusruutu1.png'),
            transparent: true
        })
        mainMenuBackground.scale.setX(bgScale)
        GuiSystem.guiRoot.add(mainMenuBackground);
        // this.guiElements.push(mainMenuBackground);
        // this.guiActions.set(mainMenuBackground, 'background')
        // this.guiMap.set('background', mainMenuBackground)


        const mainMenuBackground2 = new Mesh(new PlaneGeometry());
        mainMenuBackground2.material = new MeshBasicMaterial({
            map: AssetManager.getInstance().getTexture('hahmoalotusruutu2.png'),
            transparent: true
        })
        mainMenuBackground2.scale.setX(bgScale)
        mainMenuBackground2.position.z = 1
        GuiSystem.guiRoot.add(mainMenuBackground2);
        this.guiElements.push(mainMenuBackground2);
        this.guiActions.set(mainMenuBackground2, 'owopack')
        this.guiMap.set('owopack', mainMenuBackground2)
    }
}
    */