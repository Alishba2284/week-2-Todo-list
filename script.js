// ==============================
// GET HTML ELEMENTS
// ==============================

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const taskList = document.getElementById("taskList");

const errorMessage = document.getElementById("errorMessage");

const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");

const completedTasks = document.getElementById("completedTasks");

const pendingTasks = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

const themeToggle = document.getElementById("themeToggle");


// ==============================
// LOAD TASKS FROM LOCALSTORAGE
// ==============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Default filter

let currentFilter = "all";


// ==============================
// LOAD SAVED THEME
// ==============================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeToggle.textContent = "☀️ Light Mode";

}


// ==============================
// ADD NEW TASK
// ==============================

taskForm.addEventListener("submit", function (event) {

    // Prevent page refresh

    event.preventDefault();


    // Get task text

    const taskText = taskInput.value.trim();


    // Validate empty task

    if (taskText === "") {

        errorMessage.textContent =
            "Please enter a task before adding.";

        return;

    }


    // Clear error message

    errorMessage.textContent = "";


    // Create new task

    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    // Add task

    tasks.push(newTask);


    // Save tasks

    saveTasks();


    // Clear input

    taskInput.value = "";


    // Display tasks

    renderTasks();

});


// ==============================
// SAVE TASKS
// ==============================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ==============================
// DISPLAY TASKS
// ==============================

function renderTasks() {


    // Clear task list

    taskList.innerHTML = "";


    // Start with all tasks

    let filteredTasks = tasks;


    // Pending filter

    if (currentFilter === "pending") {

        filteredTasks = tasks.filter(function (task) {

            return task.completed === false;

        });

    }


    // Completed filter

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function (task) {

            return task.completed === true;

        });

    }


    // ==============================
    // EMPTY STATE
    // ==============================

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    // ==============================
    // CREATE TASK ITEMS
    // ==============================

    filteredTasks.forEach(function (task) {


        // Create task item

        const li = document.createElement("li");

        li.classList.add("task-item");


        // Add completed class

        if (task.completed === true) {

            li.classList.add("completed");

        }


        // ==============================
        // CHECKBOX
        // ==============================

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = task.completed;


        checkbox.addEventListener("change", function () {

            task.completed = checkbox.checked;

            saveTasks();

            renderTasks();

        });


        // ==============================
        // TASK TEXT
        // ==============================

        const taskText = document.createElement("span");

        taskText.classList.add("task-text");

        taskText.textContent = task.text;


        // ==============================
        // ACTION BUTTONS
        // ==============================

        const actions = document.createElement("div");

        actions.classList.add("task-actions");


        // Edit button

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.classList.add("edit-btn");


        editButton.addEventListener("click", function () {

            const updatedTask = prompt(
                "Edit your task:",
                task.text
            );


            if (
                updatedTask !== null &&
                updatedTask.trim() !== ""
            ) {

                task.text = updatedTask.trim();

                saveTasks();

                renderTasks();

            }

        });


        // Delete button

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.classList.add("delete-btn");


        deleteButton.addEventListener("click", function () {

            tasks = tasks.filter(function (item) {

                return item.id !== task.id;

            });

            saveTasks();

            renderTasks();

        });


        // Add buttons

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        // Add elements

        li.appendChild(checkbox);

        li.appendChild(taskText);

        li.appendChild(actions);


        // Add task to list

        taskList.appendChild(li);

    });


    // Update statistics

    updateTaskStats();

}


// ==============================
// UPDATE TASK STATISTICS
// ==============================

function updateTaskStats() {

    const total = tasks.length;


    const completed = tasks.filter(function (task) {

        return task.completed === true;

    }).length;


    const pending = tasks.filter(function (task) {

        return task.completed === false;

    }).length;


    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}


// ==============================
// FILTER TASKS
// ==============================

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Remove active class

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        // Add active class

        button.classList.add("active");


        // Change filter

        currentFilter = button.dataset.filter;


        // Display tasks

        renderTasks();

    });

});


// ==============================
// DARK / LIGHT MODE
// ==============================

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");


    // Check current theme

    if (document.body.classList.contains("dark-mode")) {

        // Save dark theme

        localStorage.setItem("theme", "dark");

        // Change button text

        themeToggle.textContent = "☀️ Light Mode";

    } else {

        // Save light theme

        localStorage.setItem("theme", "light");

        // Change button text

        themeToggle.textContent = "🌙 Dark Mode";

    }

});


// ==============================
// INITIAL DISPLAY
// ==============================

renderTasks();