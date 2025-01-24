import * as THREE from 'three'
import { RenderingManager } from './core/renderingManager';
import { Level } from './core/level';

// const scene = new THREE.Scene()
const clock = new THREE.Clock();

const renderingManager = new RenderingManager();

let currentLevel: Level;
const levels: Level[] = [];

levels.push(new Level())

currentLevel = levels[0]

function updateLoop() {
    const delta = clock.getDelta()
    const elapsed = clock.getElapsedTime();
    if (currentLevel !== undefined) {
        // console.log("update")
        currentLevel.update(delta, elapsed)
        renderingManager.render(currentLevel.scene, delta, elapsed)
    }
    requestAnimationFrame(updateLoop)
}
updateLoop()
