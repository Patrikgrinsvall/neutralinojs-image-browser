import { saveCurrentConfig, getConfig, createConfigEditor,updateFiles, writeConfig, handleDirSelectClick, handleFileSelectClick, handleFiles, updateImageSize, showPreviousPage, showNextPage, updateImagesPerPage, disableOverlay, startSlideshow, slideshowInterval } from './index.js';

export function setupEventListeners() {
    const dirSelect = document.getElementById("selectDirButton");

    const sizeSlider = document.getElementById("sizeSlider");
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");
    const imagesPerPageSlider = document.getElementById("imagesPerPage");
    const slideshowButton = document.getElementById("slideshowButton");
    const config_button = document.getElementById("config_button");
    const globPatternInput = document.getElementById("globPattern");
    globPatternInput.addEventListener("blur",updateFiles);
    dirSelect.addEventListener("click", handleDirSelectClick);
    sizeSlider.addEventListener("input", updateImageSize);
    prevPage.addEventListener("click", showPreviousPage);
    nextPage.addEventListener("click", showNextPage);
    imagesPerPageSlider.addEventListener("input", updateImagesPerPage);
    slideshowButton.addEventListener("click", startSlideshow);
    config_button.addEventListener("click", () => { createConfigEditor(null, function () { saveCurrentConfig() }) });

}
