import { setupEventListeners, readDirectory, toast, createOverlay,getConfig } from './index.js';


Neutralino.init();


Neutralino.events.on("windowClose", onWindowClose);

function extractEncodedPath() {
    // Get the current URL's hash part
    const hash = window.location.hash;

    // Check if the hash contains a `#` and `path=`
    if (hash && hash.includes('#') && hash.includes('path=')) {
        // Extract the part after 'path='
        const encodedPath = hash.split('path=')[1];

        // Decode the HTML-encoded path
        const decodedPath = decodeURIComponent(encodedPath);

        return decodedPath;
    } else {
        // Return null if there's no `path=` parameter in the hash
        return null;
    }
} 
Neutralino.events.on("ready", async () => {

    let path = extractEncodedPath();
    getConfig();

    let args = String(NL_ARGS);
    if (args.includes(",")) {
        args = args.slice(args.lastIndexOf(",") + 1);
        if (args.startsWith("--") === false) {
            
            if (args.endsWith("/") === false) args = `${args}/`
            

            let e = await Neutralino.filesystem.getStats(args);
            if (e) path = args;
        }
    }
    createOverlay();
    if (path !== null) {
        readDirectory(path);
    } else {
        setupEventListeners();
    }
})
function showConfig(){
    
}
function onWindowClose() {
    Neutralino.app.exit();
}