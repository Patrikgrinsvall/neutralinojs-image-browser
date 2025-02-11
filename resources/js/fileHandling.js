// fileHandling.js

import { updatePagination, toggleControlsVisibility } from './index.js'

export let imagePaths = [];

export async function handleDirSelectClick() {
    try {
        const entry = await Neutralino.os.showFolderDialog('Select image directory', { defaultPath: '~' });
        if (entry) {
            await handleDirectorySelection(entry);
        }
    } catch (error) {
        console.error("Error selecting directory:", error);
    }
}
export function sortByFilename(paths) {
    // Make sure we don't mutate the original array
    const pathsCopy = [...paths];

    pathsCopy.sort((pathA, pathB) => {
      // Extract filename from each path (taking the last segment after the '/')
      const filenameA = pathA.split('/').pop();
      const filenameB = pathB.split('/').pop();

      // Use localeCompare for alphabetical ordering
      return filenameA.localeCompare(filenameB);
    });

    return pathsCopy;
  }
export async function handleDirectorySelection(entry, glob = null) {
    const files = await Neutralino.filesystem.readDirectory(entry);
    imagePaths = [];
    document.getElementById("selectedDir").value = entry;
    processFiles(files, null);
    updatePagination(imagePaths);
    toggleControlsVisibility();
    return files;
}
export function updateFiles() {
    handleDirectorySelection(document.getElementById("selectedDir").value, document.getElementById("globPattern").value);
}

export async function readDirectory(dir) {
    try {
        const files = await Neutralino.filesystem.readDirectory(dir);
        imagePaths = processFiles(files);
        updatePagination(imagePaths);
        toggleControlsVisibility();
    } catch (error) {
        console.error("Failed to read directory:", error);
    }
}function globToRegex(glob) {
    // Escape special regex characters except for * and ? and {}
    let regexStr = glob.replace(/[-\/\\^$+?.()|[\]]/g, '\\$&');

    // Convert the `{jpg,png}` pattern to `(jpg|png)`
    regexStr = regexStr.replace(/\{([^}]+)\}/g, (match, group) => {
        return '(' + group.split(',').join('|') + ')';
    });

    // Replace glob wildcards with regex equivalents
    regexStr = regexStr.replace(/\*/g, '.*').replace(/\?/g, '.');

    return new RegExp('^' + regexStr + '$', 'i'); // 'i' for case-insensitive matching
}
function globToRegex1(glob) {
    // Escape special regex characters except for * and ?
    let regexStr = glob.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');
    // Replace glob wildcards with regex equivalents
    regexStr = regexStr.replace(/\*/g, '.*').replace(/\?/g, '.');
    return new RegExp('^' + regexStr + '$', 'i'); // 'i' for case-insensitive matching
}
function globToRegex2(glob) {
    let regexStr = '';

    // Supports extended glob patterns by iterating through each character
    for (let i = 0; i < glob.length; i++) {
        const char = glob[i];
        switch (char) {
            case '*':
                // Support for double stars '**'
                if (glob[i + 1] === '*') {
                    regexStr += '.*';
                    i++; // Skip the next star
                } else {
                    regexStr += '[^\/]*';
                }
                break;
            case '?':
                regexStr += '[^\/]';
                break;
            case '[':
                // Handle negation character class
                let j = i + 1;
                if (glob[j] === '!') {
                    regexStr += '[^';
                    j++; // Skip the '!' character
                } else {
                    regexStr += '[';
                }
                // Add characters inside the brackets to the regex until ']' is found
                for (; j < glob.length && glob[j] !== ']'; j++) {
                    regexStr += glob[j] === '\\' ? '\\\\' : glob[j]; // Escape backslash
                }
                if (glob[j] === ']') {
                    regexStr += ']';
                    i = j;
                }
                break;
            // Escape other special characters in regex
            case '/':
            case '^':
            case '$':
            case '+':
            case '.':
            case '(':
            case ')':
            case '|':
            case '{':
            case '}':
            case '\\':
                regexStr += '\\' + char;
                break;
            default:
                regexStr += char;
        }
    }

    return new RegExp('^' + regexStr + '$', 'i'); // 'i' for case-insensitive matching
}
function filterByGlob(files, glob = "*") {
    let tmpimagePaths = [];
    let regex;
    try {

    } catch (e) {
        console.error(`Invalid glob pattern "${glob}":`, e.message);
        return tmpimagePaths;
    }

    for (const file of files) {
        if (file.type === "FILE" && regex.test(file.entry)) {
            if (String(file.path).includes("mask")) continue;
            tmpimagePaths.push(file);
        } else {
            console.log("no match", file)
        }
    }
    return tmpimagePaths;
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
    toggleControlsVisibility();
}

async function processFiles(files, globPattern = null) {
    const fileTypes = ["jpg", "png", "jpeg"];
    let glob;
    let regex;
    let tmpImagePaths=[];
    imagePaths.splice(0, imagePaths.length);
    imagePaths.splice(0, imagePaths.length);
    if (!globPattern) glob = document.getElementById("globPattern").value;
    else glob = globPattern;
    if (glob && glob != "") {
        regex = globToRegex(glob);
    }
    for (const file of files) {
        if (file.type === "FILE" && fileTypes.includes(file.entry.split('.').pop().toLowerCase())) {
            if (!regex) {
                tmpImagePaths.push(file.path);
                continue;

            }
            if (regex && regex.test(file.entry)) { tmpImagePaths.push(file.path); }
            else console.log("regex mismatch", regex);
        }
    }
    imagePaths=sortByFilename(tmpImagePaths)
    console.log(tmpImagePaths[0]);
    console.log(imagePaths[0]);
    return imagePaths;

}
function getDirectoryPath(filePath) {
    // Find the last occurrence of the forward slash `/`
    const lastSlashIndex = filePath.lastIndexOf('/');

    // Extract the substring from the start to the last slash index
    const dirPath = filePath.substring(0, lastSlashIndex);

    return dirPath;
}