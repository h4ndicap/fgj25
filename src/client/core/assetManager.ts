import { LoadingManager, Texture, TextureLoader } from "three";


export class AssetManager {

    private _loadingManager = new LoadingManager();

    private _textureLoader = new TextureLoader(this._loadingManager)

    private _textureCache = new Map<string, Texture>();

    private _filePrefix = 'assets/'

    private static instance: AssetManager;

    private constructor() { }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new AssetManager();
        return this.instance;
    }


    getTexture(filename: string) {
        return this._textureCache.get(filename);
    }

    async loadTexture(file: string) {
        return this._textureLoader.loadAsync(this._filePrefix + file, () => {

        }).then((tex) => {
            this._textureCache.set(file, tex)
        })
    }

    async loadTextures(files: string[]) {
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            await this.loadTexture(element);
        }
    }
}