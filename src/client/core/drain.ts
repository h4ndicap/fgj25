import { Object3D, Mesh, CircleGeometry, MeshBasicMaterial, Color, Vector3 } from "three";
import { BubbleGameMaterial } from "./bubbleGameMaterial";
import { StaticItem } from "./staticItem";

export interface IDrainable {
    mass: number;
    position: Vector3;
    getWorldPosition(target: Vector3): Vector3
    ownSpeed: number
}

export type ForcefieldOutcome = 'drained' | 'noescape' | 'moved' | 'skipped';
export class Forcefield extends Object3D {
    force: number = -0.07;
    range: number = 5;

    radiusHelper = new Mesh(new CircleGeometry());
    centerHelper = new Mesh(new CircleGeometry());

    logicalPosition: { x: number; y: number; } = { x: 0, y: 0 };

    spinSpeed = 1;

    constructor(x: number, y: number, force = -0.07, range = 2.5) {
        super();
        this.force = force;
        this.range = range;
        this.radiusHelper.scale.setScalar(this.range);
        this.logicalPosition.x = x;
        this.logicalPosition.y = y;
        this.radiusHelper.rotation.x = -Math.PI / 2;
        this.centerHelper.rotation.x = -Math.PI / 2;
        this.centerHelper.scale.setScalar(0.1);
        this.centerHelper.position.y = 0.25;
        this.centerHelper.material = new MeshBasicMaterial({
            color: new Color(0, 0, 0)
        });
        this.radiusHelper.material = new BubbleGameMaterial({
            color: new Color().setScalar(0.4),
            opacity: 0.5,
            transparent: true
        });
        // this.add(this.radiusHelper);
        // this.add(this.centerHelper);
        const hole = new StaticItem('hole.png')
        hole.scale.z = 0.7
        this.add(hole)
    }

    // quad interpolation:
    private interpolate(t: number) {
        // return t * t;
        return t * t;
    }

    getTargetMagnitude(target: IDrainable) {
        const targetWorld = target.getWorldPosition(new Vector3());
        const thisWorld = this.getWorldPosition(new Vector3());
        const distance = targetWorld.distanceTo(thisWorld);

        if (distance <= 0) { return 1; }
        if (distance < this.range) {
            return this.interpolate((1 - distance / this.range));
        } else {
            return 0;
        }
        // if (distance > this.range) return 0;
        // console.log("affecting", distance, this.range);
    }
}
