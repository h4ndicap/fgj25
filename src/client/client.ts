import * as THREE from 'three'
import { RenderingManager } from './core/renderingManager';
import { Level } from './core/level';
import { AssetManager } from './core/assetManager';
import { imageFiles } from './imagefiles';

// const scene = new THREE.Scene()
const clock = new THREE.Clock();

const assetManager = new AssetManager();
const renderingManager = new RenderingManager();

const levels: Level[] = [];

levels.push(new Level())

// eslint-disable-next-line prefer-const
let currentLevel: Level = levels[0];

renderingManager.level = currentLevel;


function updateLoop() {
    const delta = clock.getDelta()
    const elapsed = clock.getElapsedTime();
    if (currentLevel !== undefined) {
        // console.log("update")
        currentLevel.update(delta, elapsed)
        renderingManager.update(delta, elapsed)
    }
    requestAnimationFrame(updateLoop)
}
// updateLoop()

assetManager.loadTextures(imageFiles).then(() => {
    currentLevel.player.setTextures(assetManager.getTexture('hahmo.png')!)
    updateLoop()
}).catch(() => {
    console.error("Could not load files!!")
});