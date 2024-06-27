let todoListCounter = 1;
let currentListId = null;

document.querySelector('.add-tab').addEventListener('click', function() {
    addNewTab();
});

document.querySelector('.close').addEventListener('click', function() {
    closeModal();
});

window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
});

document.getElementById('todo-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addTask();
});

function addNewTab() {
    const tabsContainer = document.querySelector('.tabs');
    const listsContainer = document.getElementById('lists-container');

    const tab = document.createElement('button');
    tab.classList.add('tab');
    tab.textContent = `투두리스트${todoListCounter}`;
    tab.setAttribute('data-list-id', `list${todoListCounter}`);
    tab.setAttribute('data-tab-id', `tab${todoListCounter}`);
    tab.addEventListener('click', function() {
        setActiveTab(tab);
    });

    const listContainer = document.createElement('div');
    listContainer.id = `list${todoListCounter}`;
    listContainer.classList.add('lists-container');
    listContainer.innerHTML = getTodoListTemplate(todoListCounter);

    tabsContainer.insertBefore(tab, tabsContainer.querySelector('.add-tab'));
    listsContainer.appendChild(listContainer);

    setActiveTab(tab);

    todoListCounter++;
}

function setActiveTab(activeTab) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.lists-container').forEach(list => list.style.display = 'none');

    activeTab.classList.add('active');
    document.getElementById(activeTab.getAttribute('data-list-id')).style.display = 'block';
    currentListId = activeTab.getAttribute('data-list-id');
}

function getTodoListTemplate(listId) {
    return `
        <div class="todo-header">
            <h2 contenteditable="true" oninput="updateTabName(${listId})">투두리스트${listId}</h2>
            <button class="add-task-btn" onclick="openModal(${listId})">+</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="todo-list${listId}"></tbody>
        </table>
    `;
}

function addTask() {
    const taskText = document.getElementById('todo-input').value;
    const dueDate = document.getElementById('due-date').value;
    const taskColor = document.getElementById('task-color').value;

    const task = {
        text: taskText,
        dueDate: dueDate,
        color: taskColor,
        addedDate: new Date().toISOString()
    };

    // Check if currentListId is correctly set
    if (currentListId) {
        const todoList = JSON.parse(localStorage.getItem(currentListId)) || [];
        todoList.push(task);
        localStorage.setItem(currentListId, JSON.stringify(todoList));
        displayTasks(currentListId);

        closeModal();
        document.getElementById('todo-form').reset();
    } else {
        console.error('currentListId is not set');
    }
}

function deleteTask(listId, index) {
    const todoList = JSON.parse(localStorage.getItem(listId)) || [];
    todoList.splice(index, 1);
    localStorage.setItem(listId, JSON.stringify(todoList));
    displayTasks(listId);
}

function displayTasks(listId) {
    const todoList = JSON.parse(localStorage.getItem(listId)) || [];
    todoList.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const todoListElement = document.getElementById(`todo-list${listId}`);
    todoListElement.innerHTML = '';

    todoList.forEach((task, index) => {
        const tr = document.createElement('tr');
        tr.style.backgroundColor = task.color;

        const taskTd = document.createElement('td');
        taskTd.textContent = task.text;

        const dueDateTd = document.createElement('td');
        dueDateTd.textContent = task.dueDate || 'No due date';

        const actionsTd = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(listId, index));
        actionsTd.appendChild(deleteBtn);

        tr.appendChild(taskTd);
        tr.appendChild(dueDateTd);
        tr.appendChild(actionsTd);

        todoListElement.appendChild(tr);
    });
}

function updateTabName(listId) {
    const listTitle = document.querySelector(`#list${listId} h2`).textContent;
    const tab = document.querySelector(`[data-list-id="list${listId}"]`);
    tab.textContent = listTitle;
}

function openModal(listId) {
    currentListId = `list${listId}`;
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.getElementById('todo-form').reset();
}

// Add the first default tab on page load
addNewTab();
