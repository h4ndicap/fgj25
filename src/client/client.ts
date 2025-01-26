import * as THREE from 'three'
import { RenderingManager } from './core/renderingManager';
import { Level } from './core/level';
import { AssetManager } from './core/assetManager';
import { imageFiles } from './imagefiles';
import { RaycastManager } from './core/raycastManager';
import { Forcefield } from './core/mapGrid';
import { GuiSystem } from './core/guiSystem';

// const scene = new THREE.Scene()
const clock = new THREE.Clock();

AssetManager.getInstance();

function initialize() {

    RenderingManager.getInstance();
    RaycastManager.getInstance(); // effectively the constructor
    GuiSystem.getInstance();

    GuiSystem.uiAction$.subscribe(newAction => {
        console.log("action!", newAction)
        startLevel();
    })

    updateLoop();
}

const levels: Level[] = [];
function startLevel() {

    const firstLevel = new Level(20, [
        { x: 8, y: 8 },
        { x: 8, y: 9 },
        { x: 8, y: 10 },
        { x: 8, y: 11 },
    ], [
        new Forcefield(10, 10, -0.1, 10)
    ])

    levels.push(firstLevel)

    // eslint-disable-next-line prefer-const
    Level.current = levels[levels.length - 1];
    const am = AssetManager.getInstance();
    Level.current.player.setTextures(am.getTexture('hahmo 4.png')!,
        am.getTexture('isokupla.png')!,
        am.getTexture('hanta.png')!,
        am.getTexture(
            'hahmonkadet.png')!,
        am.getTexture(
            'hahmo5.png')!,
    )
    RenderingManager.getInstance().level = Level.current;

    Level.current.gameStateChange$.subscribe(ev => {
        console.log("client!", ev);
        if (ev === 'drained') {
            // startLevel();
            unloadLevel();
        }
    })
}

function unloadLevel() {
    RenderingManager.getInstance().clearLevel()
    Level.current = undefined;

}

function updateLoop() {
    const delta = clock.getDelta()
    const elapsed = clock.getElapsedTime();
    if (Level.current !== undefined) {
        // console.log("update")
        Level.current.update(delta, elapsed)
    }
    RenderingManager.getInstance().update(delta, elapsed)
    GuiSystem.getInstance().update(delta, elapsed);
    requestAnimationFrame(updateLoop)
}
// updateLoop()

console.log("Loading textures...");
AssetManager.getInstance().loadTextures(imageFiles).then(() => {
    // updateLoop()
    console.log("Loaded")
    initialize();
}).catch((err) => {
    console.error("Error initializing the game!!", err)
});