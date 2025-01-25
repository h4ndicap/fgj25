import * as THREE from 'three'
import { RenderingManager } from './core/renderingManager';
import { Level } from './core/level';
import { AssetManager } from './core/assetManager';
import { imageFiles } from './imagefiles';
import { RaycastManager } from './core/raycastManager';

// const scene = new THREE.Scene()
const clock = new THREE.Clock();

const assetManager = new AssetManager();
const renderingManager = new RenderingManager();
RaycastManager.getInstance(); // effectively the constructor

const levels: Level[] = [];

const firstLevel = new Level(20, [
    { x: 8, y: 8 },
    { x: 8, y: 9 },
    { x: 8, y: 10 },
    { x: 8, y: 11 },
])

levels.push(firstLevel)

// eslint-disable-next-line prefer-const
Level.current = levels[0];

renderingManager.level = Level.current;

function updateLoop() {
    const delta = clock.getDelta()
    const elapsed = clock.getElapsedTime();
    if (Level.current !== undefined) {
        // console.log("update")
        Level.current.update(delta, elapsed)
        renderingManager.update(delta, elapsed)
    }
    requestAnimationFrame(updateLoop)
}
// updateLoop()

assetManager.loadTextures(imageFiles).then(() => {
    Level.current.player.setTextures(assetManager.getTexture('hahmo.png')!)
    updateLoop()
}).catch(() => {
    console.error("Could not load files!!")
});