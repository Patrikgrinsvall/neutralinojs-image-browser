// CommandOptions.js
export default class CommandOptions {
    constructor(data = {}) {
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error('Invalid JSON string provided to CommandOptions constructor.');
          data = {};
        }
      }

      this.cwd = data.cwd || '';
      this.env = data.env || {};
      this.shell = data.shell || {};
    }

    // Getters and setters for each property
    get cwd() {
      return this._cwd;
    }
    set cwd(value) {
      this._cwd = value;
    }

    // ... Repeat for other properties
  }
