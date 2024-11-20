window.imconfigFilename = "./imbr.config";
export async function writeConfig(obj = window.imConfig, filename = window.imconfigFilename) {
    try {

        // Convert the JavaScript object to a JSON string
        let content = JSON.stringify(obj);
        // Write the JSON string to the specified file
        await Neutralino.filesystem.writeFile(filename, content);
        console.log('Config written successfully.', content);
    } catch (error) {
        console.log('Failed to write config:', error.message, error.code, JSON.stringify(error));
    }
}
export function saveCurrentConfig(){
    const config=createFromAllInputs();
    window.imConfig=config;
    writeConfig(config);
}

// Function to read a JSON file and return a JavaScript object
async function readConfig(filename = window.imconfigFilename) {
    try {
        let stats = await Neutralino.filesystem.getStats(filename)


    } catch (error) {
        if (!window.imConfig || window.imConfig.keys(value).length === 0) window.imConfig = {};

        writeConfig();

        return null;
    }

    try {
        // Read the file content
        let content = await Neutralino.filesystem.readFile(filename);
        // Parse the JSON string into a JavaScript object
        return JSON.parse(content);
    } catch (error) {
        console.error('Failed to read config:', error);
        return null
    }
}export function loadIntoDocument(config) {
    Object.keys(config).forEach(key => {
        // Try to find an element by id first
        let element = document.getElementById(key);
        if (!element) {
            // If no element with the id is found, search by name
            element = document.querySelector(`[name="${key}"]`);
        }
        // If an element is found, set its value
        if (element) {
            element.value = config[key];
        }else{
            console.log("didnt find",key)
        }
    });
}

export async function getConfig() {
    try {
        const config = await readConfig(window.imconfigFilename);
        
        window.imConfig = config;
        console.log('Configuration: ', JSON.stringify(config));
        return config;
    } catch (error) {
        console.error('Failed to read configuration:', error);
        return null; // or throw the error depending on how you want to handle failures
    }
    return config;
}
export async function createConfigEditor(config = null, saveCallback) {
    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop', "hidden");
    if (!config) config = await getConfig();
    loadIntoDocument(config)
    console.log(config);

    const modal = document.createElement('div');

    modal.classList.add("p-4", "bg-red-100", "text-black", "modal", "opacity-0");

    const form = document.createElement('form');
    form.id = "configForm"
    form.name = "configForm"

    Object.keys(config).forEach(key => {
        const inputWrapper = document.createElement('div');

        const label = document.createElement('label');
        label.textContent = key;
        label.for = key;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = key;
        input.name = key;
        input.value = config[key];

        inputWrapper.appendChild(label);
        inputWrapper.appendChild(input);
        form.appendChild(inputWrapper);
    });

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Save';


    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = () => { backdrop.remove(); modal.remove(); form.remove(); };

    form.appendChild(saveButton);
    form.appendChild(cancelButton);

    modal.appendChild(form);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    saveButton.onclick = () => {
        // const form = document.getElementById("configForm")
        // const formData = new FormData(form);

        // if (!window.imConfig) window.imConfig = {};
        // for (const value of formData) {
        //     window.imConfig[value[0]] = value[1];
        // }
        // window.imConfig = formData;
        saveCurrentConfig();
        saveCallback(window.imConfig);
        backdrop.classList.add('hidden')
        modal.classList.remove('opacity-0')
        modal.classList.add('opacity-100')
        backdrop.classList.remove('block')
    };
    // Function to show the modal
    return () => {
        backdrop.classList.add = 'block';
        backdrop.classList.remove = 'hidden';
    };
} export function createFromForm(formElement) {
    const config = {};
    Array.from(formElement.elements).forEach(element => {
        if (element.name) {  // Checking if the element has a name attribute
            config[element.name] = element.value;
        } else if (element.id) {  // Fall back to id if no name is present
            config[element.id] = element.value;
        }
    });
    return config;
}

export function createFromAllInputs() {
    const config = {};
    document.querySelectorAll('input, select, textarea').forEach(element => {
        const key = element.name || element.id;  // Prefer name, but fall back to id
        if (key) {  // Ensure the element has a name or id to be used as a key
            config[key] = element.value;
        }
    });
    return config;
}