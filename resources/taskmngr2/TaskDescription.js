// TaskDescription.js
import CommandOptions from './CommandOptions.js';

export default class TaskDescription {
  constructor(data = {}) {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error('Invalid JSON string provided to TaskDescription constructor.');
        data = {};
      }
    }

    this.label = data.label || '';
    this.type = data.type || 'process';
    this.command = data.command || '';
    this.args = data.args || [];
    this.options = new CommandOptions(data.options || {});
    this.linux = data.linux ? new TaskDescription(data.linux) : null;
    this.windows = data.windows ? new TaskDescription(data.windows) : null;
  }

  // Getters and setters for each property
  get label() {
    return this._label;
  }
  set label(value) {
    this._label = value;
  }

  // ... Repeat for other properties
}
