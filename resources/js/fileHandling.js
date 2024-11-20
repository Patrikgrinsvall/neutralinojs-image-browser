// fileHandling.js

import { updatePagination, toggleControlsVisibility } from './index.js'

export let imagePaths = [];

export async function handleDirSelectClick() {
    try {
        const entry = await Neutralino.os.showFolderDialog('Select image directory', { defaultPath: '~' });
        if (entry) {
            const files = await Neutralino.filesystem.readDirectory(entry);
            imagePaths = [];
            processFiles(files);
            updatePagination(imagePaths);
            toggleControlsVisibility(imagePaths);
        }
    } catch (error) {
        console.error("Error selecting directory:", error);
    }
}

export  async function  readDirectory(dir){
    try {
        const files = await Neutralino.filesystem.readDirectory(dir);
          imagePaths = processFiles(files);
        updatePagination(imagePaths);
        toggleControlsVisibility(imagePaths);
    } catch (error) {
        console.error("Failed to read directory:", error);
    }
}

export function handleFileSelectClick(event) {
    event.preventDefault();
    document.getElementById("fileElem").click();
}

export async function handleFiles(event) {
    imagePaths = [];
    const files = Array.from(event.target.files);
    files.forEach(file => {
        imagePaths.push(file.path);
    });
    updatePagination(imagePaths);
    toggleControlsVisibility(imagePaths);
}

async function processFiles(files) {
    const fileTypes = ["jpg", "png", "jpeg"];
    for (const file of files) {
        if (file.type === "FILE" && fileTypes.includes(file.entry.split('.').pop().toLowerCase())) {
            imagePaths.push(file.path);
        }
    }
}
function getDirectoryPath(filePath) {
    // Find the last occurrence of the forward slash `/`
    const lastSlashIndex = filePath.lastIndexOf('/');

    // Extract the substring from the start to the last slash index
    const dirPath = filePath.substring(0, lastSlashIndex);

    return dirPath;
}