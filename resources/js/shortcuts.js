let shortcuts = [{"shortcut":"Ctrl+1","command":"Command 1"},{"shortcut":"Ctrl+2","command":"Command 2"}]
let tempShortcuts = [];

export function addShortcut(shortcut = '', command = '') {
    tempShortcuts.push({shortcut, command});     
   const list = document.getElementById('shortcutList');
    const index = shortcuts.length;
    const html = `
        <div class="flex items-center space-x-2">
            <input type="text" id="shortcut${index}" placeholder="Enter Shortcut" class="shortcut p-2 border" value="${shortcut}">
            <input type="text" id="command${index}" placeholder="Enter Command" class="command p-2 border" value="${command}">
        </div>
    `;
    list.innerHTML += html;

    // Listen for shortcut input focus to capture keys
    const shortcutInput = document.getElementById(`shortcut${index}`);
    shortcutInput.addEventListener('focus', function() {
        Mousetrap.record(function(sequence) {
            shortcutInput.value=sequence;
        });
    });

    // shortcutInput.addEventListener('blur', function() {
    //     Mousetrap.unbind('mod+1 mod+2 mod+3 mod+4');
    // });
    renderShortcuts();
}

export function renderShortcuts() {
    const list = document.getElementById('modalContent');
    list.innerHTML = ''; // Clear the list first
    tempShortcuts.forEach((item, index) => {
        const html = `
            <div class="flex items-center space-x-2">
                <input type="text" id="shortcut${index}" class="shortcut p-2 border" value="${item.shortcut}" placeholder="Enter Shortcut">
                <input type="text" id="command${index}" class="command p-2 border" value="${item.command}" placeholder="Enter Command">
            </div>
        `;
        list.innerHTML += html;
    });
}

export function openModal() {
    document.getElementById('modal').classList.remove('hidden');
}

export function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

export function saveChanges() {
    shortcuts = JSON.parse(JSON.stringify(tempShortcuts));
    closeModal();
}

export function cancelChanges() {
    tempShortcuts = JSON.parse(JSON.stringify(shortcuts));
    renderShortcuts();
    closeModal();
}

export function importShortcuts(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const importedShortcuts = JSON.parse(e.target.result);
            shortcuts = importedShortcuts;
            tempShortcuts = JSON.parse(JSON.stringify(shortcuts));
            renderShortcuts();
        };
        reader.readAsText(file);
    }
}

export function exportShortcuts() {
    const jsonStr = JSON.stringify(shortcuts);
    const blob = new Blob([jsonStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shortcuts.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function initShortcuts(){
    tempShortcuts = JSON.parse(JSON.stringify(shortcuts));
    addShortcut(); // Add an empty row initially
    openModal();
}