// ui.js

let currentPage = 0;
let imagesPerPage = parseInt(document.getElementById("imagesPerPage").value, 10);
let overlayElement = null;
import { imagePaths } from './fileHandling.js';

export function createOverlay() {
    overlayElement = document.createElement('div');
    overlayElement.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        z-index: 999;
        display: none;
    `;
    document.body.appendChild(overlayElement);
}

export function enableOverlay() {
    overlayElement.style.display = 'block';
}

export function disableOverlay() {
    overlayElement.style.display = 'none';
}

export async function updatePagination(imagePaths) {
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";
    const start = currentPage * imagesPerPage;
    const end = Math.min(start + imagesPerPage, imagePaths.length);

    for (let i = start; i < end; i++) {
        const img = createImageElement();
        fileList.appendChild(img);

        try {
            const arrayBuffer = await Neutralino.filesystem.readBinaryFile(imagePaths[i]);
            const blob = new Blob([arrayBuffer]);
            img.src = URL.createObjectURL(blob);
        } catch (error) {
            console.error("Error loading image:", imagePaths[i]);
        }
    }
    updateImageSize();
}

export function createImageElement() {
    const img = document.createElement("img");
    img.classList.add("opacity-0", "transition-all", "duration-500", "border-2", "border-black", "border-solid", "rounded", "shadow");
    img.addEventListener("dblclick", toggleFullScreen);
    img.onload = () => {
        img.classList.remove("opacity-0");
        img.classList.add("opacity-100");
        URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
        console.error("Error loading image from path");
    };
    return img;
}
// Ensure toggleFullScreen is exported if needed elsewhere
export function toggleFullScreen(event) {
    const img = event.currentTarget;
    if (img.classList.contains("fullscreen")) {
        img.classList.remove("fullscreen");
        img.style.width = `${document.getElementById("sizeSlider").value}%`;
        img.style.position = "";
        img.style.top = "";
        img.style.left = "";
        img.style.transform = "";
        img.style.zIndex = "";
        disableOverlay();
    } else {
        img.classList.add("fullscreen");
        img.style.width = "100%";
        img.style.position = "fixed";
        img.style.top = "50%";
        img.style.left = "50%";
        img.style.transform = "translate(-50%, -50%)";
        img.style.zIndex = "1000";
        enableOverlay();
    }
}
export function updateImageSize() {
    const sizeSlider = document.getElementById("sizeSlider");
    const value = parseInt(sizeSlider.value, 10);
    const imgs = document.getElementById("fileList").querySelectorAll("img");

    if (value === 110) {
        sizeValue.textContent = "Max Fit";
        imgs.forEach(img => {
            img.style.objectFit = "cover";
            img.style.width = "100%";
            img.style.height = "100%";
        });
    } else if (value === 0) {
        sizeValue.textContent = "Original";
        imgs.forEach(img => {
            img.style.objectFit = "contain";
            img.style.width = "auto";
            img.style.height = "auto";
        });
    } else {
        sizeValue.textContent = `${value}%`;
        imgs.forEach(img => {
            img.style.width = `${value}%`;
            img.style.objectFit = "scale-down";
            img.style.height = `${value}%`;
        });
    }
}

export function showPreviousPage() {
    currentPage = (currentPage - 1 + Math.ceil(imagePaths.length / imagesPerPage)) % Math.ceil(imagePaths.length / imagesPerPage);
    updatePagination(imagePaths);
}

export function showNextPage() {
    currentPage = (currentPage + 1) % Math.ceil(imagePaths.length / imagesPerPage);
    updatePagination(imagePaths);
}

export function updateImagesPerPage() {
    imagesPerPage = parseInt(document.getElementById("imagesPerPage").value, 10);
    updatePagination(imagePaths);
}

export function toggleControlsVisibility(imagePaths) {
    const controlsContainer = document.getElementById("controlsContainer");
    if (imagePaths.length > 0) {
        controlsContainer.style.display = "flex";
    } else {
        controlsContainer.style.display = "none";
    }
}
