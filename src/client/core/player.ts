import { fromEvent } from "rxjs";
import { CircleGeometry, Color, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Vector3 } from "three";
import { IUpdateable } from "./common";


type InputAction = 'left' | 'right' | 'up' | 'down'

export class Player extends Object3D implements IUpdateable {

    private _inputsActive = new Set<InputAction>()

    private _playerGraphics = new Mesh(new PlaneGeometry())

    private _shadow = new Mesh(new CircleGeometry())

    private _movementVector = new Vector3();

    worldTarget = new Vector3();

    private _movementScaling = 0.07;

    acceleration = 2 * this._movementScaling;
    deceleration = 0.25 * this._movementScaling;

    maxSpeed = 1 * this._movementScaling;

    constructor() {
        super();
        this.add(this._playerGraphics);
        this._playerGraphics.position.y += 0.5
        this.add(this._shadow);
        this._shadow.rotateX(Math.PI / 2)
        this._shadow.material = new MeshBasicMaterial({
            opacity: 0.5,
            color: new Color(0, 0, 0),
            transparent: true
        })
        this._shadow.scale.setScalar(0.35)
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
        this.position.add(this._movementVector);
        const movementExcess = this._movementVector.clone().multiplyScalar(10)
        this.worldTarget.copy(this.position).add(movementExcess)
        // console.log(...this._movementVector)
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
        const movementPhase = this._movementVector.length() / this.maxSpeed
        if (movementPhase >= 1) {
            this._movementVector.divideScalar(movementPhase);
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
        this._playerGraphics.lookAt(cameraPos);
        this._playerGraphics.rotateY(Math.PI)
    }

}