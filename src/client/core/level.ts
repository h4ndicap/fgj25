import { Color, MathUtils, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Scene, Sphere, Vector3 } from "three";
import { MapGrid } from "./mapGrid";
import { Forcefield, ForcefieldOutcome, IDrainable } from "./drain";
import { Player } from "./player";
import { CleaningPickup, easeInQuint, easeOutCirc, easeOutCubic, easeOutExpo, easeOutSine, GameState, IUpdateable, VortexBubble } from "./common";
import { AssetManager } from "./assetManager";
import { StaticItem } from "./staticItem";
import { CleanableItem } from "./cleanableItem";
import { cleanablePairs } from "../imagefiles";
import { BubbleGameMaterial } from "./bubbleGameMaterial";
import { Subject } from "rxjs";
import { time } from "console";


export class Level implements IUpdateable {

    private static _current?: Level;

    static set current(level: Level | undefined) {
        this._current = level;
    }
    static get current(): Level | undefined {
        return this._current;
    }


    // targets: Object3D[] = []

    private _scene: Scene = new Scene();
    private _groundGrid: MapGrid;

    private _groundBack = new Mesh(new PlaneGeometry())
    private _waterLayer = new Mesh(new PlaneGeometry())
    private _waterStartOpacity = 0.7;
    private _waterMaterial = new BubbleGameMaterial({
        color: new Color(0xc9ac68),
        transparent: true,
        opacity: this._waterStartOpacity
    })
    private _waterOpacityTarget = this._waterStartOpacity;

    private _cleanables: CleanableItem[] = [];
    private _cleaningPickups: CleaningPickup[] = []

    private _centerDrain: Forcefield;

    private _vortexBubbles: VortexBubble[] = []

    private _levelstate: GameState = 'start';
    get levelState() {
        return this._levelstate;
    }
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

    addRandomPlants(files: string[], size: number, amount: number, easingFunction: (t: number) => number, minDist = 2) {
        for (let index = 0; index < amount; index++) {
            // mesh.position.y = 0.5

            const pick = Math.random() * files.length;
            const texName = files[Math.floor(pick)];
            const object = new StaticItem(texName)
            const dist = easingFunction(Math.random()) * size + minDist
            const newCoordinate = new Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize()
            newCoordinate.multiplyScalar(dist)
            // console.log(dist, size)
            object.position.copy(newCoordinate);
            // object.rotation.y = Math.random()
            this.scene.add(object)
        }
    }

    addCleaningPickups(size: number, amount: number, easingFunction: (t: number) => number) {
        for (let index = 0; index < amount; index++) {
            // mesh.position.y = 0.5

            const object = new CleaningPickup('pesuaine.png')

            const dist = easingFunction(Math.random()) * (size - 4) + 3
            const newCoordinate = new Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize().multiplyScalar(dist)
            object.position.copy(newCoordinate);

            // object.rotation.y = Math.random()
            this.scene.add(object)
            this._cleaningPickups.push(object)
        }
    }

    addRandomCleanables(objectNames: string[], size: number, amount: number, easingFunction: (t: number) => number) {
        for (let index = 0; index < amount; index++) {
            // mesh.position.y = 0.5

            const roll = Math.random() * objectNames.length;
            const paramPick = cleanablePairs[Math.floor(roll)];

            const object = new CleanableItem(paramPick)

            const dist = easingFunction(Math.random()) * (size - 2) + 2
            const newCoordinate = new Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize().multiplyScalar(dist)
            object.position.copy(newCoordinate);
            // object.rotation.y = Math.random()
            this.scene.add(object)
            this._cleanables.push(object);
        }
    }

    createVortexBubbles(poolSize: number, spawnDistance: number) {
        for (let index = 0; index < poolSize; index++) {
            const newBubble = new VortexBubble('pikkukupla.png')
            const newCoordinate = new Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize().multiplyScalar(Math.random() * spawnDistance)
            newBubble.position.copy(newCoordinate);
            newBubble.rotation.x = -1
            const bubbleSize = 0.2 + Math.random() * 0.8
            newBubble.scale.multiplyScalar(bubbleSize)
            newBubble.mass = 0.1 + bubbleSize
            this.scene.add(newBubble);
            this._vortexBubbles.push(newBubble);
        }
    }

