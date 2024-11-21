import { initShortcuts, createShortcutEditor,saveCurrentConfig,getConfig,createConfigEditor,writeConfig,handleDirSelectClick, handleFileSelectClick, handleFiles,updateImageSize, showPreviousPage, showNextPage, updateImagesPerPage, disableOverlay,startSlideshow,slideshowInterval  } from './index.js';

export function setupEventListeners() {
    const dirSelect = document.getElementById("selectDirButton");
    const fileSelect = document.getElementById("fileSelect");
    const fileElem = document.getElementById("fileElem");
    const sizeSlider = document.getElementById("sizeSlider");
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");
    const imagesPerPageSlider = document.getElementById("imagesPerPage");
    const slideshowButton = document.getElementById("slideshowButton");
const config_button = document.getElementById("config_button");
const shortcut_button = document.getElementById("addShortcut");
const export_shortcut_button = document.getElementById("exportShortcuts");
    dirSelect.addEventListener("click", handleDirSelectClick);
    //fileSelect.addEventListener("click", handleFileSelectClick);
 // fileElem.addEventListener("change", handleFiles);
    sizeSlider.addEventListener("input", updateImageSize);
    prevPage.addEventListener("click", showPreviousPage);
    nextPage.addEventListener("click", showNextPage);
    imagesPerPageSlider.addEventListener("input", updateImagesPerPage);
    slideshowButton.addEventListener("click", startSlideshow);
    config_button.addEventListener("click",()=>{createConfigEditor(null,function(){saveCurrentConfig()})});
    shortcut_button.addEventListener("click",()=> initShortcuts())
    document.addEventListener("keydown", handleKeyDown);
}

function handleKeyDown(event) {
  

}
