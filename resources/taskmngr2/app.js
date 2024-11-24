// app.js
import BaseTaskConfiguration from './BaseTaskConfiguration.js';
import TaskDescription from './TaskDescription.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  // Create instances of your classes
  let baseConfig = new BaseTaskConfiguration();

  // Function to render tasks
  function renderTasks() {
    app.innerHTML = ''; // Clear existing content

    // Global Configuration Fields
    const globalConfigDiv = document.createElement('div');
    globalConfigDiv.className = 'bg-white p-4 rounded shadow mb-4';

    const globalTitle = document.createElement('h2');
    globalTitle.textContent = 'Global Configuration';
    globalTitle.className = 'text-xl font-bold mb-4';
    globalConfigDiv.appendChild(globalTitle);

    // Type
    const typeLabel = document.createElement('label');
    typeLabel.textContent = 'Type:';
    typeLabel.className = 'block font-semibold';
    globalConfigDiv.appendChild(typeLabel);

    const typeSelect = document.createElement('select');
    typeSelect.className = 'border p-2 w-full mb-4';
    ['process', 'shell'].forEach(optionValue => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = optionValue;
      if (baseConfig.type === optionValue) {
        option.selected = true;
      }
      typeSelect.appendChild(option);
    });
    typeSelect.onchange = (e) => {
      baseConfig.type = e.target.value;
    };
    globalConfigDiv.appendChild(typeSelect);

    // Command
    const commandLabel = document.createElement('label');
    commandLabel.textContent = 'Command:';
    commandLabel.className = 'block font-semibold';
    globalConfigDiv.appendChild(commandLabel);

    const commandInput = document.createElement('input');
    commandInput.type = 'text';
    commandInput.value = baseConfig.command;
    commandInput.className = 'border p-2 w-full mb-4';
    commandInput.oninput = (e) => {
      baseConfig.command = e.target.value;
    };
    globalConfigDiv.appendChild(commandInput);

    // Args
    const argsLabel = document.createElement('label');
    argsLabel.textContent = 'Args (comma-separated):';
    argsLabel.className = 'block font-semibold';
    globalConfigDiv.appendChild(argsLabel);

    const argsInput = document.createElement('input');
    argsInput.type = 'text';
    argsInput.value = baseConfig.args.join(', ');
    argsInput.className = 'border p-2 w-full mb-4';
    argsInput.oninput = (e) => {
      baseConfig.args = e.target.value.split(',').map(arg => arg.trim());
    };
    globalConfigDiv.appendChild(argsInput);

    // Options (cwd, env)
    const optionsLabel = document.createElement('h3');
    optionsLabel.textContent = 'Options';
    optionsLabel.className = 'text-lg font-semibold mt-4 mb-2';
    globalConfigDiv.appendChild(optionsLabel);

    // CWD
    const cwdLabel = document.createElement('label');
    cwdLabel.textContent = 'Current Working Directory (cwd):';
    cwdLabel.className = 'block font-semibold';
    globalConfigDiv.appendChild(cwdLabel);

    const cwdInput = document.createElement('input');
    cwdInput.type = 'text';
    cwdInput.value = baseConfig.options.cwd;
    cwdInput.className = 'border p-2 w-full mb-4';
    cwdInput.oninput = (e) => {
      baseConfig.options.cwd = e.target.value;
    };
    globalConfigDiv.appendChild(cwdInput);

    // Env
    const envLabel = document.createElement('label');
    envLabel.textContent = 'Environment Variables (JSON):';
    envLabel.className = 'block font-semibold';
    globalConfigDiv.appendChild(envLabel);

    const envInput = document.createElement('textarea');
    envInput.value = JSON.stringify(baseConfig.options.env, null, 2);
    envInput.className = 'border p-2 w-full mb-4 h-24';
    envInput.oninput = (e) => {
      try {
        baseConfig.options.env = JSON.parse(e.target.value);
        envInput.classList.remove('border-red-500');
      } catch (error) {
        envInput.classList.add('border-red-500');
      }
    };
    globalConfigDiv.appendChild(envInput);

    // Append global config to app
    app.appendChild(globalConfigDiv);

    // Tasks Section
    baseConfig.getTasks().forEach((task, index) => {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'bg-white p-4 rounded shadow mb-4';

      const taskTitle = document.createElement('h2');
      taskTitle.textContent = `Task ${index + 1}`;
      taskTitle.className = 'text-xl font-bold mb-4';
      taskDiv.appendChild(taskTitle);

      // Label
      const labelLabel = document.createElement('label');
      labelLabel.textContent = 'Label:';
      labelLabel.className = 'block font-semibold';
      taskDiv.appendChild(labelLabel);

      const labelInput = document.createElement('input');
      labelInput.type = 'text';
      labelInput.value = task.label;
      labelInput.className = 'border p-2 w-full mb-4';
      labelInput.oninput = (e) => {
        task.label = e.target.value;
      };
      taskDiv.appendChild(labelInput);

      // Type
      const taskTypeLabel = document.createElement('label');
      taskTypeLabel.textContent = 'Type:';
      taskTypeLabel.className = 'block font-semibold';
      taskDiv.appendChild(taskTypeLabel);

      const taskTypeSelect = document.createElement('select');
      taskTypeSelect.className = 'border p-2 w-full mb-4';
      ['process', 'shell'].forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        if (task.type === optionValue) {
          option.selected = true;
        }
        taskTypeSelect.appendChild(option);
      });
      taskTypeSelect.onchange = (e) => {
        task.type = e.target.value;
      };
      taskDiv.appendChild(taskTypeSelect);

      // Command
      const taskCommandLabel = document.createElement('label');
      taskCommandLabel.textContent = 'Command:';
      taskCommandLabel.className = 'block font-semibold';
      taskDiv.appendChild(taskCommandLabel);

      const taskCommandInput = document.createElement('input');
      taskCommandInput.type = 'text';
      taskCommandInput.value = task.command;
      taskCommandInput.className = 'border p-2 w-full mb-4';
      taskCommandInput.oninput = (e) => {
        task.command = e.target.value;
      };
      taskDiv.appendChild(taskCommandInput);

      // Args
      const taskArgsLabel = document.createElement('label');
      taskArgsLabel.textContent = 'Args (comma-separated):';
      taskArgsLabel.className = 'block font-semibold';
      taskDiv.appendChild(taskArgsLabel);

      const taskArgsInput = document.createElement('input');
      taskArgsInput.type = 'text';
      taskArgsInput.value = task.args.join(', ');
      taskArgsInput.className = 'border p-2 w-full mb-4';
      taskArgsInput.oninput = (e) => {
        task.args = e.target.value.split(',').map(arg => arg.trim());
      };
      taskDiv.appendChild(taskArgsInput);

      // Options (cwd, env)
      const taskOptionsLabel = document.createElement('h3');
      taskOptionsLabel.textContent = 'Options';
      taskOptionsLabel.className = 'text-lg font-semibold mt-4 mb-2';
      taskDiv.appendChild(taskOptionsLabel);

      // CWD
      const taskCwdLabel = document.createElement('label');
      taskCwdLabel.textContent = 'Current Working Directory (cwd):';
      taskCwdLabel.className = 'block font-semibold';
      taskDiv.appendChild(taskCwdLabel);

      const taskCwdInput = document.createElement('input');
      taskCwdInput.type = 'text';
      taskCwdInput.value = task.options.cwd;
      taskCwdInput.className = 'border p-2 w-full mb-4';
      taskCwdInput.oninput = (e) => {
        task.options.cwd = e.target.value;
      };
      taskDiv.appendChild(taskCwdInput);

      // Env
      const taskEnvLabel = document.createElement('label');
      taskEnvLabel.textContent = 'Environment Variables (JSON):';
      taskEnvLabel.className = 'block font-semibold';
      taskDiv.appendChild(taskEnvLabel);

      const taskEnvInput = document.createElement('textarea');
      taskEnvInput.value = JSON.stringify(task.options.env, null, 2);
      taskEnvInput.className = 'border p-2 w-full mb-4 h-24';
      taskEnvInput.oninput = (e) => {
        try {
          task.options.env = JSON.parse(e.target.value);
          taskEnvInput.classList.remove('border-red-500');
        } catch (error) {
          taskEnvInput.classList.add('border-red-500');
        }
      };
      taskDiv.appendChild(taskEnvInput);

      // Delete Task Button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete Task';
      deleteBtn.className = 'bg-red-500 text-white px-4 py-2 mt-2';
      deleteBtn.onclick = () => {
        baseConfig.tasks.splice(index, 1);
        renderTasks();
      };
      taskDiv.appendChild(deleteBtn);

      app.appendChild(taskDiv);
    });

    // Add Task Button
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Task';
    addBtn.className = 'bg-blue-500 text-white px-4 py-2';
    addBtn.onclick = () => {
      const newTask = new TaskDescription();
      baseConfig.addTask(newTask);
      renderTasks();
    };
    app.appendChild(addBtn);

    // Export Button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Tasks';
    exportBtn.className = 'bg-green-500 text-white px-4 py-2 ml-2';
    exportBtn.onclick = () => {
      const jsonOutput = baseConfig.exportTasks();
      const blob = new Blob([jsonOutput], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'tasks.json';
      a.click();
      URL.revokeObjectURL(url);
    };
    app.appendChild(exportBtn);

    // Validate Button
    const validateBtn = document.createElement('button');
    validateBtn.textContent = 'Validate Tasks';
    validateBtn.className = 'bg-yellow-500 text-white px-4 py-2 ml-2';
    validateBtn.onclick = async () => {
      const { valid, errors } = await baseConfig.validate();
      if (valid) {
        alert('Validation successful.');
      } else {
        alert('Validation failed. Check console for errors.');
      }
    };
    app.appendChild(validateBtn);

    // Import Section
    const importSection = document.createElement('div');
    importSection.className = 'mt-6';

    const jsonInputLabel = document.createElement('label');
    jsonInputLabel.textContent = 'Import tasks.json:';
    jsonInputLabel.className = 'block font-semibold';
    importSection.appendChild(jsonInputLabel);

    const jsonInput = document.createElement('textarea');
    jsonInput.id = 'jsonInput';
    jsonInput.className = 'w-full h-40 p-2 border mb-4';
    jsonInput.placeholder = 'Paste your tasks.json here';
    importSection.appendChild(jsonInput);

    const importBtn = document.createElement('button');
    importBtn.textContent = 'Import Tasks';
    importBtn.className = 'bg-indigo-500 text-white px-4 py-2';
    importBtn.onclick = () => {
      try {
        const jsonData = JSON.parse(jsonInput.value);
        baseConfig.importTasks(jsonData);
        renderTasks();
      } catch (e) {
        alert('Invalid JSON data');
      }
    };
    importSection.appendChild(importBtn);

    app.appendChild(importSection);
  }

  // Initial render
  renderTasks();
});
