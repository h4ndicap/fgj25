import { fromEvent } from "rxjs";
import { CircleGeometry, Color, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Texture, Vector3 } from "three";
import { IUpdateable } from "./common";
import { RaycastManager } from "./raycastManager";


type InputAction = 'left' | 'right' | 'up' | 'down' | 'clean'

type CharacterPiece = 'body' | 'bubble' | 'arms' | 'tail'

export class Player extends Object3D implements IUpdateable {

    private _inputsActive = new Set<InputAction>()

    // test agains these before finishing move
    obstacles: Object3D[] = []

    // private _playerPivot = new AxesHelper();
    private _playerPivot = new Object3D();
    // private _playerGraphics = new Mesh(new PlaneGeometry())
    private _playerGraphicsContainer = new Object3D();
    private _playerGraphicsOffset = new Vector3(0.12, 0.25, 0.01)


    private _characterGraphics: Map<CharacterPiece, { mesh: Mesh, material: MeshBasicMaterial }> = new Map();

    private _shadow = new Mesh(new CircleGeometry())

    private _movementVector = new Vector3();

    // where the player would move without any change
    private _movementVectorRaw = new Vector3();

    worldTarget = new Vector3();

    private _cameraPos = new Vector3();

    private _movementScaling = 0.07;

    acceleration = 2 * this._movementScaling;
    deceleration = 0.25 * this._movementScaling;

    maxSpeed = 1 * this._movementScaling;
    maxSpeedCleaning = 0.5 * this._movementScaling;

    floatHeight = 1;

    normalizedSpeed = 0;

    collisionVelocityLoss = 0.8;


    // flip this if the player loses control of the character, for transitions and animations and so
    controlEnabled = true;

    cleaning = false;

    constructor() {
        super();
        this.add(this._playerPivot);
        this._playerPivot.position.y = 1
        this._playerPivot.add(this._playerGraphicsContainer)

        const createPiece = (piece: CharacterPiece, offset = 0) => {
            const mesh = new Mesh(new PlaneGeometry());
            const mat = new MeshBasicMaterial({
                transparent: true,
            });
            mesh.material = mat
            this._characterGraphics.set(piece, { mesh: mesh, material: mat })
            mesh.position.z = offset;
            this._playerGraphicsContainer.add(mesh)
        }
        createPiece('arms', 0.1)
        createPiece('body', -0.1)
        createPiece('bubble')
        createPiece('tail', -0.2)

        this._playerGraphicsContainer.scale.y = 3608 / 3000

        // this._playerGraphics.material = this._playerMaterial;
        this._playerGraphicsContainer.position.copy(this._playerGraphicsOffset)
        // this.add(this._playerGraphics);

        // this._shadow.rotateX(Math.PI / 2)
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
                case 'Space':
                    this._inputsActive.add("clean")
                    this.cleaning = true;
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
                case 'Space':
                    this._inputsActive.delete("clean")
                    this.cleaning = false;
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
        // effectively a helper for the camera
        const movementExcess = this._movementVectorRaw.clone().multiplyScalar(15)
        this.worldTarget.copy(this.position).add(movementExcess)
        if (collisionTest.hit) {
            // console.error("BÄNG")

            // console.log(collisionTest.normalVector);
            this._movementVector.reflect(collisionTest.normalVector!);

            this._movementVector.multiplyScalar(this.collisionVelocityLoss);

            // const reflectionVector = 
        }
        if (this.controlEnabled) {
            this.position.add(this._movementVector);

        }

        if (this.cleaning) {
            this._playerPivot.position.y = Math.sin(_timePassed * 12.5) * 0.1
            this._playerPivot.position.x = Math.cos(_timePassed * 25.5) * 0.1
            this._playerPivot.position.y += 0.5
        } else {
            this._playerPivot.position.y = this.normalizedSpeed * 0.25 + Math.sin(_timePassed * 0.5) * 0.2 + Math.cos(_timePassed * 5.25) * 0.1;
            this._playerPivot.position.y += this.floatHeight

        }
        // this._playerGraphics.position.x = Math.cos(_timePassed * 6.5) * 0.2;
        // console.log(...this._movementVector)

        // this._playerGraphics.rotation.y = 1
        if (this._inputsActive.has('right')) {
            this._playerPivot.scale.x = -1;
        } else if (this._inputsActive.has('left')) {
            this._playerPivot.scale.x = 1;
        }
        this._playerPivot.lookAt(this._cameraPos);
        // this._playerPivot.rotateY(Math.PI)
        // this._playerPivot.rotateY(Math.PI)
        // this._playerPivot.rotateX(-0.4)as
        this._playerPivot.rotation.z = Math.sin(_timePassed * 1.7) * 0.17;
        const bubble = this._characterGraphics.get('bubble')!.mesh
        if (this.cleaning) {
            bubble.scale.y = 0.8 + Math.cos(_timePassed * 1.7) * 0.1;
            bubble.scale.x = 1.4 + Math.sin(_timePassed * 1.7) * 0.1;
            bubble.position.x = Math.sin(_timePassed) * 0.05;
            bubble.position.y = -0.05 + Math.cos(2 + _timePassed * 1.7) * 0.017;
        } else {
            bubble.position.y = Math.cos(2 + _timePassed * 1.7) * 0.017;
            bubble.scale.y = 1.2 + Math.cos(_timePassed * 1.7) * 0.1;
            bubble.scale.x = 1.2 + Math.sin(_timePassed * 1.7) * 0.1;
            bubble.position.x = Math.sin(_timePassed) * 0.05;
        }

        const body = this._characterGraphics.get('body')!.mesh
        const arms = this._characterGraphics.get('arms')!.mesh
        body.rotation.z = Math.cos(2 + _timePassed * 1.7) * 0.08;
        body.rotation.z = Math.cos(2 + _timePassed * 1.7) * 0.08;
        body.position.x = Math.sin(_timePassed) * 0.1 - 0.05;

        arms.rotation.z = Math.cos(2 + _timePassed * 1.7) * 0.08;
        arms.rotation.z = Math.cos(2 + _timePassed * 1.7) * 0.08;
        arms.position.x = Math.sin(_timePassed) * 0.1 - 0.05;


        const tail = this._characterGraphics.get('tail')!.mesh
        tail.rotation.z = Math.cos(2 + _timePassed * 1.7) * 0.08;
        tail.rotation.y = Math.cos(2 + _timePassed * 1.7) * 0.08;
        tail.position.x = Math.sin(_timePassed) * 0.1 - 0.05;
    }

