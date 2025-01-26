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