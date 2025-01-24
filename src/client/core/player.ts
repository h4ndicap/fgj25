import { fromEvent } from "rxjs";
import { AxesHelper, CircleGeometry, Color, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, SphereGeometry, Texture, Vector3 } from "three";
import { IUpdateable } from "./common";
import { RaycastManager } from "./raycastManager";
import { Obstacle } from "./mapGrid";
import { Level } from "./level";


type InputAction = 'left' | 'right' | 'up' | 'down'

export class Player extends Object3D implements IUpdateable {

    private _inputsActive = new Set<InputAction>()

    obstacles: Object3D[] = []

    private _playerPivot = new AxesHelper();
    private _playerGraphics = new Mesh(new PlaneGeometry())
    private _playerGraphicsOffset = new Vector3(0.12, 0.25, 0.01)

    private _playerMaterial = new MeshBasicMaterial();

    private _shadow = new Mesh(new CircleGeometry())

    private _movementVector = new Vector3();

    worldTarget = new Vector3();

    private _cameraPos = new Vector3();

    private _movementScaling = 0.07;

    acceleration = 2 * this._movementScaling;
    deceleration = 0.25 * this._movementScaling;

    maxSpeed = 1 * this._movementScaling;

    normalizedSpeed = 0;

    constructor() {
        super();
        this.add(this._playerPivot);
        this._playerPivot.position.y = 1
        this._playerPivot.add(this._playerGraphics)
        this._playerMaterial.transparent = true;
        this._playerGraphics.material = this._playerMaterial;
        this._playerGraphics.position.copy(this._playerGraphicsOffset)
        // this.add(this._playerGraphics);

        this._shadow.rotateX(Math.PI / 2)
        this._shadow.material = new MeshBasicMaterial({
            opacity: 0.25,
            color: new Color(0, 0, 0),
            transparent: true
        })
        this._shadow.scale.setScalar(0.35)
        this._shadow.scale.y = 0.2
        this.add(this._shadow);
        // console.log("player");
        fromEvent<KeyboardEvent>(document, 'keydown').subscribe((key) => {
            switch (key.code) {
                case 'KeyA':
                    this._inputsActive.add("left")
                    break;
                case 'KeyD':
                    this._inputsActive.add("right")
                    break;
                case 'KeyW':
                    this._inputsActive.add("up")
                    break;
                case 'KeyS':
                    this._inputsActive.add("down")
                    break;
                default:
                    break;
            }
        })

        fromEvent<KeyboardEvent>(document, 'keyup').subscribe((key) => {
            switch (key.code) {
                case 'KeyA':
                    this._inputsActive.delete("left")
                    break;
                case 'KeyD':
                    this._inputsActive.delete("right")
                    break;
                case 'KeyW':
                    this._inputsActive.delete("up")
                    break;
                case 'KeyS':
                    this._inputsActive.delete("down")
                    break;
                default:
                    break;
            }
        })
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(delta: number, _timePassed: number): void {
        // throw new Error("Method not implemented.");
        if (this._inputsActive.size > 0) {
            // console.log(...this._inputsActive.keys())
        }
        this.updateMovementVector(delta);

        const collisionTest = this.checkCollision();
        if (collisionTest.hit) {
            console.error("BÄNG")
        }
        this.position.add(this._movementVector);

        // effectively a helper for the camera
        const movementExcess = this._movementVector.clone().multiplyScalar(30)
        this.worldTarget.copy(this.position).add(movementExcess)

        this._playerPivot.position.y = 1 + this.normalizedSpeed * 0.25 + Math.sin(_timePassed * 0.5) * 0.2 + Math.cos(_timePassed * 5.25) * 0.1;
        // this._playerGraphics.position.x = Math.cos(_timePassed * 6.5) * 0.2;
        // console.log(...this._movementVector)

        // this._playerGraphics.rotation.y = 1
        if (this._movementVector.x > 0) {
            this._playerPivot.scale.x = -1;
        } else {
            this._playerPivot.scale.x = 1;
        }
        this._playerPivot.lookAt(this._cameraPos);
        this._playerPivot.rotateY(Math.PI)
        this._playerPivot.rotateX(-0.4)
        this._playerPivot.rotation.z = Math.sin(_timePassed * 1.7) * 0.17;
    }

    private updateMovementVector(delta: number) {

        const dtAcc = delta * this.acceleration;
        const dtDec = delta * this.deceleration;

        if (this._inputsActive.has('left')) {
            if (this._movementVector.x > 0) {
                this._movementVector.x = Math.max(this._movementVector.x - dtDec, 0);
            }
            this._movementVector.x -= dtAcc
        } else if (this._inputsActive.has('right')) {
            if (this._movementVector.x < 0) {
                this._movementVector.x = Math.min(this._movementVector.x + dtDec, 0);
            }
            this._movementVector.x += dtAcc
        } else {
            // decay
            if (this._movementVector.x > 0) {
                this._movementVector.x = Math.max(this._movementVector.x - dtDec, 0);
            } else {
                this._movementVector.x = Math.min(this._movementVector.x + dtDec, 0);
            }
        }


        if (this._inputsActive.has('down')) {
            if (this._movementVector.z > 0) {
                this._movementVector.z = Math.max(this._movementVector.z - dtDec, 0);
            }
            this._movementVector.z -= dtAcc
        } else if (this._inputsActive.has('up')) {
            if (this._movementVector.z < 0) {
                this._movementVector.z = Math.min(this._movementVector.z + dtDec, 0);
            }
            this._movementVector.z += dtAcc
        } else {
            // decay
            if (this._movementVector.z > 0) {
                this._movementVector.z = Math.max(this._movementVector.z - dtDec, 0);
            } else {
                this._movementVector.z = Math.min(this._movementVector.z + dtDec, 0);
            }
        }

        // how close we are to max speed? no need to completely clamp for simplicity
        this.normalizedSpeed = this._movementVector.length() / this.maxSpeed
        if (this.normalizedSpeed >= 1) {
            this._movementVector.divideScalar(this.normalizedSpeed);
        }
        // console.log(movementPhase);

        // this._movementVector.x += delta * (this._inputsActive.has('left') ? -1 : 0)
        // this._movementVector.x += delta * (this._inputsActive.has('right') ? 1 : 0)
        // this._movementVector.z += delta * (this._inputsActive.has('up') ? 1 : 0)
        // this._movementVector.z += delta * (this._inputsActive.has('down') ? -1 : 0)

    }



    setCameraLookat(cameraPos: Vector3) {
        // console.log(cameraPos);
        // const vec = new 
        this._cameraPos.copy(cameraPos);

        // this._playerGraphics.rotateZ()
    }

    setTextures(idle: Texture) {
        this._playerMaterial.map = idle;
    }


    // raycast from current position to target position, if hit, return true
    checkCollision() {
        const rm = RaycastManager.getInstance()
        const results = rm.raycast(this.position, this.position.clone().add(this._movementVector), this.obstacles);
        // result.
        if (results.length > 0) {
            console.log("POX", results)

            const hitMark = new Mesh(new SphereGeometry())
            hitMark.material = new MeshBasicMaterial({
                color: new Color(1, 0, 0)
            })
            hitMark.position.copy(results[0].point)
            hitMark.position.y = 2;
            hitMark.scale.setScalar(0.01)
            hitMark.scale.y = 1;

            Level.current.scene.add(hitMark)

        }
        return { hit: false, normalVector: undefined }
    }

}