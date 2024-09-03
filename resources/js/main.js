Neutralino.init();
Neutralino.events.on("windowClose", onWindowClose);

const fileSelect = document.getElementById("fileSelect");
const fileElem = document.getElementById("fileElem");
const fileList = document.getElementById("fileList");
const dirSelect = document.getElementById("selectDirButton");
const sizeSlider = document.getElementById("sizeSlider");
const sizeValue = document.getElementById("sizeValue");
const imagesPerPageSlider = document.getElementById("imagesPerPage");
const imagesPerPageValue = document.getElementById("imagesPerPageValue");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const slideshowButton = document.getElementById("slideshowButton");
const durationInput = document.getElementById("durationInput");
const randomCheckbox = document.getElementById("randomCheckbox");
const toolbar = document.getElementById("toolbar")
const fileTypes = ["jpg", "png", "jpeg"];
let imagePaths = [];
let currentPage = 0;
let imagesPerPage = parseInt(imagesPerPageSlider.value, 10);
let slideshowInterval = null;

// Event Listeners
dirSelect.addEventListener("click", handleDirSelectClick);
fileSelect.addEventListener("click", handleFileSelectClick);
fileElem.addEventListener("change", handleFiles);
sizeSlider.addEventListener("input", updateImageSize);
prevPage.addEventListener("click", showPreviousPage);
nextPage.addEventListener("click", showNextPage);
slideshowButton.addEventListener("click", startSlideshow);
document.addEventListener("keydown", handleKeyDown);
imagesPerPageSlider.addEventListener("input", updateImagesPerPage);
function onWindowClose() {
    Neutralino.app.exit();
}
let overlayElement = null;

function createOverlay() {
    // Create the overlay div
    overlayElement = document.createElement('div');
    overlayElement.style.position = 'fixed';
    overlayElement.style.top = '0';
    overlayElement.style.left = '0';
    overlayElement.style.width = '100%';
    overlayElement.style.height = '100%';
    overlayElement.style.backgroundColor = 'black';
    overlayElement.style.zIndex = '999'; // Ensures the overlay is behind the fullscreen image
    overlayElement.style.display = 'none'; // Initially hidden
    document.body.appendChild(overlayElement);
}

function enableOverlay() {
    if (!overlayElement) {
        createOverlay(); // Create overlay if it doesn't exist
    }
    overlayElement.style.display = 'block'; // Show the overlay
}

function disableOverlay() {
    if (overlayElement) {
        overlayElement.style.display = 'none'; // Hide the overlay
    }
}
async function handleDirSelectClick() {
    try {
        const entry = await Neutralino.os.showFolderDialog('Select image directory', { defaultPath: '~' });
        if (entry) {
            const files = await Neutralino.filesystem.readDirectory(entry);
            imagePaths = [];
            currentPage = 0;
            processFiles(files);
            updatePagination();
            toggleControlsVisibility();
        }
    } catch (error) {
        console.error("Error selecting directory:", error);
    }
}

function handleFileSelectClick(event) {
    event.preventDefault();
    if (fileElem) {
        fileElem.click();
    }
}

async function handleFiles() {
    fileList.textContent = "";
    imagePaths = [];
    currentPage = 0;
    const files = Array.from(this.files);
    for (const file of files) {
        try {
            imagePaths.push(file.path);
        } catch (error) {
            console.error("Error processing file:", error);
        }
    }
    updatePagination();
    toggleControlsVisibility();
}

async function processFiles(files) {
    for (const file of files) {
        if (file.type === "FILE") {
            const fileName = file.entry;
            const extension = fileName.split('.').pop().toLowerCase();

            if (fileTypes.includes(extension)) {
                imagePaths.push(file.path);
            }
        }
    }
}

