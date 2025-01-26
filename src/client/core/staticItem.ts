import { CircleGeometry, Color, Mesh, Object3D, PlaneGeometry, Texture } from "three";
import { AssetManager } from "./assetManager";
import { BubbleGameMaterial } from "./bubbleGameMaterial";
import { imageSizes, ImageTransformInfo } from "../imagefiles";


export class StaticItem extends Object3D {

    mainMesh = new Mesh(new PlaneGeometry())
    shadow = new Mesh(new CircleGeometry())
    protected _texture: Texture;

    mainMaterial = new BubbleGameMaterial();

    constructor(textureName: string) {
        super();
        this.add(this.mainMesh);
        this.add(this.shadow);
        this.shadow.material = new BubbleGameMaterial({
            color: new Color(0, 0, 0)
        })
        this.shadow.material.opacity = 0.2
        this.shadow.scale.setScalar(0.35)
        this.shadow.rotation.x = -Math.PI / 2
        this.mainMesh.material = this.mainMaterial;
        this.mainMesh.position.y = 0.0
        this._texture = AssetManager.getInstance().getTexture(textureName)!
        this.mainMaterial.map = this._texture;


        const imageInfo = imageSizes.get(textureName);
        if (imageInfo) {
            this.setImageInfo(imageInfo);
        }
        // const ratio = texture?.image
        // mesh.scale
        // console.log(texture?.source);

        // this.add(new Mesh(new BoxGeometry()))
    }

    setImageInfo(imageInfo: ImageTransformInfo) {
        if (imageInfo.scale) {
            this.mainMesh.scale.copy(imageInfo?.scale)
            this.shadow.scale.multiply(imageInfo?.scale)
        }
        // this.mainMesh.scale.multiplyScalar(0.5 + Math.random() * 0.5)
        if (imageInfo.rotation) {
            this.mainMesh.rotation.copy(imageInfo.rotation)
            // this.mainMesh.rotation.z = Math.random() * Math.PI
            // this.mainMesh.rotation.x = -Math.PI / 2
        }
        if (imageInfo.offset) {
            this.mainMesh.position.add(imageInfo.offset)
        }
        if (imageInfo.shadowSize) {
            if (imageInfo.shadowSize.length() <= 0) {
                this.shadow.visible = false;
            }
            this.shadow.scale.copy(imageInfo.shadowSize)
        }

        if (imageInfo.randomRotation !== undefined) {
            this.mainMesh.rotation.z = Math.random() * Math.PI * imageInfo.randomRotation
        }

    }
}