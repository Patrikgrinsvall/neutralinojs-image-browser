import { handleDirSelectClick, handleFileSelectClick, handleFiles,updateImageSize, showPreviousPage, showNextPage, updateImagesPerPage, disableOverlay,startSlideshow,slideshowInterval  } from './index.js';

export function setupEventListeners() {
    const dirSelect = document.getElementById("selectDirButton");
    const fileSelect = document.getElementById("fileSelect");
    const fileElem = document.getElementById("fileElem");
    const sizeSlider = document.getElementById("sizeSlider");
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");
    const imagesPerPageSlider = document.getElementById("imagesPerPage");
    const slideshowButton = document.getElementById("slideshowButton");

    dirSelect.addEventListener("click", handleDirSelectClick);
    //fileSelect.addEventListener("click", handleFileSelectClick);
 // fileElem.addEventListener("change", handleFiles);
    sizeSlider.addEventListener("input", updateImageSize);
    prevPage.addEventListener("click", showPreviousPage);
    nextPage.addEventListener("click", showNextPage);
    imagesPerPageSlider.addEventListener("input", updateImagesPerPage);
    slideshowButton.addEventListener("click", startSlideshow);

    document.addEventListener("keydown", handleKeyDown);
}

function handleKeyDown(event) {
  

}
