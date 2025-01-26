import { Euler, Vector3 } from "three"
import { CleanableContructorParams } from "./core/cleanableItem";


export const imageFiles: string[] = [
    'hahmo.png',
    'hahmo3.png',
    'hahmo 4.png',
    'hahmonkadet.png',
    'hanta.png',
    'isokupla.png',
    'kivikasvi.png',
    'simpukka1.png',
    'simpukka2.png',
    'maa.png',
    'laulanen.png',
    'likainenlautanen.png',
    'lusikka.png',
    'lusikkalikainen.png',
    'pesuaine.png',
    'hahmo5.png',
    'hahmoalotusruutu.png',
    'hahmoalotusruutu1.png',
    'hahmoalotusruutu2.png',
    'pelinnimi.png',
    'playbutton.png',
    'pikkukupla.png',
    // 'hahmoalotusruutu3.png'
]

export interface ImageTransformInfo {
    scale?: Vector3;
    offset?: Vector3;
    rotation?: Euler;
    shadowSize?: Vector3;
    randomRotation?: number
}

export const imageSizes = new Map<string, ImageTransformInfo>()

imageSizes.set('simpukka1.png', { scale: new Vector3().setScalar(0.5), rotation: new Euler(-Math.PI / 2), offset: new Vector3(0, 0.1, 0), shadowSize: new Vector3(0.0, 0.0, 0.0), randomRotation: 2 })
imageSizes.set('simpukka2.png', { scale: new Vector3().setScalar(0.5), rotation: new Euler(-Math.PI / 2), offset: new Vector3(0, 0.1, 0), shadowSize: new Vector3(0.0, 0.0, 0.0), randomRotation: 2 })
imageSizes.set('kivikasvi.png', { scale: new Vector3().set(836 / 1411, 1, 1), offset: new Vector3(0, 0.35, 0), shadowSize: new Vector3(0.0, 0.0, 0.0) })
imageSizes.set('laulanen.png', { scale: new Vector3().set(1, 1, 1), offset: new Vector3(0, 0.4, 0), shadowSize: new Vector3(0.3, 0.1, 0.1) })
imageSizes.set('likainenlautanen.png', { scale: new Vector3().set(1, 1, 1), offset: new Vector3(0, 0.4, 0), shadowSize: new Vector3(0.3, 0.1, 0.1) })
imageSizes.set('lusikkalikainen.png', { scale: new Vector3().set(1, 300 / 200, 1), rotation: new Euler(-Math.PI / 2), offset: new Vector3(0, 0.0, 0), shadowSize: new Vector3(0.0, 0.0, 0.0), randomRotation: 2 })
imageSizes.set('pesuaine.png', { scale: new Vector3().set(0.5, 787 / 579 * 0.5, 0.5), rotation: new Euler(-1.2), offset: new Vector3(0, 0.75, 0), shadowSize: new Vector3(0.2, 0.2, 0.2) })
imageSizes.set('pikkukupla.png', { scale: new Vector3().set(0.5, 200 / 194 * 0.5, 0.5), offset: new Vector3(0, 0.75, 0), shadowSize: new Vector3(0.0, 0.0, 0.0) })
// imageSizes.set('simpukka2.png', new Vector3().setScalar(0.5))
// imageSizes.set('kivikasvi.png', new Vector3().setScalar(0.5))

export const cleanablePairs: CleanableContructorParams[] = [{
    name: 'plate',
    clean: 'laulanen.png',
    dirty: 'likainenlautanen.png'
}, {
    name: 'spoon',
    clean: 'lusikka.png',
    dirty: 'lusikkalikainen.png'
}]