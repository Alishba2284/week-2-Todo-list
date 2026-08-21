// =========================
// SELECT HTML ELEMENTS
// =========================

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const errorMessage = document.getElementById("errorMessage");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const themeToggle = document.getElementById("themeToggle");

const filterButtons = document.querySelectorAll(".filter-btn");


// =========================
// LOAD TASKS FROM LOCALSTORAGE
// =========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// =========================
// SAVE TASKS
// =========================

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// =========================
// RENDER TASKS
// =========================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;


    // Filter Tasks

    if (currentFilter === "pending") {

        filteredTasks = tasks.filter(function (task) {
            return task.completed === false;
        });

    } else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function (task) {
            return task.completed === true;
        });

    }


    // Empty Message

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }


    // Create Task Elements

    filteredTasks.forEach(function (task) {

        const li = document.createElement("li");

        li.classList.add("task-item");


        if (task.completed) {
            li.classList.add("completed");
        }


        // Checkbox

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = task.completed;


        checkbox.addEventListener("change", function () {

            task.completed = checkbox.checked;

            saveTasks();

            renderTasks();

            updateTaskStats();

        });


        // Task Text

        const taskText = document.createElement("span");

        taskText.classList.add("task-text");

        taskText.textContent = task.text;


        // Actions Container

        const actions = document.createElement("div");

        actions.classList.add("task-actions");


        // Edit Button

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.classList.add("edit-btn");


        editButton.addEventListener("click", function () {

            const newText = prompt(
                "Edit your task:",
                task.text
            );


            if (
                newText !== null &&
                newText.trim() !== ""
            ) {

                task.text = newText.trim();

                saveTasks();

                renderTasks();

            }

        });


        // Delete Button

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.classList.add("delete-btn");


        deleteButton.addEventListener("click", function () {

            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();

            renderTasks();

            updateTaskStats();

        });


        // Add Buttons

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        // Add Everything to Task

        li.appendChild(checkbox);

        li.appendChild(taskText);

        li.appendChild(actions);


        // Add Task to List

        taskList.appendChild(li);

    });

}


// =========================
// UPDATE TASK STATISTICS
// =========================

function updateTaskStats() {

    // Use map()

    const taskStatus = tasks.map(function (task) {
        return task.completed;
    });


    const total = taskStatus.length;


    const completed = taskStatus.filter(function (status) {
        return status === true;
    }).length;


    const pending = taskStatus.filter(function (status) {
        return status === false;
    }).length;


    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}


// =========================
// ADD NEW TASK
// =========================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const taskText = taskInput.value.trim();


    // Validation

    if (taskText === "") {

        errorMessage.textContent =
            "Please enter a task!";

        return;

    }


    // Clear Error Message

    errorMessage.textContent = "";


    // Create New Task Object

    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    // Add Task to Array

    tasks.push(newTask);


    // Save Tasks

    saveTasks();


    // Update Display

    renderTasks();

    updateTaskStats();


    // Clear Input

    taskInput.value = "";

});


// =========================
// FILTER TASKS
// =========================

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentFilter =
            button.dataset.filter;


        // Remove Active Class

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        // Add Active Class

        button.classList.add("active");


        renderTasks();

    });

});


// =========================
// DARK / LIGHT MODE
// =========================

function loadTheme() {

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeToggle.textContent =
            "☀️ Light Mode";

    }

}


themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");


    if (
        document.body.classList.contains(
            "dark-mode"
        )
    ) {

        localStorage.setItem(
            "theme",
            "dark"
        );

        themeToggle.textContent =
            "☀️ Light Mode";

    } else {

        localStorage.setItem(
            "theme",
            "light"
        );

        themeToggle.textContent =
            "🌙 Dark Mode";

    }

});


// =========================
// INITIALIZE APPLICATION
// =========================

loadTheme();

renderTasks();

updateTaskStats();