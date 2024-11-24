// BaseTaskConfiguration.js
import TaskDescription from './TaskDescription.js';
import CommandOptions from './CommandOptions.js';

export default class BaseTaskConfiguration {
    constructor(jsonData = {}) {
        // Support raw JSON text or JavaScript object
        if (typeof jsonData === 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (e) {
                console.error('Invalid JSON string provided to BaseTaskConfiguration constructor.');
                jsonData = {};
            }
        }

        this.type = jsonData.type || 'process';
        this.command = jsonData.command || '';
        this.args = jsonData.args || [];
        this.options = new CommandOptions(jsonData.options || {});
        this.tasks = (jsonData.tasks || []).map(task => new TaskDescription(task));
        this.linux = jsonData.linux ? new BaseTaskConfiguration(jsonData.linux) : null;
        this.windows = jsonData.windows ? new BaseTaskConfiguration(jsonData.windows) : null;
    }

    getTasks() {
        return this.tasks;
    }

    setTasks(tasks) {
        this.tasks = tasks;
    }

    addTask(task) {
        if (task instanceof TaskDescription) {
            this.tasks.push(task);
        } else {
            console.error('addTask expects a TaskDescription instance.');
        }
    }

    importTasks(jsonData) {
        Object.assign(this, new BaseTaskConfiguration(jsonData));
    }

    exportTasks() {
        // Convert instances back to plain objects
        const replacer = (key, value) => {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                const obj = {};
                for (let k in value) {
                    if (value.hasOwnProperty(k) && typeof value[k] !== 'function') {
                        obj[k] = value[k];
                    }
                }
                return obj;
            }
            return value;
        };
        return JSON.stringify(this, replacer, 2);
    }

    async validate() {
        const schemaUrl = 'https://json.schemastore.org/task.json';
        const response = await fetch(schemaUrl);
        const schema = await response.json();

        // Use the global Ajv
        const ajv = new Ajv();
        const validate = ajv.compile(schema);

        const data = JSON.parse(this.exportTasks());

        const valid = validate(data);
        if (!valid) {
            console.error('Validation errors:', validate.errors);
        } else {
            console.log('Validation successful.');
        }
        return { valid, errors: validate.errors };
    }

}