    constructor(gridSize: number) {
        this._groundGrid = new MapGrid(gridSize);
        this._scene.add(this._groundGrid);
        const playerStartpoint = new Vector3(Math.random(), 0, Math.random()).normalize().multiplyScalar(gridSize / 1.5)
        this.player.position.copy(playerStartpoint);
        this._scene.add(this._player)
        this.scene.background = new Color().setScalar(0.3)
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
        this._groundBack.scale.setScalar(gridSize * 2)
        this.add(this._groundBack)



        // try this later maybe?
        this._waterLayer.rotation.x = -Math.PI / 2
        this._waterLayer.position.y = 1
        this._waterLayer.scale.setScalar(gridSize * 4)
        this._waterLayer.material = this._waterMaterial
        this.add(this._waterLayer);
        this._waterLayer.renderOrder = 100;

        this.addRandomPlants(['kivikasvi.png', 'simpukka1.png', 'simpukka2.png'], 15, 200, easeOutCubic)
        this.addRandomPlants(['kivikasvi.png', 'simpukka1.png', 'simpukka2.png'], 13, 200, easeOutExpo)
        this.addRandomPlants(['kivikasvi.png', 'simpukka1.png', 'simpukka2.png'], 17, 100, easeOutCirc)
        // this.addRandomCleanables(['plate', 'spoon'], 10, 20, easeOutCubic)
        this.addRandomCleanables(['plate', 'spoon'], 10, 10, easeOutCubic)
        this.addCleaningPickups(10, 3, easeOutCirc)
        this.createVortexBubbles(100, 7);

        this.obstacles.push(...this._groundGrid.obstacles)
        this._cleanables.forEach(element => {
            if (element.collision !== undefined) {
                this.obstacles.push(element)
            }
        });
        this.obstacles.push(...this._groundGrid.obstacles)

        this._centerDrain = new Forcefield(10, 10, -0.1, 10)
        this.scene.add(this._centerDrain)
        this.gameStateChange$.next('start')

    }
    obstacles: Object3D[] = []
    update(delta: number, timePassed: number): void {

        this._player.obstacles = this.obstacles;
        this._player.update(delta, timePassed);
        this.updateForcefields(timePassed);
        this.applyCleaning(delta);
        this.checkForPickups();
        for (let index = 0; index < this._cleaningPickups.length; index++) {
            const element = this._cleaningPickups[index];
            element.update(delta, timePassed)
        }
        this._cleanables.forEach(element => {
            element.update(delta, timePassed)
        });
        this._vortexBubbles.forEach(element => {
            element.update(delta, timePassed)
        });

        this._waterMaterial.opacity = MathUtils.lerp(this._waterMaterial.opacity, this._waterOpacityTarget, 0.1)

        if (this.levelState === "noescape" || this.levelState === 'cleaned') {
            // console.log("NOOESCAPE")
            const length = this.player.position.length()
            if (length < 2) {
                this.player.scale.setScalar(length / 2)
            }
        } else {
            this.player.scale.setScalar(1);
        }
        if (this.levelState === "drained") {
            this.player.visible = false;
        }

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
            if (inRange && !cleanable.isClean) {
                const cleaningAmount = delta;
                // console.warn("CLEANING RANGE!")
                cleanable.dirtiness -= cleaningAmount;
                this.player.cleaningAmount -= cleaningAmount * 0.25;
                if (cleanable.isClean) {
                    let dirtyLeft = 0;
                    for (let index = 0; index < this._cleanables.length; index++) {
                        const element = this._cleanables[index];
                        dirtyLeft += element.isClean ? 0 : 1;
                        // console.log("all cleaned");
                    }
                    console.log("dirty left", dirtyLeft);
                    this._waterOpacityTarget = this._waterStartOpacity * dirtyLeft / this._cleanables.length
                    if (dirtyLeft <= 0) {

                        if (this._levelstate !== 'cleaned') {
                            // pla.position.copy(fieldPos)
                            this._levelstate = 'cleaned';
                            this.scene.remove(this._centerDrain);
                            this._centerDrain = new Forcefield(10, 10, -0.1, 30)
                            this.scene.add(this._centerDrain)
                            setTimeout(() => {
                                this.gameStateChange$.next('cleaned')
                            }, 3000);
                            this.player.controlEnabled = false;

                        }
                        // console.log("all cleaned");
                    }
                }
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



    applyForcefield(field: Forcefield, target: IDrainable, time?: number): ForcefieldOutcome {

        const effectInfluence = field.getTargetMagnitude(target);
        let outcome: ForcefieldOutcome = "skipped"
        // console.log(effectInfluence + " influence")
        if (effectInfluence > 0) {
            const fieldPos = field.getWorldPosition(new Vector3());
            const movement = new Vector3().subVectors(target.position, fieldPos);
            const lengthToTarget = movement.length();
            const directionToTarget = movement.normalize()
            // .multiplyScalar(effectInfluence * field.force * delta);
            const positionAdjustment = directionToTarget.clone().multiplyScalar(effectInfluence * field.force).divideScalar(target.mass)

            // if we would fly over the centerpoint, clamp to it, add small epsilon
            if (positionAdjustment.length() > lengthToTarget) {
                // console.error("OVERSHOOT")
                outcome = 'drained'
            } else
                if (positionAdjustment.length() > target.ownSpeed) {
                    target.position.add(positionAdjustment);
                    return outcome = 'noescape'
                    // if (target === this.player)
                    //     console.log("NONE SHALL PASS", this.player)
                } else {
                    // console.warn("undershoot", positionAdjustment.length(), lengthToTarget)
                    outcome = 'moved'
                    target.position.add(positionAdjustment);
                }
        }
        return outcome;
    }



    updateForcefields(time: number) {

        const playerOutcome = this.applyForcefield(this._centerDrain, this.player)
        // const playerOutcome: = 'noescape'
        switch (playerOutcome) {
            case 'drained':

                if (this._levelstate !== 'drained' && this.levelState !== 'cleaned') {
                    // pla.position.copy(fieldPos)
                    console.log("FAILFAILFAIL", this.levelState)
                    this._levelstate = 'drained';
                    setTimeout(() => {
                        this.gameStateChange$.next('drained')
                    }, 1500);

                }
                break;

            case 'noescape':
                if (this._levelstate !== 'noescape' && this.levelState !== 'cleaned') {
                    // pla.position.copy(fieldPos)
                    this._levelstate = 'noescape';
                }
                // sound?
                break;
            default:
                break;
        }
        this._vortexBubbles.forEach(element => {
            const bubbleOutcome = this.applyForcefield(this._centerDrain, element, time)
            if (bubbleOutcome === "drained") {
                const newStart = new Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize().multiplyScalar(7 + Math.random())
                element.position.copy(newStart);
                element.lifetime = 0;
            }
            if (time !== undefined) {
                // random wobbly
                const rotationalX = Math.sin(time * 3) * 0.01
                const rotationalY = Math.cos(time * 2) * 0.01
                element.position.x += rotationalX;
                element.position.z += rotationalY;
                // console.log(rotationalX)
            }
            // center is zero so we can just grab the length
            const distanceToCenter = element.position.length()
            const distancePhase = MathUtils.lerp(0, 0.7, distanceToCenter / 10);
            // element.position.y = 1 - (distancePhase * distancePhase)
            element.position.y = distancePhase

        });

        this._cleanables.forEach(cleanable => {
            cleanable.bubblePool.forEach(bubble => {
                // this.applyForcefield(this._centerDrain, bubble)
            });
        });
        // this._centerDrain
    }
}