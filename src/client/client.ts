import * as THREE from 'three'
import { RenderingManager } from './core/renderingManager';
import { Level } from './core/level';
import { AssetManager } from './core/assetManager';
import { imageFiles } from './imagefiles';
import { RaycastManager } from './core/raycastManager';
import { Forcefield } from './core/mapGrid';

// const scene = new THREE.Scene()
const clock = new THREE.Clock();

AssetManager.getInstance();

function initialize() {

    RenderingManager.getInstance();
    RaycastManager.getInstance(); // effectively the constructor

    const levels: Level[] = [];

    const firstLevel = new Level(20, [
        { x: 8, y: 8 },
        { x: 8, y: 9 },
        { x: 8, y: 10 },
        { x: 8, y: 11 },
    ], [
        new Forcefield(12, 8)
    ])

    levels.push(firstLevel)

    // eslint-disable-next-line prefer-const
    Level.current = levels[0];
    const am = AssetManager.getInstance();
    Level.current.player.setTextures(am.getTexture('hahmo 4.png')!,
        am.getTexture('isokupla.png')!,
        am.getTexture('hanta.png')!,
        am.getTexture(
            'hahmonkadet.png')!,
    )
    RenderingManager.getInstance().level = Level.current;
    updateLoop();
}

function updateLoop() {
    const delta = clock.getDelta()
    const elapsed = clock.getElapsedTime();
    if (Level.current !== undefined) {
        // console.log("update")
        Level.current.update(delta, elapsed)
        RenderingManager.getInstance().update(delta, elapsed)
    }
    requestAnimationFrame(updateLoop)
}
// updateLoop()

AssetManager.getInstance().loadTextures(imageFiles).then(() => {
    // updateLoop()
    initialize();
}).catch(() => {
    console.error("Could not load files!!")
});