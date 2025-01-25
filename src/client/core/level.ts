import { Color, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Scene, Sphere, Vector3 } from "three";
import { Forcefield, MapGrid } from "./mapGrid";
import { Player } from "./player";
import { GameState, IUpdateable } from "./common";
import { AssetManager } from "./assetManager";
import { StaticItem } from "./staticItem";
import { CleanableItem } from "./cleanableItem";
import { cleanablePairs } from "../imagefiles";
import { BubbleGameMaterial } from "./bubbleGameMaterial";
import { Subject } from "rxjs";


export class Level implements IUpdateable {

    private static _current: Level;

    static set current(level: Level) {
        this._current = level;
    }
    static get current() {
        return this._current;
    }


    // targets: Object3D[] = []

    private _scene: Scene = new Scene();
    private _groundGrid: MapGrid;

    private _groundBack = new Mesh(new PlaneGeometry())
    private _waterLayer = new Mesh(new PlaneGeometry())

    private _cleanables: CleanableItem[] = [];
    private _cleaningPickups: StaticItem[] = []

    private _levelstate: GameState = 'start';
    private _player = new Player();

    get player() {
        return this._player;
    }

    get scene() {
        return this._scene;
    }

    add(object: Object3D) {
        this.scene.add(object);
    }


    gameStateChange$: Subject<GameState> = new Subject<GameState>();

    addRandomPlants(files: string[], size: number, amount: number) {
        for (let index = 0; index < amount; index++) {
            // mesh.position.y = 0.5

            const pick = Math.random() * files.length;
            const texName = files[Math.floor(pick)];
            const randX = Math.random() * size - size / 2;
            const randY = Math.random() * size - size / 2;

            const object = new StaticItem(texName)

            object.position.x = randX;
            object.position.z = randY;
            // object.rotation.y = Math.random()
            this.scene.add(object)
        }
    }

    addCleaningPickups(size: number, amount: number) {
        for (let index = 0; index < amount; index++) {
            // mesh.position.y = 0.5

            const randX = Math.random() * size - size / 2;
            const randY = Math.random() * size - size / 2;

            const object = new StaticItem('pesuaine.png')

            object.position.x = randX;
            object.position.z = randY;
            // object.rotation.y = Math.random()
            this.scene.add(object)
            this._cleaningPickups.push(object)
        }
    }

    addRandomCleanables(objectNames: string[], size: number, amount: number) {
        for (let index = 0; index < amount; index++) {
            // mesh.position.y = 0.5

            const roll = Math.random() * objectNames.length;
            const paramPick = cleanablePairs[Math.floor(roll)];
            const randX = Math.random() * size - size / 2;
            const randY = Math.random() * size - size / 2;

            const object = new CleanableItem(paramPick)

            object.position.x = randX;
            object.position.z = randY;
            // object.rotation.y = Math.random()
            this.scene.add(object)
            this._cleanables.push(object);
        }
    }

