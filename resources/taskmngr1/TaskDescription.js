// TaskDescription.js
export class TaskDescription {
    constructor({ label, command, type, args, options }) {
        this.label = label || "";
        this.command = command || "";
        this.type = type || "process";
        this.args = args || [];
        this.options = options || {};
    }

    getDetails() {
        return {
            label: this.label,
            command: this.command,
            type: this.type,
            args: this.args,
            options: this.options
        };
    }

    setDetails({ label, command, type, args, options }) {
        if (label !== undefined) this.label = label;
        if (command !== undefined) this.command = command;
        if (type !== undefined) this.type = type;
        if (args !== undefined) this.args = args;
        if (options !== undefined) this.options = options;
    }
}