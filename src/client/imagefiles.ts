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
    'likainenlautanen.png'
]

export interface ImageTransformInfo {
    scale?: Vector3;
    offset?: Vector3;
    rotation?: Euler;
    shadowSize?: Vector3
}

export const imageSizes = new Map<string, ImageTransformInfo>()

imageSizes.set('simpukka1.png', { scale: new Vector3().setScalar(0.5), rotation: new Euler(-Math.PI / 2), offset: new Vector3(0, 0.1, 0) })
imageSizes.set('simpukka2.png', { scale: new Vector3().setScalar(0.5), rotation: new Euler(-Math.PI / 2), offset: new Vector3(0, 0.1, 0) })
imageSizes.set('kivikasvi.png', { scale: new Vector3().set(836 / 1411, 1, 1), offset: new Vector3(0, 0.35, 0), shadowSize: new Vector3(0.2, 0.1, 0.1) })
imageSizes.set('laulanen.png', { scale: new Vector3().set(1, 1, 1), offset: new Vector3(0, 0.4, 0), shadowSize: new Vector3(0.3, 0.1, 0.1) })
imageSizes.set('likainenlautanen.png', { scale: new Vector3().set(1, 1, 1), offset: new Vector3(0, 0.4, 0), shadowSize: new Vector3(0.3, 0.1, 0.1) })
// imageSizes.set('simpukka2.png', new Vector3().setScalar(0.5))
// imageSizes.set('kivikasvi.png', new Vector3().setScalar(0.5))

export const cleanablePairs: CleanableContructorParams[] = [{
    name: 'plate',
    clean: 'laulanen.png',
    dirty: 'likainenlautanen.png'
}]