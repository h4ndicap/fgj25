import { Object3D } from "three";


export class Forcefield extends Object3D {
    force: number = 10;
    range: number = 10;

    // cubic interpolation:
    private interpolate(t: number) {
        return t * t * t;
    }



}

// Controls forcefields like drains
export class ForcefieldManager {

    targets: Object3D[] = []

    forceFields: Forcefield[] = [];

}