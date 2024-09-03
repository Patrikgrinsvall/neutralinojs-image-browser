// slideshow.js

import { enableOverlay, disableOverlay, createImageElement } from './ui.js';
import { imagePaths } from './fileHandling.js';
export let slideshowInterval = null;

export function startSlideshow() {
    const duration = parseInt(document.getElementById("durationInput").value, 10) * 1000;
    const random = document.getElementById("randomCheckbox").checked;

    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }

    let currentIndex = 0;
    slideshowInterval = setInterval(() => {
        if (random) {
            currentIndex = Math.floor(Math.random() * imagePaths.length);
        } else {
            currentIndex = (currentIndex + 1) % imagePaths.length;
        }
        showFullScreen(imagePaths[currentIndex]);
        document.getElementById("imageInfo").innerText=`${imagePaths[currentIndex]} - ${currentIndex} / ${imagePaths.length}`;
    }, duration);
}

function showFullScreen(urlOrPath) {
    const img = createImageElement();
    img.classList.add("fullscreen");
    img.style = `
        height: 100%;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    `;

    if (urlOrPath.startsWith("http") || urlOrPath.startsWith("data:")) {
        img.src = urlOrPath;
    } else {
        Neutralino.filesystem.readBinaryFile(urlOrPath).then(arrayBuffer => {
            const blob = new Blob([arrayBuffer]);
            img.src = URL.createObjectURL(blob);

        }).catch(error => {
            console.error("Error loading image:", error);
        });
    }

    document.body.appendChild(img);
    enableOverlay();

    img.addEventListener("dblclick", () => {
        img.remove();
        disableOverlay();
    });
}
