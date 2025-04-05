export class ZoomableImage {
  constructor(src, parentContainer, options = {}) {
    this.src = src;
    this.container = parentContainer;

    this.scale = 1;
    this.pendingScale = 1;

    this.options = {
      scaleStep: options.scaleStep || 0.1,
      maxScale: options.maxScale || 4,
      minScale: options.minScale || 0.5,
      debounceTime: options.debounceTime || 1000,
    };

    this.zoomTimeout = null;

    this.initElements();
    this.attachEvents();
  }

  // Initialize HTML structure dynamically
  initElements() {
    // Clear previous content
    this.container.innerHTML = '';

    // Create container div
    this.imgContainer = document.createElement('div');
    this.imgContainer.className = 'img-container relative inline-block overflow-hidden';
    this.imgContainer.style.position = 'relative';
    this.imgContainer.style.display = 'inline-block';
    this.imgContainer.style.overflow = 'hidden';

    // Create image element
    this.img = document.createElement('img');
    this.img.id = 'zoomable-image';
    this.img.src = this.src;
    this.img.alt = 'Zoomable Image';
    this.img.style.transformOrigin = '0 0';
    this.img.style.willChange = 'transform, opacity';

    // Create overlay for zoom text
    this.overlay = document.createElement('div');
    this.overlay.id = 'zoom-overlay';
    this.overlay.style.position = 'absolute';
    this.overlay.style.top = '0';
    this.overlay.style.left = '0';
    this.overlay.style.right = '0';
    this.overlay.style.bottom = '0';
    this.overlay.style.display = 'flex';
    this.overlay.style.alignItems = 'center';
    this.overlay.style.justifyContent = 'center';
    this.overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    this.overlay.style.pointerEvents = 'none';
    this.overlay.style.opacity = '0';
    this.overlay.style.transition = 'opacity 0.2s ease';

    // Overlay text
    const overlayText = document.createElement('span');
    overlayText.innerText = 'Zooming...';
    overlayText.style.color = 'white';
    overlayText.style.fontSize = '3rem';
    overlayText.style.fontWeight = 'bold';
    overlayText.style.userSelect = 'none';

    this.overlay.appendChild(overlayText);

    // Append elements
    this.imgContainer.appendChild(this.img);
    this.imgContainer.appendChild(this.overlay);
    this.container.appendChild(this.imgContainer);
  }

  attachEvents() {
    this.imgContainer.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
  }

  handleWheel(event) {
    event.preventDefault();

    const delta = Math.sign(event.deltaY);
    const { left, top } = this.imgContainer.getBoundingClientRect();

    this.originX = event.clientX - left;
    this.originY = event.clientY - top;

    let newScale = this.pendingScale - delta * this.options.scaleStep;
    newScale = Math.min(Math.max(newScale, this.options.minScale), this.options.maxScale);

    this.pendingScale = newScale;

    // Instant visual feedback
    this.img.style.opacity = '0';
    this.img.style.border = '10px solid black';
    this.overlay.style.opacity = '1';

    clearTimeout(this.zoomTimeout);
    this.zoomTimeout = setTimeout(() => {
      this.applyZoom();
    }, this.options.debounceTime);
  }

  applyZoom() {
    const originPercentX = (this.originX / this.imgContainer.clientWidth) * 100;
    const originPercentY = (this.originY / this.imgContainer.clientHeight) * 100;

    this.img.style.transformOrigin = `${originPercentX}% ${originPercentY}%`;
    this.img.style.transform = `scale(${this.pendingScale})`;

    // Restore visibility immediately
    this.img.style.opacity = '1';
    this.img.style.border = 'none';
    this.overlay.style.opacity = '0';

    this.scale = this.pendingScale;
  }

  // Method to replace existing image (exiting old and initializing new)
  replaceImage(newSrc) {
    this.src = newSrc || this.src;
    this.scale = 1;
    this.pendingScale = 1;

    // Completely remove existing elements and re-initialize
    this.initElements();
    this.attachEvents();
  }
}

// Initialization Example:
const parentContainer = document.getElementById('image-wrapper');
const initialImageSrc = 'your-image.jpg';

// Create the zoomable image instance:
export const zoomable = new ZoomableImage(initialImageSrc, parentContainer, {
  scaleStep: 0.1,
  maxScale: 4,
  minScale: 0.5,
  debounceTime: 1000, // 1 second debounce
});


// Example of replacing the existing image later:
// zoomable.replaceImage('new-image.jpg');
