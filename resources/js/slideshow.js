// slideshow.js

import { createImageElement, disableOverlay, enableOverlay, imagePaths,handleDirectorySelection } from './index.js';

export let slideshowInterval = null;

let currentIndex = 0;
let duration = 0;
let random = false;
let displayMode="original";

// export function startSlideshow() {
//     const duration = parseInt(document.getElementById("durationInput").value, 10) * 1000;
//     const random = document.getElementById("randomCheckbox").checked;

//     if (slideshowInterval) {
//         clearInterval(slideshowInterval);
//         slideshowInterval = null;
//     }
//     document.addEventListener("keydown", handleKeyboardNavigation);

//     slideshowInterval = setInterval(() => {
//         if (random) {
//             currentIndex = Math.floor(Math.random() * imagePaths.length);
//         } else {
//             currentIndex = (currentIndex + 1) % imagePaths.length;
//         }
//         showFullScreen(imagePaths[currentIndex]);
//         document.getElementById("imageInfo").innerText = `${imagePaths[currentIndex]} - ${currentIndex} / ${imagePaths.length}`;
//     }, duration);
// }


export function startSlideshow() {
    duration = parseInt(document.getElementById("durationInput").value, 10) * 1000;
    random = document.getElementById("randomCheckbox").checked;
    handleDirectorySelection(document.getElementById("selectedDir").value)
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }

    // Show the first image immediately
    currentIndex = random ? Math.floor(Math.random() * imagePaths.length) : 0;
    showFullScreen(imagePaths[currentIndex]);
    updateImageInfo();

    // Start the slideshow interval
    startSlideshowInterval();

    // Add the event listener for keyboard navigation
    document.addEventListener("keydown", handleKeyboardNavigation);
}

function startSlideshowInterval() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval)
        slideshowInterval = null;
    }
    slideshowInterval = setInterval(() => {
        if (random) {
            currentIndex = Math.floor(Math.random() * imagePaths.length);
        } else {
            currentIndex = (currentIndex + 1) % imagePaths.length;
        }
        showFullScreen(imagePaths[currentIndex]);
        updateImageInfo();
    }, duration);
}

async function updateImageInfo(text = "") {
    let existingRating = "";
    if (text === "") {

        let ratingCommand = createRatingCommand(imagePaths[currentIndex]);
        existingRating = await Neutralino.os.execCommand(ratingCommand).then((res) => {

            if (res.stdOut) {
                existingRating = res.stdOut.trim();
                console.log(existingRating);
                return existingRating
            }
            return "";
        }).catch((err) => {
            console.log("error block", err);
        });
        // const processRunner = new Process();
        // console.log(ratingCommand)
        // processRunner.addCommand(ratingCommand)
        //     .run()
        //     .then(({stdOut, stdErr, exitCode}) => {
        //         exitingRating = stdOut;
        //     })
        //     .catch(error => {
        //         console.log("Error running process:", JSON.stringify(error));
        //     });
    }
    if (existingRating !== "") {
        text = `Rating ${String(existingRating)} `
        for (let i = 1; i <= existingRating; i++) text += "⭐"
        if (existingRating === 0) text += "⭙";
    }
    document.getElementById("imageInfo").innerText = `${imagePaths[currentIndex]} - ${currentIndex + 1} / ${imagePaths.length} ${text}`;
}

async function handleKeyboardNavigation(event) {
    // Clear the current interval and reset it after key navigation
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
    switch (event.key) {
        case 'Escape':
            // Stop the slideshow on Escape
            stopSlideshow();
            return;
        case 'ArrowRight':
            // Go to the next image
            currentIndex = (currentIndex + 1) % imagePaths.length;
            break;
        case 'ArrowLeft':
            // Go to the previous image
            currentIndex = (currentIndex - 1 + imagePaths.length) % imagePaths.length;
            break;
        case 'PageDown':
            // Skip to the next "page" (next 10 images)
            currentIndex = (currentIndex + 10) % imagePaths.length;
            break;
        case 'PageUp':
            // Skip to the previous "page" (previous 10 images)
            currentIndex = (currentIndex - 10 + imagePaths.length) % imagePaths.length;
            break;
        case 'Home':
            // Jump to the first image
            currentIndex = 0;
            break;
        case 'End':
            // Jump to the last image
            currentIndex = imagePaths.length - 1;
            break;
        case 'Delete':
            let cmd = `unlink ${imagePaths[currentIndex]}`
            let tmpout = await Neutralino.os.execCommand(cmd)
            updateImageInfo("Deleted");
            imagePaths.splice(currentIndex, 1)

            currentIndex = (currentIndex + 1) % imagePaths.length;
            break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
            let cwd = getDirectoryPath(imagePaths[currentIndex]);
            let ratingCommand = createRatingCommand(imagePaths[currentIndex], event.key);
            //const processRunner = new Process(cwd);
            let info = await Neutralino.os.execCommand(ratingCommand)

            // processRunner.addCommand(ratingCommand)
            //     .run()
            //     .then(({stdOut, stdErr, exitCode}) => {
            //         console.log("Output:", stdOut);
            //         console.log("Output:", stdErr);
            //         console.log("Exit Code:", exitCode);
            //     })
            //     .catch(error => {
            //         console.log("Error running process:", error, ratingCommand);
            //     });
            let ratingText = `New Rating ${String(event.key)} `
            for (let i = 1; i <= event.key; i++) ratingText += "⭐"
            if (event.key === 0) ratingText += "⭙";
            currentIndex = (currentIndex + 1) % imagePaths.length;
            updateImageInfo(ratingText);
            break;
        case "f":
            if(displayMode==="original") displayMode="fit";
            else displayMode="original";
            break;
        default:

            break;


    }


    showFullScreen(imagePaths[currentIndex]);
    updateImageInfo();
    // Restart the slideshow interval after navigation
    startSlideshowInterval();
}

