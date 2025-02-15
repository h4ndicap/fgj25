import { Color, MathUtils, Mesh, MeshBasicMaterial, Object3D, OrthographicCamera, PlaneGeometry, Raycaster, Scene, Vector2, Vector3 } from "three";
import { IUpdateable } from "./common";
import { AssetManager } from "./assetManager";
import { Subject } from "rxjs";
import { StaticItem } from "./staticItem";

export type UiState = 'mainmenu' | 'gamemenu' | 'gameover' | 'victory'

export type UiAction = 'start'

// an ugly super-static class for rendering UI whenever
export class GuiSystem implements IUpdateable {
    private static frustumSize = 1;

    static UISTATE: UiState = 'mainmenu'
    static orthoCam = new OrthographicCamera();
    // static camera = new CameraRig(true);
    static guiScene = new Scene();
    private static pointer: Vector2 | undefined = undefined;

    private static instance: GuiSystem;

    private static guiRaycaster = new Raycaster();

    private static guiActions = new Map<Object3D, UiAction>();
    private static guiElements: Object3D[] = [];
    static guiRoot: Object3D = new Object3D();

    private static mainchar: Mesh;
    private static package: Mesh;
    private static startButtonContainer = new Object3D();
    private static startButton: Mesh;

    private static startButtonScale = 1;

    private static mainMenuSet: Object3D[] = []
    private static gameOverSet: Object3D[] = []
    private static victorySet: Object3D[] = []

    private static activeAction: UiAction | undefined = undefined;

    public static uiAction$: Subject<UiAction> = new Subject<UiAction>();
    // static guiMap: any;

    private constructor() { }
    update(delta: number, timePassed: number): void {
        // throw new Error("Method not implemented.");
        // console.log("lupdate")
        if (GuiSystem.pointer !== undefined) {
            GuiSystem.guiRaycaster.setFromCamera(GuiSystem.pointer, GuiSystem.orthoCam)
            const activeElements = GuiSystem.guiElements.filter(x => x.visible);
            const intersects = GuiSystem.guiRaycaster.intersectObjects(activeElements)
            if (intersects.length > 0) {
                const action = GuiSystem.guiActions.get(intersects[0].object)
                GuiSystem.activeAction = action;
                // console.log(action)
                if (action === 'start') {

                    GuiSystem.startButtonScale += delta;

                    // console.log("start in scale");
                    const current = GuiSystem.startButtonContainer.scale.y;
                    GuiSystem.startButtonContainer.scale.addScalar(Math.max(current + delta, 1.2));

                    // const newScalar = MathUtils.clamp(GuiSystem.startButton.scale.y, 
                    // GuiSystem.startButton.scale.setScalar
                }
                else {
                    GuiSystem.startButtonScale -= delta;
                }
            } else {
                GuiSystem.startButtonScale -= delta;
                GuiSystem.activeAction = undefined;
            }

        }
        GuiSystem.startButtonScale = MathUtils.clamp(GuiSystem.startButtonScale, 1, 1.2)
        GuiSystem.startButtonContainer.scale.setScalar(GuiSystem.startButtonScale);
        GuiSystem.startButtonContainer.scale.z = 1;


        GuiSystem.mainchar.rotation.z = Math.sin(timePassed * 0.3) * 0.15
        GuiSystem.package.position.y = Math.cos(5 + timePassed * 0.2) * 0.01
        GuiSystem.package.rotation.z = -Math.cos(5 + timePassed * 0.3) * 0.15

    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new GuiSystem();
        this.guiScene.add(this.orthoCam);
        this.guiScene.background = new Color(1, 1, 1)

        // this._renderer.setSize(window.innerWidth, window.innerHeight)
        // document.body.appendChild(this._renderer.domElement)
        this.createMainmenu();
        this.createGameOver();
        this.createVictory();

        this.changeState('mainmenu')

        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
        document.addEventListener('pointermove', this.onPointerMove);
        document.addEventListener('mousedown', () => {
            // console.log("nax ")


            if (this.activeAction !== undefined) {

                this.startButtonScale = 0.5;
                // yuck
                setTimeout(() => {
                    const lastAction = this.activeAction!;
                    this.uiAction$.next(lastAction);
                }, 250);

            }

        });

        return this.instance;
    }

    private static createGameOver() {
        const bgScale = 1712 / 1000
        const mainMenuBackground = new Mesh(new PlaneGeometry());
        mainMenuBackground.material = new MeshBasicMaterial({
            map: AssetManager.getInstance().getTexture('gameokuva.png'),
            transparent: true
        })
        mainMenuBackground.scale.setX(bgScale)
        mainMenuBackground.position.z = -9

        this.guiScene.add(mainMenuBackground)

        // everything
        this.gameOverSet.push(mainMenuBackground)

    }


