import { imagePaths } from './index.js';

let currentPage = 0;
let imagesPerPage = parseInt(document.getElementById("imagesPerPage").value, 10);
let overlayElement = null;

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
        const img = createImageElement(imagePaths[i],i);

        fileList.appendChild(img);




        try {
            const arrayBuffer = await Neutralino.filesystem.readBinaryFile(imagePaths[i]);
            const blob = new Blob([arrayBuffer]);

            //img.src = URL.createObjectURL(blob);
           img.getElementsByTagName("img")[0].src = URL.createObjectURL(blob);
        } catch (error) {
            console.log("Error loading image:", imagePaths[i], error);
        }
    }
    //updateImageSize();
}

export function createImageElement(label = "",order=1) {
    const img = document.createElement("img");
    const imgWrapper = document.createElement("div");
    const labelElement = document.createElement("div");
    labelElement.textContent = label;
    labelElement.classList.add("opacity-100","transition-all")
    imgWrapper.classList.add("w-full","transition-all","w-fit","h-fit");
    img.classList.add("opacity-0", "transition-all","duration-500");

    let size = parseInt( document.getElementById("sizeSlider").value, 10) || 10;
    imgWrapper.addEventListener("dblclick", toggleFullScreen);
    img.onload = () => {

        setTimeout(function () {
            imgWrapper.classList.remove("opacity-0");
            imgWrapper.style.background="";
            imgWrapper.classList.add("opacity-100");
            labelElement.classList.remove("opacity-0")
            labelElement.classList.add("opacity-100");
            img.classList.remove("opacity-0");
            img.classList.add("opacity-100");
            img.style.width = `${size}%`;
            img.style.height = `${size}%`;
            URL.revokeObjectURL(img.src);
        }, order*1000);
    };
    img.onerror = () => {
        console.error("Error loading image from path");
    };
    imgWrapper.style.background="url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgd2lkdGg9IjEwMHB4IiBoZWlnaHQ9IjEwMHB4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOmJ4PSJodHRwczovL2JveHktc3ZnLmNvbSI+CiAgPGRlZnM+CiAgICA8Yng6Z3JpZCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPgogICAgPGxpbmVhckdyYWRpZW50IGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTMwIiB5MT0iMCIgeDI9Ii0zMCIgeTI9IjEwMCIgaWQ9ImdyYWRpZW50LTAiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS41OTI4MiwgMC4yMzY1MywgLTAuNDAzMDcsIDEsIDEwLjIwNzk3LCA3LjA5NTgxKSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IHJnYmEoMjM1LCAyMzUsIDIzNSwgMC40MjcpOyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiByZ2JhKDEzNCwgMTM0LCAxMzQsIDAuMzE0KTsiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBzdHlsZT0ic3Ryb2tlOiByZ2IoMCwgMCwgMCk7IGZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsiLz4KICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCg1LCAwLCAwLCA1LjU1NTU2LCAtMTAsIC0xNi42NjY2NykiIHN0eWxlPSIiPgogICAgPHBhdGggZD0iTSAyMCA1IEwgNCA1IEwgNCAxOSBMIDEzIDEwIEMgMTQgOSAxNCA5IDE1IDEwIEwgMjAgMTUgTCAyMCA1IFogTSAyIDMgTCAyMiAzIEwgMjIgMjEgTCAyIDIxIEwgMiAzIFogTSA4IDExIEMgNyAxMSA2IDEwIDYgOSBDIDYgOCA2IDcgOCA3IEMgMTAgNyAxMCA4IDEwIDkgQyAxMCAxMCA5IDExIDggMTEgWiIgc3R5bGU9IiI+CiAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwiIHZhbHVlcz0icmdiKDE3LjY0NyUgMTcuNjQ3JSAxNy42NDclKTtyZ2IoNzIuOTQxJSA3Mi45NDElIDcyLjk0MSUpOyMxNjE2MTYiIGJlZ2luPSJpbmRlZmluaXRlIiBkdXI9IjJzIiBrZXlUaW1lcz0iMDsgMC41OyAxIiBmaWxsPSJmcmVlemUiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgICA8L3BhdGg+CiAgPC9nPgogIDxwb2x5Z29uIHN0eWxlPSJmaWxsOiB1cmwoJyNncmFkaWVudC0wJyk7IiBwb2ludHM9Ii00MyAxMDAgMCAwIC02MiAwIC0xMDAgOTkiPgogICAgPGFuaW1hdGVUcmFuc2Zvcm0gdHlwZT0idHJhbnNsYXRlIiBhZGRpdGl2ZT0ic3VtIiBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHZhbHVlcz0iMCAwOzE2MCAwIiBkdXI9IjAuOThzIiBmaWxsPSJmcmVlemUiIGtleVRpbWVzPSIwOyAxIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPgogIDwvcG9seWdvbj4KICA8ZyBzdHlsZT0iIj4KICAgIDxwYXRoIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IHN0cm9rZTogcmdiKDAsIDAsIDApOyIgZD0iTSAzMCAyMiBDIDI0IDIyIDIwIDI3IDIwIDMzIEMgMjAgMzkgMjQgNDQgMzAgNDQgQyAzNiA0NCA0MCAzOSA0MCAzMyBDIDQwIDI3IDM2IDIyIDMwIDIyIFogTSAxMCA4OSBMIDEwIDExIEwgOTAgMTEgTCA5MCA2NiBDIDg1IDYwIDYxIDM1IDU5IDM1IEMgNTcgMzUgMTAgODkgMTAgODkgWiIvPgogIDwvZz4KPC9zdmc+') no-repeat left";
    imgWrapper.style.backgroundSize="contain"
    imgWrapper.appendChild(img)
    imgWrapper.appendChild(labelElement)

    return imgWrapper;
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
    const value = parseInt( document.getElementById("sizeSlider").value, 10);
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

export function toggleControlsVisibility(visible=true) {
    const controlsContainer = document.getElementById("controlsContainer");
    if (visible) {
        controlsContainer.style.display = "flex";
    } else {
        controlsContainer.style.display = "none";
    }
}
