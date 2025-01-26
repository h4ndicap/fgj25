import { Vector3 } from "three"
import { IDrainable } from "./drain"
import { StaticItem } from "./staticItem"

export interface IUpdateable {
    update(delta: number, timePassed: number): void
}

export type GameState = 'start' | 'drained' | 'cleaned' | 'noescape'


export class VortexBubble extends StaticItem implements IDrainable {
    mass: number = 0.5
    ownSpeed: number = 0

}

export class EffectBubble extends StaticItem implements IUpdateable, IDrainable {
    dying = false;
    phase = 0;
    speed = 1;

    startPosition = new Vector3();
    update(delta: number, timePassed: number): void {
        this.phase += delta * this.speed;
        // this._phase = Math.min(this._phase, 1)
        if (this.phase > 1) {
            this.phase = 0;
            this.newPosition()
            if (this.dying) {
                this.parent?.remove(this);
            }
        }
        this.mainMesh.position.y = 1 + this.phase * 2;
        this.mainMaterial.opacity = 1 - this.phase
    }

    private newPosition() {
        this.position.x = this.startPosition.x + Math.random() * 0.7 - 0.25;
        this.position.z = this.startPosition.z + Math.random() * 0.7 - 0.25;

    }

    constructor() {
        super('pikkukupla.png');
        this.speed = 0.2 + Math.random() * 0.5
        this.phase = Math.random();
        this.newPosition();
        this.rotation.x = -0.5
        this.scale.setScalar(0.35 + Math.random() * 0.2)
    }
    mass: number = 0.7
    ownSpeed: number = 0

}


export class CleaningPickup extends StaticItem implements IUpdateable {

    private _rotationPhase = Math.random() * 10

    update(delta: number, timePassed: number): void {
        this.mainMesh.rotation.z = Math.sin(timePassed + this._rotationPhase) * 0.2;
    }
}

export function easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
}

export function easeOutCirc(x: number): number {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}
export function easeInQuint(x: number): number {
    return x * x * x * x * x;
}

export function easeOutExpo(x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function easeOutSine(x: number): number {
    return Math.sin((x * Math.PI) / 2);
}