function createImageElement() {

    const img = document.createElement("img");
    img.classList.add("opacity-0", "transition-all", "duration-500","border-2","border-black","border-solid","rounded","shadow");
    img.addEventListener("dblclick", (event) => { toggleFullScreen(event) }); // Set up double-click to toggle fullscreen
    img.onload = () => {
        img.classList.remove("opacity-0");
        img.classList.add("opacity-100");

        URL.revokeObjectURL(img.src); // Clean up the object URL
    };
    img.onerror = () => {
        console.error("Error loading image from path");
    };

    return img;
}
async function updatePagination() {
    fileList.innerHTML = "";
    const start = currentPage * imagesPerPage;
    const end = Math.min(start + imagesPerPage, imagePaths.length);

    for (let i = start; i < end; i++) {
        const   img  = createImageElement();
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

function showPreviousPage() {
    currentPage = (currentPage - 1 + Math.ceil(imagePaths.length / imagesPerPage)) % Math.ceil(imagePaths.length / imagesPerPage);
    updatePagination();
}

function showNextPage() {
    currentPage = (currentPage + 1) % Math.ceil(imagePaths.length / imagesPerPage);
    updatePagination();
}

function updateImagesPerPage() {
    imagesPerPage = parseInt(imagesPerPageSlider.value, 10);
    imagesPerPageValue.textContent = imagesPerPage;
    updatePagination();
}
function updateImageSize() {
    let value = parseInt(sizeSlider.value, 10);

    if (value === 110) {
        sizeValue.textContent = "Max Fit";
        const imgs = fileList.querySelectorAll("img");
        imgs.forEach(img => {
            img.style.objectFit = "cover";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.position = "relative";
        });
    } else if (value === 0) {
        sizeValue.textContent = "Original";
        const imgs = fileList.querySelectorAll("img");
        imgs.forEach(img => {
            img.style.objectFit = "contain";
            img.style.width = "auto";
            img.style.height = "auto";
            img.style.position = "relative";
        });
    } else {
        sizeValue.textContent = `${value}%`;
        const imgs = fileList.querySelectorAll("img");
        imgs.forEach(img => {
            img.style.width = `${value}%`;
            img.style.objectFit = "scale-down";

            img.style.height = `${value}%`;
            img.style.position = "relative";
        });
    }
}
function toggleFullScreen(event) {
    console.log("sad")
    const img = event.currentTarget;
    if (img.classList.contains("fullscreen")) {
        toolbar.classList.toggle("h-fit")
        toolbar.classList.toggle("h-0")
        img.classList.remove("fullscreen");
        img.style.width = `${sizeSlider.value}%`;
        img.style.position = "";
        img.style.top = "";
        img.style.left = "";
        img.style.transform = "";
        img.style.zIndex = "";
        disableOverlay(); 
    } else {
        img.classList.add("fullscreen");
        toolbar.classList.toggle("h-fit")
        toolbar.classList.toggle("h-0")
        img.style.width = "100%";
        img.style.position = "fixed";
        img.style.top = "50%";
        img.style.left = "50%";
        img.style.transform = "translate(-50%, -50%)";
        img.style.zIndex = "1000";
        enableOverlay();
    }
}

function startSlideshow() {
    // Set fullscreen for the first image
    const imgs = imagePaths;//fileList.querySelectorAll("img");
    if (imgs.length > 0) {
        //toggleFullScreen({ currentTarget: imgs[0] });
        console.log("first image",imgs[0])
        showFullScreen(imgs[0])
    }

    let currentIndex = 0;
    const duration = parseInt(durationInput.value, 10) * 1000;
    const random = randomCheckbox.checked;

    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }

    slideshowInterval = setInterval(() => {
        if (random) {
            currentIndex = Math.floor(Math.random() * imgs.length);
        } else {
            currentIndex = (currentIndex + 1) % imgs.length;
        }
        //toggleFullScreen({ currentTarget: imgs[currentIndex] });
        showFullScreen(imgs[currentIndex],`${currentIndex} / ${imgs.length}`);
    }, duration);
}
function showFullScreen(urlOrPath, extra="") {
    // Remove any existing fullscreen image
    let existingFullScreenImg = document.querySelector("img.fullscreen");
    if (existingFullScreenImg) {
        existingFullScreenImg.remove();
        URL.revokeObjectURL(existingFullScreenImg.src); // Clean up the object URL
    }
    const filename = urlOrPath.split('/').pop();
    let filenameDisplay = document.getElementById("filenameDisplay");
    if (!filenameDisplay) {
        filenameDisplay = document.createElement("div");
        filenameDisplay.id = "filenameDisplay";
        filenameDisplay.style.position = "absolute";
        filenameDisplay.style.top = "10px";
        filenameDisplay.style.left = "10px";
        filenameDisplay.style.color = "white";
        filenameDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        filenameDisplay.style.padding = "5px 10px";
        filenameDisplay.style.borderRadius = "5px";
        filenameDisplay.style.zIndex = "9999"; // Higher than the fullscreen image
        document.body.appendChild(filenameDisplay);
    }

    // Update the filename display with the current filename
    filenameDisplay.innerText = `${filename} - ${extra}`;
    // Create a new image element
    const img = document.createElement("img");
    img.classList.add("fullscreen");
    img.style.height = "100%";
    img.style.position = "fixed";
    img.style.top = "50%";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, -50%)";
    img.style.zIndex = "1000";

    // Load the image from the given URL or local path
    if (urlOrPath.startsWith("http") || urlOrPath.startsWith("data:")) {
        img.src = urlOrPath; // Load from URL
    } else {
        // Load from local path
        Neutralino.filesystem.readBinaryFile(urlOrPath).then(arrayBuffer => {
            const blob = new Blob([arrayBuffer]);
            img.src = URL.createObjectURL(blob);
        }).catch(error => {
            console.error("Error loading image:", error);
        });
    }

    // Add the new image to the document
    document.body.appendChild(img);

    // Create overlay and show controls
    enableOverlay();
    toolbar.classList.toggle("h-fit");
    toolbar.classList.toggle("h-0");

    // Add event listener to close fullscreen on double-click
    img.addEventListener("dblclick", () => {
        img.remove();
        disableOverlay();
        toolbar.classList.toggle("h-fit");
        toolbar.classList.toggle("h-0");
               if (filenameDisplay) {
            filenameDisplay.style.display = "none"; // Hide filename display
        }
    });
      if (filenameDisplay) {
        filenameDisplay.style.display = "block";
    }
}
function stopSlideshow() {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    const imgs = fileList.querySelectorAll("img");
    imgs.forEach(img => {
        if (img.classList.contains("fullscreen")) {
            toggleFullScreen({ currentTarget: img });
        }
    });
}

function handleKeyDown(event) {
    if (event.key === "Escape") {
        if (slideshowInterval) {
            stopSlideshow();
        } else {
            const imgs = fileList.querySelectorAll("img");
            imgs.forEach(img => {
                if (img.classList.contains("fullscreen")) {
                    toggleFullScreen({ currentTarget: img });
                }
            });
        }
    }
}
function toggleControlsVisibility() {
    if (imagePaths.length > 0) {
        controlsContainer.style.display = "flex";
    } else {
        controlsContainer.style.display = "none";
    }
}