    constructor(gridSize: number, obstacles: { x: number, y: number }[], forcefields: Forcefield[]) {
        this._groundGrid = new MapGrid(gridSize);
        this._scene.add(this._groundGrid);
        this._scene.add(this._player)
        this.scene.background = new Color().setScalar(0.3)
        this._groundGrid.setForcefields(forcefields);
        // this._groundGrid.setObstacles(obstacles);

        const groundTex = AssetManager.getInstance().getTexture('maa.png')
        groundTex?.repeat.set(2, 2)
        groundTex!.wrapS = 1002
        groundTex!.wrapT = 1002
        groundTex!.rotation = 2
        this._groundBack.material = new MeshBasicMaterial({
            map: groundTex
        })

        // this._groundBack.material.
        this._groundBack.rotation.x = -Math.PI / 2
        this._groundBack.position.y = -0.1
        this._groundBack.scale.setScalar(gridSize)
        this.add(this._groundBack)



        // try this later maybe?
        this._waterLayer.rotation.x = -Math.PI / 2
        this._waterLayer.position.y = 1
        this._waterLayer.scale.setScalar(gridSize)
        this._waterLayer.material = new BubbleGameMaterial({
            color: new Color(0, 0, 1),
            transparent: true,
            opacity: 0.2
        })
        // this.add(this._waterLayer);

        this.addRandomPlants(['kivikasvi.png', 'simpukka1.png', 'simpukka2.png'], 20, 200)
        this.addRandomCleanables(['plate', 'spoon'], 20, 20)
        this.addCleaningPickups(20, 10)

        this.obstacles.push(...this._groundGrid.obstacles)
        this._cleanables.forEach(element => {
            if (element.collision !== undefined) {
                this.obstacles.push(element)
            }
        });
        this.obstacles.push(...this._groundGrid.obstacles)
        this.gameStateChange$.next('start')

    }
    obstacles: Object3D[] = []
    update(delta: number, timePassed: number): void {

        this._player.obstacles = this.obstacles;
        this._player.update(delta, timePassed);
        this.updateForcefields();
        this.applyCleaning(delta);
        this.checkForPickups();
    }

    applyCleaning(delta: number) {
        if (!this.player.cleaning) return;
        const testSphere = new Sphere();
        testSphere.radius = 0.5
        const center = new Vector3();
        this._cleanables.forEach(cleanable => {
            cleanable.getWorldPosition(center);
            // console.log(...center)
            testSphere.center = center;
            const inRange = testSphere.containsPoint(this.player.position)
            if (inRange) {
                const cleaningAmount = delta;
                // console.warn("CLEANING RANGE!")
                cleanable.dirtiness -= cleaningAmount;
                this.player.cleaningAmount -= cleaningAmount * 0.25;

            }
        });
    }

    checkForPickups() {
        const testSphere = new Sphere();
        testSphere.radius = 0.5
        const center = new Vector3();
        let removeIndex: number | undefined = undefined;
        this._cleaningPickups.forEach((pickup, index) => {
            pickup.getWorldPosition(center);
            // console.log(...center)
            testSphere.center = center;
            const inRange = testSphere.containsPoint(this.player.position)
            if (inRange && this.player.cleaningAmount < 0.75) {
                this.player.cleaningAmount = 1;
                removeIndex = index;
                pickup.parent?.remove(pickup);
            }
        });
        if (removeIndex !== undefined) {
            this._cleaningPickups.splice(removeIndex, 1);
        }
    }

    updateForcefields() {

        this._groundGrid.forceFields.forEach(field => {

            const effectInfluence = field.getTargetMagnitude(this.player);
            if (effectInfluence > 0) {

                const targetPos = field.getWorldPosition(new Vector3());
                const movement = new Vector3().subVectors(this.player.position, targetPos);
                const lengthToTarget = movement.length();
                const directionToTarget = movement.normalize()
                // .multiplyScalar(effectInfluence * field.force * delta);
                const positionAdjustment = directionToTarget.clone().multiplyScalar(effectInfluence * field.force)


                if (positionAdjustment.length() > this.player.maxSpeed) {
                    // console.error("YOU WENT DOWN THE DRAIN! :(")
                    // this.player.controlEnabled = false;
                    // if (this.gameStateChange$.)
                    if (this._levelstate !== 'drained' && this._levelstate !== 'noescape') {
                        this._levelstate = 'noescape';
                        this.gameStateChange$.next('noescape')
                    }
                }
                // if we would fly over the centerpoint, clamp to it, add small epsilon
                if (positionAdjustment.length() > lengthToTarget) {
                    // console.error("OVERSHOOT")
                    if (this._levelstate !== 'drained') {
                        this.player.position.copy(targetPos)
                        this._levelstate = 'drained';
                        this.gameStateChange$.next('drained')

                    }
                } else {
                    // console.warn("undershoot", positionAdjustment.length(), lengthToTarget)
                    this.player.position.add(positionAdjustment);
                }
            }
        })
    }

}