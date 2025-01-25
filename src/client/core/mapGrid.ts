import { AxesHelper, BoxGeometry, CircleGeometry, Color, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Vector3, WireframeGeometry } from "three";
import { AssetManager } from "./assetManager";

export class MapTile extends Object3D {

    private _helper: LineSegments;

    private _ground = new Mesh(new PlaneGeometry())

    constructor(x: number, y: number) {
        super();

        const wireBox = new BoxGeometry();
        const wire = new WireframeGeometry(wireBox);
        this._helper = new LineSegments(wire);
        this._helper.material = new LineBasicMaterial({
            color: new Color(x % 2 > 0 ? 0.7 : 0.2, y % 2 > 0 ? 0.7 : 0.2, 0)
        });
        this._helper.scale.y = 0.1
        // this._helper.material.depthTest = false;
        this._helper.material.opacity = 0.75;
        this._helper.material.transparent = true;

        this.add(this._helper);
        this._helper.visible = false;
        // this._ground.material = new MeshBasicMaterial({
        //     map: AssetManager.getInstance().getTexture('maa.png')
        // })
        // this._ground.rotation.x = -Math.PI / 2
        // this.add(this._ground)
        // this._ground.
        // this.add(this._ground)
    }
}

export class Forcefield extends Object3D {
    force: number = -0.07;
    range: number = 5;

    radiusHelper = new Mesh(new CircleGeometry())
    centerHelper = new Mesh(new CircleGeometry())

    logicalPosition: { x: number, y: number } = { x: 0, y: 0 }

    constructor(x: number, y: number) {
        super();
        this.radiusHelper.scale.setScalar(this.range);
        this.logicalPosition.x = x;
        this.logicalPosition.y = y;
        this.radiusHelper.rotation.x = -Math.PI / 2
        this.centerHelper.rotation.x = -Math.PI / 2
        this.add(this.radiusHelper);
        this.add(this.centerHelper);
        this.centerHelper.scale.setScalar(0.1)
        this.centerHelper.position.y = 0.25
        this.centerHelper.material = new MeshBasicMaterial({
            color: new Color(0, 0, 0)
        })
        this.radiusHelper.material = new MeshBasicMaterial({
            color: new Color().setScalar(0.4),
            opacity: 0.5,
            transparent: true
        })
    }

    // quad interpolation:
    private interpolate(t: number) {
        // return t * t;
        return t * t
    }

    getTargetMagnitude(target: Object3D) {
        const targetWorld = target.getWorldPosition(new Vector3())
        const thisWorld = this.getWorldPosition(new Vector3())
        const distance = targetWorld.distanceTo(thisWorld)

        if (distance <= 0) { return 1 }
        if (distance < this.range) {
            return this.interpolate((1 - distance / this.range))
        } else {
            return 0;
        }
        // if (distance > this.range) return 0;
        // console.log("affecting", distance, this.range);
    }
}
export class Obstacle extends Object3D {

    private _collider;

    get collider() {
        return this._collider;
    }

    constructor() {
        super();
        this._collider = new Mesh(new BoxGeometry())
        const simpukka = AssetManager.getInstance().getTexture('simpukka1.png');
        console.log(simpukka);
        this._collider.material = new MeshBasicMaterial({
            map: simpukka
        });
        this.collider.position.y = 0.5
        // this.helper
        this.add(this._collider)
    }

}

export class MapGrid extends Object3D {
    tiles: MapTile[][] = []
    obstacles: Object3D[] = [];

    forceFields: Forcefield[] = [];

    constructor(size: number) {
        super();
        this.add(new AxesHelper(3))
        for (let x = 0; x < size; x++) {
            // console.log(this.tiles[x])
            this.tiles[x] = [];
            for (let y = 0; y < size; y++) {
                const newTile = new MapTile(x, y);
                newTile.position.set(x - size / 2, 0, y - size / 2);
                this.tiles[x].push(newTile);
                this.add(newTile);
            }
        }
    }

    setObstacles(obstaclePositions: { x: number, y: number }[]) {
        obstaclePositions.forEach(element => {
            const newObstacle = new Obstacle();
            const targetTile = this.tiles[element.x][element.y]
            // newObstacle.position.x = element.x;
            // newObstacle.position.z = element.y;
            targetTile.add(newObstacle)
            this.obstacles.push(newObstacle);
        });
    }

    setForcefields(forceFields: Forcefield[]) {
        forceFields.forEach(element => {
            try {
                const targetTile = this.tiles[element.logicalPosition.x][element.logicalPosition.y]
                targetTile.add(element)
                this.forceFields.push(element);

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                console.error("Can't find tile for forcefield", element.logicalPosition)
            }
            // newObstacle.position.x = element.x;
            // newObstacle.position.z = element.y;
        });
    }


    getTile(x: number, y: number) {
        return this.tiles[x][y];
    }

}