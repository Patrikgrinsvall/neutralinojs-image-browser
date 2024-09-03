import { handleDirSelectClick, handleFileSelectClick, handleFiles } from './fileHandling.js';
import {updateImageSize, showPreviousPage, showNextPage, updateImagesPerPage, disableOverlay} from './ui.js';
import { startSlideshow,slideshowInterval } from './slideshow.js';

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
    fileSelect.addEventListener("click", handleFileSelectClick);
    fileElem.addEventListener("change", handleFiles);
    sizeSlider.addEventListener("input", updateImageSize);
    prevPage.addEventListener("click", showPreviousPage);
    nextPage.addEventListener("click", showNextPage);
    imagesPerPageSlider.addEventListener("input", updateImagesPerPage);
    slideshowButton.addEventListener("click", startSlideshow);

    document.addEventListener("keydown", handleKeyDown);
}

function handleKeyDown(event) {
    if (event.key === "Escape") {
        const imgs = document.querySelectorAll("img")
        imgs.forEach(img => {
            if(img.classList.contains("fullscreen")){
                img.remove();
                disableOverlay();
            }
            if(slideshowInterval){
                    clearInterval(slideshowInterval);
            }
          });
        disableOverlay();
    }

}
