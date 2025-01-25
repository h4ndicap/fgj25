import { Mesh, SphereGeometry, Texture } from "three";
import { StaticItem } from "./staticItem"
import { AssetManager } from "./assetManager";


export interface CleanableContructorParams {
    name: string, clean: string, dirty: string
}

export class CleanableItem extends StaticItem {

    cleanableCollider = new Mesh(new SphereGeometry(1, 8, 4))

    private _cleanTexture: Texture;

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
        this.name = params.name
    }
}