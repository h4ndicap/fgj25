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
    if (currentLevel !== undefined) {
        // console.log("update")
        renderingManager.render(currentLevel.scene, clock.getDelta(), clock.getElapsedTime())
    }
    requestAnimationFrame(updateLoop)
}
updateLoop()
