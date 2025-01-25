import { MeshBasicMaterial, MeshBasicMaterialParameters } from "three";


// simple extension to keep track
export class BubbleGameMaterial extends MeshBasicMaterial {

    constructor(params?: MeshBasicMaterialParameters) {
        super(params);
        this.depthWrite = false;
        this.transparent = true;
    }
}