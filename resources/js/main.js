import { setupEventListeners, readDirectory, toast, createOverlay, getConfig } from './index.js';


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
    setupCommandList();
    document
        .getElementById("new-shortcut")
        .addEventListener("click", (ev) => recordTableShortcut(ev.target));

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

function onWindowClose() {
    Neutralino.app.exit();
}




function recordTableShortcut(element) {
    console.log("asd", element);
    let items = getStoredItems();

    if (!element) return;
    const prev = element.value;
    element.placeholder = "Press keyboard combination";
    console.log("asdaa", element);
    Mousetrap.record(function (sequence) {
        const seq = sequence;

        for (i in items) {
            if (i.shortcut === seq.join(" ")) {
                console.log("asaa");
                continue;
            }
        }
        if (prev !== seq.join(" ")) {
            element.value = seq.join(" ");
        } else element.value = prev;
        // sequence is an array like ['ctrl+k', 'c']
    });
}
async function getStoredItems() {
    let storedItems = [];
    try {
        storedItems = await Neutralino.storage.getData("commandItems");
        console.log(storedItems);
        let storeditems = [];
        if (storedItems) {
            storeditems = JSON.parse(storedItems);
            return storeditems;
        }

    } catch (err) {
        console.log("error when getting stored items", JSON.stringify(err));
        return [];
    }



    // if (storedItems) {
    //     try {
    //         storeditems = JSON.parse(storedItems);
    //     } catch (e) {
    //         console.log("Error parsing JSON from local storage", e);
    //         return;
    //     }
    // }
    console.log(tmp)
    return storeditems;
}
function setupCommandList() {
    let items = [];

    const commandList = document.getElementById("command-list");
    const jsonEditor = document.getElementById("json-editor");

    // Load items from local storage
    // const storedItems = getStoredItems();

    // Function to render items
    async function renderItems() {
        const items = await getStoredItems();
        commandList.innerHTML = "";
        if (!items) {
            console.log("no items yet")
            return;
        }
        console.log(JSON.stringify(items));
        for (let i in items) {
            console.log(items[i])
            console.log(i)
            const tr = document.createElement("tr");

            // Editable Checkbox
            const tdCheckbox = document.createElement("td");
            tdCheckbox.className = "border px-4 py-2 text-center";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.dataset.index = i;
            tdCheckbox.appendChild(checkbox);
            tr.appendChild(tdCheckbox);

            // Command Cell
            const tdCommand = document.createElement("td");
            tdCommand.className = "border px-4 py-2";
            tdCommand.textContent = items[i].command;
            tr.appendChild(tdCommand);

            // Title Cell
            const tdTitle = document.createElement("td");
            tdTitle.className = "border px-4 py-2";
            tdTitle.textContent = items[i].title;
            tr.appendChild(tdTitle);

            // Shortcut Cell
            const tdShortcut = document.createElement("td");
            tdShortcut.className = "border px-4 py-2";
            tdShortcut.textContent = items[i].shortcut;
            tdShortcut.addEventListener("click", function (ev) {
                if (checkbox.checked) {
                    return;
                }
                recordTableShortcut(ev.target);
            });
            tr.appendChild(tdShortcut);
            const rawJSON = document.getElementById("rawJsonData");
            // Event Listener for Checkbox
            checkbox.addEventListener("change", (e) => {
                rawJSON.classList.toggle("hidden");
                const isChecked = e.target.checked;
                if (isChecked) {
                    tdCommand.contentEditable = true;
                    tdTitle.contentEditable = true;
                    tdShortcut.contentEditable = true;
                    tdCommand.classList.add("bg-yellow-100");
                    tdTitle.classList.add("bg-yellow-100");
                    tdShortcut.classList.add("bg-yellow-100");
                } else {
                    tdCommand.contentEditable = false;
                    tdTitle.contentEditable = false;
                    tdShortcut.contentEditable = false;

                    tdCommand.classList.remove("bg-yellow-100");
                    tdTitle.classList.remove("bg-yellow-100");
                    tdShortcut.classList.remove("bg-yellow-100");

                    // Update the item with new values
                    items[i] = {
                        command: tdCommand.textContent.trim(),
                        title: tdTitle.textContent.trim(),
                        shortcut: tdShortcut.textContent.trim()
                    };

                    // Save to local storage and update JSON editor
                    Neutralino.storage.setData("commandItems", JSON.stringify(items));
                    // localStorage.setItem("commandItems", JSON.stringify(items));
                    jsonEditor.value = JSON.stringify(items, null, 2);
                }
            });

            commandList.appendChild(tr);
        }

        // Update JSON editor
        jsonEditor.value = JSON.stringify(items, null, 2);
    }

    // Initial render
    renderItems();

    // Add item
    const addItemButton = document.getElementById("add-item");
    addItemButton.addEventListener("click", () => {
        const newCommand = document.getElementById("new-command").value;
        const newTitle = document.getElementById("new-title").value;
        const newShortcut = document.getElementById("new-shortcut").value;

        if (newCommand && newTitle && newShortcut) {
            items.push({
                command: newCommand,
                title: newTitle,
                shortcut: newShortcut
            });

            // Save to local storage
            Neutralino.storage.setData("commandItems", JSON.stringify(items));

            //localStorage.setItem("commandItems", JSON.stringify(items));

            // Clear inputs
            document.getElementById("new-command").value = "";
            document.getElementById("new-title").value = "";
            document.getElementById("new-shortcut").value = "";

            // Re-render items
            renderItems();
        } else {
            alert("Please fill in all fields");
        }
    });

    // Update items from JSON editor
    const updateFromJsonButton = document.getElementById("update-from-json");
    updateFromJsonButton.addEventListener("click", () => {
        try {
            const newItems = JSON.parse(jsonEditor.value);
            if (Array.isArray(newItems)) {
                items = newItems;
                // Save to local storage
                Neutralino.storage.setData("commandItems", JSON.stringify(items));
                //localStorage.setItem("commandItems", JSON.stringify(items));
                // Re-render items
                renderItems();
            } else {
                alert("JSON must be an array");
            }
        } catch (e) {
            alert("Invalid JSON");
        }
    });
}