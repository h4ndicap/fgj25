import { BoxGeometry, Color, LineBasicMaterial, LineSegments, Mesh, Object3D, WireframeGeometry } from "three";

export class MapTile extends Object3D {

    private _helper: LineSegments;
    private _helperMaterial = new LineBasicMaterial();

    // private _ground = new Mesh(new BoxGeometry(1, 0.1, 1))

    constructor(x: number, y: number) {
        super();
        const wireBox = new BoxGeometry();
        const wire = new WireframeGeometry(wireBox);
        this._helper = new LineSegments(wire);
        this._helper.material = new LineBasicMaterial({
            color: new Color(x % 2 > 0 ? 0.7 : 0.2, y % 2 > 0 ? 0.7 : 0.2, 0)
        });
        this._helper.scale.y = 0.1
        this._helper.material.depthTest = false;
        this._helper.material.opacity = 0.75;
        this._helper.material.transparent = true;

        this.add(this._helper);
        // this.add(this._ground)
    }
}

export class MapGrid extends Object3D {
    tiles: MapTile[][] = []

    constructor(size: number) {
        super();
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

    getTile(x: number, y: number) {
        return this.tiles[x][y];
    }

}