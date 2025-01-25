import { BoxGeometry, Mesh, Object3D, SphereGeometry, Texture } from "three";
import { StaticItem } from "./staticItem"
import { AssetManager } from "./assetManager";


export interface CleanableContructorParams {
    name: string, clean: string, dirty: string
}

export class CleanableItem extends StaticItem {

    private _cleanTexture: Texture;

    collision?: Object3D;

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

        const parentscale = this.parent?.scale;
        // console.log(parentscale!);

        // this.add(this.collision);
        this.name = params.name
        // console.log(this.name)
    }
}