    private updateMovementVector(delta: number) {

        const dtAcc = delta * this.acceleration;
        const dtDec = delta * this.deceleration;

        if (this._inputsActive.has('left')) {
            if (this._movementVector.x > 0) {
                this._movementVector.x = Math.max(this._movementVector.x - dtDec, 0);
            }
            this._movementVectorRaw.x -= dtAcc
            this._movementVector.x -= dtAcc
        } else if (this._inputsActive.has('right')) {
            if (this._movementVector.x < 0) {
                this._movementVector.x = Math.min(this._movementVector.x + dtDec, 0);
            }
            this._movementVectorRaw.x += dtAcc
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
            if (this._movementVector.z < 0) {
                this._movementVector.z = Math.min(this._movementVector.z + dtDec, 0);
            }
            this._movementVector.z += dtAcc
            this._movementVectorRaw.z += dtAcc
        } else if (this._inputsActive.has('up')) {
            if (this._movementVector.z > 0) {
                this._movementVector.z = Math.max(this._movementVector.z - dtDec, 0);
            }
            this._movementVector.z -= dtAcc
            this._movementVectorRaw.z -= dtAcc
        } else {
            // decay
            if (this._movementVector.z > 0) {
                this._movementVector.z = Math.max(this._movementVector.z - dtDec, 0);
            } else {
                this._movementVector.z = Math.min(this._movementVector.z + dtDec, 0);
            }
        }

        // how close we are to max speed? no need to completely clamp for simplicity

        if (this.cleaning) {
            this._movementVector.clampLength(0, this.maxSpeedCleaning)

        } else {
            this._movementVector.clampLength(0, this.maxSpeed)
        }
        this._movementVectorRaw.clampLength(0, this.maxSpeed)

    }



    setCameraLookat(cameraPos: Vector3) {
        // console.log(cameraPos);
        // const vec = new 
        this._cameraPos.copy(cameraPos);

        // this._playerGraphics.rotateZ()
    }

    // setTextures(idle: Texture) {
    //     this._playerMaterial.map = idle;
    // }


    setTextures(body: Texture, bubble: Texture, tail: Texture, arms: Texture) {
        // this._playerMaterial.map = idle;
        if (this._characterGraphics.has('arms')) {
            this._characterGraphics.get('arms')!.material.map = arms;
        }
        if (this._characterGraphics.has('body')) {
            this._characterGraphics.get('body')!.material.map = body;
        }
        if (this._characterGraphics.has('bubble')) {
            this._characterGraphics.get('bubble')!.material.map = bubble;
        }
        if (this._characterGraphics.has('tail')) {
            this._characterGraphics.get('tail')!.material.map = tail;
        }
    }



    // raycast from current position to target position, if hit, return true
    checkCollision() {

        const dir = this._movementVector.clone().normalize();
        const results = RaycastManager.getInstance().raycast(this.position.clone().setY(0.5), dir, this.obstacles, this._movementVector.length());

        // result.
        return { hit: results.length > 0, normalVector: results.length > 0 ? results[0].normal : undefined }
    }

}