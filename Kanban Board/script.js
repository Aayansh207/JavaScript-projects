to_do = []
in_progress = []
done = []

const button = document.querySelector('.add-button');
const modal = document.querySelector('.modal-overlay');
const closeButton = document.querySelector('.close-modal');
button.addEventListener('click', () => {
    modal.classList.remove('hidden');
});
closeButton.addEventListener('click', () => {
    modal.classList.add('hidden');
});

const submitButton = document.querySelector('.submit-button');
submitButton.addEventListener('click', () => {
    const taskHead = document.querySelector('.task-head-input').value;
    const taskDesc = document.querySelector('.task-desc-input').value;
    addTask(taskHead, taskDesc);
    modal.classList.add('hidden');
});

function set() {
    localStorage.setItem('to_do', JSON.stringify(to_do));
    localStorage.setItem('in_progress', JSON.stringify(in_progress));
    localStorage.setItem('done', JSON.stringify(done));
}

function addTask(head, desc) {
    to_do.push({ head, desc });
    set();
    renderTasks();
}

function renderTasks() {
    const toDoContainer = document.querySelector('.todo .task-list');
    const inProgressContainer = document.querySelector('.in-progress .task-list');
    const doneContainer = document.querySelector('.done .task-list');
    toDoContainer.innerHTML = '';
    inProgressContainer.innerHTML = '';
    doneContainer.innerHTML = '';
    document.querySelector('.todo .task-count').textContent = to_do.length;
    document.querySelector('.in-progress .task-count').textContent = in_progress.length;
    document.querySelector('.done .task-count').textContent = done.length;
    to_do.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('tasks');
        taskElement.setAttribute('draggable', 'true');
        taskElement.setAttribute('data-list', 'to_do');
        taskElement.setAttribute('data-index', index);
        taskElement.innerHTML = `
            <p class="task-head">${task.head}</p>
            <p class="task-desc">${task.desc}</p>
            <button class="close-button" data-list="to_do" data-index="${index}">Delete</button>
        `;
        toDoContainer.appendChild(taskElement);
    });
    in_progress.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('tasks');
        taskElement.setAttribute('draggable', 'true');
        taskElement.setAttribute('data-list', 'in_progress');
        taskElement.setAttribute('data-index', index);
        taskElement.innerHTML = `
            <p class="task-head">${task.head}</p>
            <p class="task-desc">${task.desc}</p>
            <button class="close-button" data-list="in_progress" data-index="${index}">Delete</button>
        `;
        inProgressContainer.appendChild(taskElement);
    });
    done.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('tasks');
        taskElement.setAttribute('draggable', 'true');
        taskElement.setAttribute('data-list', 'done');
        taskElement.setAttribute('data-index', index);
        taskElement.innerHTML = `
            <p class="task-head">${task.head}</p>
            <p class="task-desc">${task.desc}</p>
            <button class="close-button" data-list="done" data-index="${index}">Delete</button>
        `;
        doneContainer.appendChild(taskElement);
    });
}

const mainContainer = document.querySelector('.container');
mainContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-button')) {
        const listName = e.target.getAttribute('data-list');
        const index = parseInt(e.target.getAttribute('data-index'));
        deleteTask(listName, index);
    }
});
mainContainer.addEventListener('dragstart', (e) => {
    e.target.classList.add('dragging');
    if (e.target.classList.contains('tasks')) {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            list: e.target.getAttribute('data-list'),
            index: parseInt(e.target.getAttribute('data-index'))
        }));
    }
});

mainContainer.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('tasks')) {
        e.target.classList.remove('dragging');
    }
});

mainContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    const targetColumn = e.target.closest('.column');
    targetColumn.classList.add('drag-over');
});

mainContainer.addEventListener('dragleave', (e) => {
    const targetColumn = e.target.closest('.column');
    if (targetColumn) {
        targetColumn.classList.remove('drag-over');
    }
});

mainContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    document.querySelectorAll('.column').forEach(col => {
        col.classList.remove('drag-over');
    });
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const targetColumn = e.target.closest('.column');
    if (targetColumn) {
        let targetList = '';
        if (targetColumn.dataset.list === 'to_do') targetList = 'to_do';
        else if (targetColumn.dataset.list === 'in_progress') targetList = 'in_progress';
        else if (targetColumn.dataset.list === 'done') targetList = 'done';
        if (targetList && targetList !== data.list) {
            moveTask(data.list, targetList, data.index);
        }
    }
});

function moveTask(fromList, toList, index) {
    let task;
    if (fromList === 'to_do') {
        task = to_do.splice(index, 1)[0];
    } else if (fromList === 'in_progress') {
        task = in_progress.splice(index, 1)[0];
    } else if (fromList === 'done') {
        task = done.splice(index, 1)[0];
    }
    if (toList === 'to_do') {
        to_do.push(task);
    } else if (toList === 'in_progress') {
        in_progress.push(task);
    } else if (toList === 'done') {
        done.push(task);
    }
    set();
    renderTasks();
}

function loadTasks() {
    const storedToDo = localStorage.getItem('to_do');
    if (storedToDo) {
        to_do = JSON.parse(storedToDo);
    }
    const storedInProgress = localStorage.getItem('in_progress');
    if (storedInProgress) {
        in_progress = JSON.parse(storedInProgress);
    }
    const storedDone = localStorage.getItem('done');
    if (storedDone) {
        done = JSON.parse(storedDone);
    }
}

function deleteTask(listName, index) {
    if (listName === 'to_do') {
        to_do.splice(index, 1);
    } else if (listName === 'in_progress') {
        in_progress.splice(index, 1);
    } else if (listName === 'done') {
        done.splice(index, 1);
    }
    set();
    renderTasks();
}

loadTasks();
renderTasks();