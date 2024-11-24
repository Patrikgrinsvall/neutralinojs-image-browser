// BaseTaskConfiguration.js



// UI Integration
import { BaseTaskConfiguration } from "./BaseTaskConfiguration.js";

const config = new BaseTaskConfiguration('{}');

function createTaskInputFields(task) {
    return `
        <div class="task-item border rounded p-4 mb-4">
            <input type="text" value="${task.label || ''}" placeholder="Task Label" class="task-label border p-2 rounded w-full" />
            <input type="text" value="${task.command || ''}" placeholder="Command" class="task-command border p-2 rounded w-full" />
            <select class="task-type border p-2 rounded w-full">
                <option value="process" ${task.type === 'process' ? 'selected' : ''}>Process</option>
                <option value="shell" ${task.type === 'shell' ? 'selected' : ''}>Shell</option>
            </select>
            <textarea placeholder="Args (comma separated)" class="task-args border p-2 rounded w-full">${task.args.join(', ')}</textarea>
            <button class="delete-task bg-red-500 text-white rounded px-4 py-2">Delete</button>
        </div>
    `;
}

function renderTasks(tasks) {
    const taskListContainer = document.getElementById("task-list");
    taskListContainer.innerHTML = tasks.map(createTaskInputFields).join('');

    taskListContainer.querySelectorAll('.delete-task').forEach((button, index) => {
        button.addEventListener('click', () => {
            config.tasks.splice(index, 1);
            renderTasks(config.tasks);
        });
    });
}

document.getElementById('add-task').addEventListener('click', () => {
    config.addTask(new TaskDescription({ label: "", command: "", type: "process", args: [] }));
    renderTasks(config.tasks);
});

document.getElementById('export-json').addEventListener('click', () => {
    alert(config.exportJson());
});

renderTasks(config.getTasks());
