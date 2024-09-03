// main.js

Neutralino.init();
Neutralino.events.on("windowClose", onWindowClose);

import {setupEventListeners} from './events.js';
import {createOverlay} from './ui.js';


document.addEventListener('DOMContentLoaded', () => {
    createOverlay();
    setupEventListeners();
})

function onWindowClose() {
    Neutralino.app.exit();
}