    private static createVictory() {
        const bgScale = 1712 / 1000
        const mainMenuBackground = new Mesh(new PlaneGeometry());
        mainMenuBackground.material = new MeshBasicMaterial({
            map: AssetManager.getInstance().getTexture('hahmoalotusruutu1.png'),
            transparent: true
        })
        mainMenuBackground.scale.setX(bgScale)
        mainMenuBackground.position.z = -9


        const victory = new StaticItem('VOITTORUUTU.png');
        victory.position.z = -8
        victory.scale.setScalar(0.2)
        victory.position.y = 0.25
        victory.position.x = 0.4
        this.guiScene.add(victory);
        this.victorySet.push(victory);


        for (let index = 0; index < 10; index++) {
            const plate = new StaticItem('laulanen.png');
            plate.position.z = -5
            plate.scale.x = 1.5
            plate.scale.multiplyScalar(0.15)
            plate.position.x = 0.05 + Math.random() * 0.8
            plate.position.y = -0.45 + Math.random() * 0.1
            plate.position.y += Math.abs(plate.position.x) * 0.1
            plate.rotation.z = -0.7 + Math.random()
            this.victorySet.push(plate)
            this.guiScene.add(plate);
        }


        for (let index = 0; index < 10; index++) {
            const spoon = new StaticItem('lusikka.png');
            spoon.mainMesh.rotation.set(0, 0, 0)
            // spoon.mainMesh.scale.set(0,0,0)
            spoon.position.z = -5
            spoon.scale.x = 1.5
            spoon.scale.multiplyScalar(0.15)
            spoon.position.x = 0.05 + Math.random() * 0.8
            spoon.position.x = -spoon.position.x
            spoon.position.y = -0.45 + Math.random() * 0.1
            spoon.position.y += Math.abs(spoon.position.x) * 0.1
            spoon.rotation.z = -0.7 + Math.random()
            this.victorySet.push(spoon)
            this.guiScene.add(spoon);
        }

        const cleaner = new StaticItem('pesuaine.png');
        cleaner.position.z = -7
        cleaner.scale.y = 2.5
        cleaner.scale.multiplyScalar(1.3)
        cleaner.mainMesh.position.copy(new Vector3())
        // cleaner.scale.z = 0
        cleaner.position.x = -0.4
        // cleaner.position.x = 0.05 + Math.random() * 0.8
        // cleaner.position.x = -cleaner.position.x
        // cleaner.position.y = -0.25 + Math.random() * 0.1
        // cleaner.position.y += Math.abs(cleaner.position.x) * 0.1
        // cleaner.rotation.z = -0.7 + Math.random()
        this.victorySet.push(cleaner)
        this.guiScene.add(cleaner);


        this.guiScene.add(mainMenuBackground)

        // everything
        this.victorySet.push(mainMenuBackground)

    }

    private static createMainmenu() {

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


        const gamename = new Mesh(new PlaneGeometry());
        gamename.material = new MeshBasicMaterial({
            map: AssetManager.getInstance().getTexture('pelinnimi.png'),
            transparent: true
        })
        gamename.scale.setX(bgScale)
        gamename.position.z = -7



        this.startButton = new Mesh(new PlaneGeometry());
        this.startButton.material = new MeshBasicMaterial({
            map: AssetManager.getInstance().getTexture('playbutton.png'),
            transparent: true
        })
        const startbuttonScale = 457 / 210
        this.startButton.scale.setX(startbuttonScale)
        this.startButton.scale.multiplyScalar(0.2)
        this.startButtonContainer.position.z = -6
        this.startButtonContainer.add(this.startButton);
        this.startButtonContainer.position.x = 0.45
        this.startButtonContainer.position.y = -0.25

        this.guiScene.add(mainMenuBackground)
        this.guiScene.add(this.package)
        this.guiScene.add(this.mainchar)
        this.guiScene.add(gamename)
        this.guiScene.add(this.startButtonContainer);
        // this.startButtonContainer.position
        // this.mainchar.add(this.startButtonContainer);

        this.guiElements.push(this.startButton);
        this.guiActions.set(this.startButton, 'start');

        // everything
        this.mainMenuSet.push(mainMenuBackground, this.package, this.mainchar, gamename, this.startButtonContainer)

    }

    private static onWindowResize() {

        const aspect = window.innerWidth / window.innerHeight;

        GuiSystem.orthoCam.left = - GuiSystem.frustumSize * aspect / 2;
        GuiSystem.orthoCam.right = GuiSystem.frustumSize * aspect / 2;
        GuiSystem.orthoCam.top = GuiSystem.frustumSize / 2;
        GuiSystem.orthoCam.bottom = - GuiSystem.frustumSize / 2;

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


    static changeState(state: UiState) {

        this.gameOverSet.forEach(menuItem => {
            menuItem.visible = false
        })
        this.mainMenuSet.forEach(menuItem => {
            menuItem.visible = false
        })
        this.victorySet.forEach(menuItem => {
            menuItem.visible = false
        })
        switch (state) {
            case "gameover":

                this.gameOverSet.forEach(menuItem => {
                    menuItem.visible = true
                })
                break;
            case "mainmenu":
                this.mainMenuSet.forEach(menuItem => {
                    menuItem.visible = true
                })
                break;
            case 'victory':
                console.log("VIC")
                this.victorySet.forEach(menuItem => {
                    menuItem.visible = true
                })

                break;
            default:
                break;
        }
    }

}