function getDirectoryPath(filePath) {
    // Find the last occurrence of the forward slash `/`
    const lastSlashIndex = filePath.lastIndexOf('/');

    // Extract the substring from the start to the last slash index
    const dirPath = filePath.substring(0, lastSlashIndex);

    return dirPath;
}

function createRatingCommand(absImagePath, rating = null) {
    let ratingCommand = "";
    if (rating === null) {
        ratingCommand = `/bin/exiftool -rating ${absImagePath} | grep -Eo '[0-9]' | tr -d '\n'`
        // ratingCommand = `/bin/exiftool -rating ${absImagePath}`;
    } else {
        let ratingPercent = rating * 20;
        //ratingCommand = `/bin/exiftool -Rating=${rating} -RatingPercent=${ratingPercent} ${absImagePath} || ( echo "you must have exiftool installed" && exit -1 ) `
        ratingCommand = `/bin/exiftool -Rating=${rating} -RatingPercent=${ratingPercent} ${absImagePath}`
    }
    return ratingCommand.trim();
}

export function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
        document.removeEventListener("keydown", handleKeyboardNavigation);
        disableOverlay();
    }

    // Remove any fullscreen images when the slideshow is stopped
    const existingImages = document.querySelectorAll(".fullscreen");
    existingImages.forEach(img => img.remove());
}
function setAspect(imageElement, mode="original") {

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (mode === 'original') {
        // Reset styles to display the image in its original size
        imageElement.style.width = "";
        imageElement.style.height = "";
    } else if (mode === 'fit') {
        // Reset any previously set styles
        imageElement.style.width = "";
        imageElement.style.height = "";

        // Calculate the aspect ratios
        const imageRatio = imageElement.naturalWidth / imageElement.naturalHeight;
        const viewportRatio = viewportWidth / viewportHeight;

        if (imageRatio > viewportRatio) {
            // Image is wider than the viewport
            imageElement.style.width = '100%';
            imageElement.style.height = 'auto';
        } else {
            // Image is taller than the viewport or squares
            imageElement.style.width = 'auto';
            imageElement.style.height = '100%';
        }
    }
}

// function showFullScreen(urlOrPath) {
//     const existingImages = document.querySelectorAll(".fullscreen");
//     existingImages.forEach(img => img.remove());
//     const img = createImageElement();
//     img.classList.add("fullscreen", "opacity-0");
//     img.style = `
//         height: 100%;
//         position: fixed;
//         top: 50%;
//         left: 50%;
//         transform: translate(-50%, -50%);
//         z-index: 1000;
//     `;

//     if (urlOrPath.startsWith("http") || urlOrPath.startsWith("data:")) {
//         img.src = urlOrPath;
//     } else {
//         Neutralino.filesystem.readBinaryFile(urlOrPath).then(arrayBuffer => {
//             const blob = new Blob([arrayBuffer]);
//             img.src = URL.createObjectURL(blob);

//         }).catch(error => {
//             console.log("Error loading image:", error);
//         });
//         //ssaddImage(urlOrPath, document.getElementById("fileList"))
//     }
//     img.onload = () => {
//         img.classList.remove("opacity-0");
//         img.classList.add("opacity-100");
//         setTimeout(() => URL.revokeObjectURL(img.src), 1000);  // Delay revoking for 1 second
//     };
//     img.onerror = (a, b, c, d, e) => {

//         console.log(`src: ${img.src}`);
//         console.log(`message: ${JSON.stringify(a)}`);
//         console.log(`source: ${b}`);
//         console.log(`lineno: ${c}`);
//         console.log(`colno: ${d}`);
//         console.log(`error: ${e}`);
//     }
//     document.body.appendChild(img);
//     enableOverlay();

//     img.addEventListener("dblclick", () => {
//         img.remove();
//         disableOverlay();
//     });
// }

function showFullScreen(urlOrPath) {
    // Remove all existing images with the "fullscreen" class
    const existingImages = document.querySelectorAll(".fullscreen");
    existingImages.forEach(img => img.remove());

    const imgw = createImageElement();
    const img = imgw.getElementsByTagName("img")[0];
    img.classList.add("fullscreen");
    img.classList.add("opacity-0","transition-all","duration-500","bg-blend-hue");
    img.classList.remove("opacity-100");
    img.style = `
        height: auto;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    `;
    setAspect(img,displayMode);
    if (urlOrPath.startsWith("http") || urlOrPath.startsWith("data:")) {
        img.src = urlOrPath;
    } else {
        Neutralino.filesystem.readBinaryFile(urlOrPath).then(arrayBuffer => {
            const blob = new Blob([arrayBuffer]);
            img.src = URL.createObjectURL(blob);

        }).catch(error => {
            console.log("Error loading image:", JSON.stringify(error))
        });
        img.onload = () => {
            img.classList.remove("opacity-0");
            img.classList.add("opacity-100");
            setTimeout(() => URL.revokeObjectURL(img.src), 1000);  // Delay revoking for 1 second
            //     };
        }

        document.body.appendChild(img);
        enableOverlay();

        img.addEventListener("dblclick", () => {
            img.remove();
            disableOverlay();
        });
    }
}