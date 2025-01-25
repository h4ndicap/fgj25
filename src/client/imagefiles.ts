import { Euler, Vector3 } from "three"


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
]

export interface ImageTransformInfo {
    scale?: Vector3;
    offset?: Vector3;
    rotation?: Euler;
}

export const imageSizes = new Map<string, ImageTransformInfo>()

imageSizes.set('simpukka1.png', { scale: new Vector3().setScalar(0.5), rotation: new Euler(-Math.PI / 2) })
imageSizes.set('simpukka2.png', { scale: new Vector3().setScalar(0.5), rotation: new Euler(-Math.PI / 2) })
imageSizes.set('kivikasvi.png', { scale: new Vector3().set(836 / 1411, 1, 1), offset: new Vector3(0, 1, 0) })
// imageSizes.set('simpukka2.png', new Vector3().setScalar(0.5))
// imageSizes.set('kivikasvi.png', new Vector3().setScalar(0.5))