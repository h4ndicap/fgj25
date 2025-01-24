import * as THREE from 'three'
import { RenderingManager } from './core/renderingManager';
import { Level } from './core/level';

// const scene = new THREE.Scene()
const clock = new THREE.Clock();

const renderingManager = new RenderingManager();

const levels: Level[] = [];

levels.push(new Level())

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
updateLoop()
