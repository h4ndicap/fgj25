import { fromEvent } from "rxjs";
import { CircleGeometry, Color, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Texture, Vector3 } from "three";
import { IUpdateable } from "./common";


type InputAction = 'left' | 'right' | 'up' | 'down'

export class Player extends Object3D implements IUpdateable {

    private _inputsActive = new Set<InputAction>()

    private _playerGraphics = new Mesh(new PlaneGeometry())
    private _playerGraphicsOffset = new Vector3(0.135, 1, 0.)

    private _playerMaterial = new MeshBasicMaterial();

    private _shadow = new Mesh(new CircleGeometry())

    private _movementVector = new Vector3();

    worldTarget = new Vector3();

    private _movementScaling = 0.07;

    acceleration = 2 * this._movementScaling;
    deceleration = 0.25 * this._movementScaling;

    maxSpeed = 1 * this._movementScaling;

    normalizedSpeed = 0;

    constructor() {
        super();
        this._playerMaterial.transparent = true;
        this._playerGraphics.material = this._playerMaterial;
        this._playerGraphics.position.copy(this._playerGraphicsOffset)
        this.add(this._playerGraphics);

        this._shadow.rotateX(Math.PI / 2)
        this._shadow.material = new MeshBasicMaterial({
            opacity: 0.5,
            color: new Color(0, 0, 0),
            transparent: true
        })
        this._shadow.scale.setScalar(0.35)
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
        this.position.add(this._movementVector);
        const movementExcess = this._movementVector.clone().multiplyScalar(10)
        this.worldTarget.copy(this.position).add(movementExcess)

        this._playerGraphics.position.y = this._playerGraphicsOffset.y + this.normalizedSpeed * 0.25 + Math.sin(_timePassed * 0.5) * 0.2 + Math.cos(_timePassed * 5.25) * 0.1;
        // this._playerGraphics.position.x = Math.cos(_timePassed * 6.5) * 0.2;
        // console.log(...this._movementVector)
        if (this._movementVector.x > 0) {
            this._playerGraphics.scale.x = -1;
            this._playerGraphics.position.x = -this._playerGraphicsOffset.x
        } else {
            this._playerGraphics.scale.x = 1;
            this._playerGraphics.position.x = this._playerGraphicsOffset.x
        }
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
        this._playerGraphics.lookAt(cameraPos);
        this._playerGraphics.rotateY(Math.PI)
    }

    setTextures(idle: Texture) {
        this._playerMaterial.map = idle;
    }

}