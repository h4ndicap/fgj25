import { Color, Object3D, Texture } from "three";
import { StaticItem } from "./staticItem"
import { AssetManager } from "./assetManager";
import { EffectBubble, IUpdateable } from "./common";


export interface CleanableContructorParams {
    name: string, clean: string, dirty: string
}

export class CleanableItem extends StaticItem implements IUpdateable {

    private _cleanTexture: Texture;

    collision?: Object3D;

    bubblePool: EffectBubble[] = []

    // set from 1 to 0
    private _dirtiness = 1;

    set dirtiness(val: number) {
        this._dirtiness = val;
        if (this.dirtiness <= 0) {
            this.isClean = true;
        }
    }

    get dirtiness() {
        return this._dirtiness;
    }

    private _clean = false;
    set isClean(isClean: boolean) {
        this._clean = isClean;
        this.mainMaterial.map = this._clean ? this._cleanTexture : this._texture;
        if (this._clean) {
            this.bubblePool.forEach(bub => {
                // this.remove(bub);
                bub.dying = true;
            })
        }
    }

    get isClean() {
        return this._clean;
    }

    constructor(params: CleanableContructorParams) {
        super(params.dirty);
        this._cleanTexture = AssetManager.getInstance().getTexture(params.clean)!
        // this.add(this.cleanableCollider);
        // this.collision = new Mesh(new BoxGeometry(0.6, 6, 3))
        // this.collision.scale.z = 1

        // const parentscale = this.parent?.scale;
        // console.log(parentscale!);

        // this.add(this.collision);

        for (let index = 0; index < 15; index++) {
            const newBubble = new EffectBubble();
            this.add(newBubble);
            newBubble.mainMaterial.color = new Color(0xc9ac68)
            this.bubblePool.push(newBubble);
        }

        this.name = params.name
        // console.log(this.name)
    }
    update(delta: number, timePassed: number): void {
        this.bubblePool.forEach(element => {
            element.update(delta, timePassed);
        });
    }
}