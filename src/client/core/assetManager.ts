import { LoadingManager, Texture, TextureLoader } from "three";


export class AssetManager {

    private _loadingManager = new LoadingManager();

    private _textureLoader = new TextureLoader(this._loadingManager)

    private _textureCache = new Map<string, Texture>();

    private _filePrefix = 'assets/'

    async loadTexture(file: string) {
        return this._textureLoader.loadAsync(file, () => {

        }).then((tex) => {
            this._textureCache.set(file, tex)
        })
    }

    async loadTextures(files: string[]) {
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            await this.loadTexture(this._filePrefix + element);
        }
    }
}