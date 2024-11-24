import { TaskDescription } from "./TaskDescription.js";

const SCHEMA_URL = "https://json.schemastore.org/task.json";

export class BaseTaskConfiguration {
    constructor(rawJson) {
        this.rawData = JSON.parse(rawJson);
        this.tasks = this.rawData.tasks || [];
        this.command = this.rawData.command || "";
        this.options = this.rawData.options || {};
        this.platformSpecific = {
            linux: this.rawData.linux || {},
            windows: this.rawData.windows || {}
        };
    }

    getTasks() {
        return this.tasks;
    }

    setTasks(tasks) {
        this.tasks = tasks;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    exportJson() {
        return JSON.stringify({
            tasks: this.tasks,
            command: this.command,
            options: this.options,
            ...this.platformSpecific
        }, null, 2);
    }

    importJson(json) {
        const data = JSON.parse(json);
        this.tasks = data.tasks || [];
        this.command = data.command || "";
        this.options = data.options || {};
        this.platformSpecific = {
            linux: data.linux || {},
            windows: data.windows || {}
        };
    }

    async validate() {
        const response = await fetch("https://cdn.jsdelivr.net/npm/ajv@8.12.0/dist/ajv.min.js");
        const script = document.createElement("script");
        script.src = response.url;
        document.body.appendChild(script);

        return new Promise((resolve, reject) => {
            script.onload = async () => {
                const Ajv = window.Ajv;
                const ajv = new Ajv();
                const schemaResponse = await fetch(SCHEMA_URL);
                const schema = await schemaResponse.json();
                const validate = ajv.compile(schema);
                const valid = validate(this.rawData);

                if (!valid) {
                    console.error(validate.errors);
                    reject("Validation failed");
                } else {
                    resolve(true);
                }
            };
            script.onerror = () => reject("Failed to load Ajv library");
        });
}

}