// todo comment
// ? blue
// ! red
// * green

let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

const btnAdd = document.querySelector(".btn");
const btnDeleteAll = document.getElementById("btnDeleteAll");
const btnSave = document.getElementById("btnSave");
const btnLoad = document.getElementById("btnLoad");

document.addEventListener("DOMContentLoaded", function () {
  btnAdd.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });

  btnDeleteAll.addEventListener("click", deleteAllTasks);
  btnSave.addEventListener("click", saveTasks);
  btnLoad.addEventListener("change", loadlist)
  displayTasks();
});

function addTask() {
  const newTask = todoInput.value.trim();

  if (newTask != "") {
    todo.push({
      text: newTask,
      disabled: false,
    });
  }

  saveToLocalStorage();
  todoInput.value = "";
  displayTasks();
}

function displayTasks() {
  todoList.innerHTML = "";

  todo.forEach((item, index) => {
    const p = document.createElement("p");

    p.innerHTML = `
        <div class="todo-container">
            <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
      item.disabled ? "checked" : ""
    }>
            <p id="todo-${index}" class="${
      item.disabled ? "disabled" : ""
    }" onclick="editTask(${index})">${item.text}</p>
            <button class="todo-deletebox" id="delete-${index}">&times;</button>
        </div>
        `;

    p.querySelector(".todo-checkbox").addEventListener("change", () => {
      toggleTask(index);
    });

    p.querySelector(".todo-deletebox").addEventListener("click", () => {
      deleteTask(index);
    });

    todoList.appendChild(p);
  });
}

function deleteTask(index) {
  todo.splice(index, 1);
  saveToLocalStorage();
  displayTasks();
}

function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");

  inputElement.value = existingText;
  todoItem.replaceWith(inputElement);

  inputElement.focus();

  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim();

    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
    }
    displayTasks();
  });
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
  displayTasks();
}

function deleteAllTasks() {
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

function saveTasks(){ // https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
    const jsonData = JSON.stringify(todo, null, 2);
    const blob = new Blob ([jsonData], { type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todo-list.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function loadlist() {
    todo = [];
    saveToLocalStorage();

    const file = document.getElementById('btnLoad').files[0]; 
    const reader = new FileReader();

    reader.onload = function(e) {
        const content = e.target.result;
        todo = JSON.parse(content);

        console.log(todo);
        todo.forEach(item => {
            console.log(item);
        })
        displayTasks();
    };

    reader.readAsText(file);
}
