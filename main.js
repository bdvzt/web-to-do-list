// todo comment
// ? blue
// ! red
// * green

let todo = [];

const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

const btnAdd = document.querySelector(".btn");
// const btnDeleteAll = document.getElementById("btnDeleteAll");
// const btnSave = document.getElementById("btnSave");
// const btnLoad = document.getElementById("btnLoad");


document.addEventListener("DOMContentLoaded", function () {
  btnAdd.addEventListener("click", addTask);

  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });

  // btnDeleteAll.addEventListener("click", deleteAllTasks);
  // btnSave.addEventListener("click", saveTasks);
  // btnLoad.addEventListener("change", loadlist)

  fetchTasks()
});

async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:5222/api/Task/GET', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const tasks = await response.json();
      console.log(tasks);

      // Приведение задачи к необходимой структуре
      todo = tasks.map(task => {
        return {
          id: task.id,
          text: task.description,
          status: task.status
        };
      });

      console.log(todo);

      displayTasks(); // Отображаем задачи на интерфейсе
    } else {
      console.error('Error fetching tasks:', response.statusText);
      alert("Failed to fetch tasks from the server.");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("An error occurred while fetching tasks.");
  }
}

async function addTask() {
  const taskText = todoInput.value.trim();
  if (taskText !== "") {
    try {
      const response = await fetch('http://localhost:5222/api/Task/POST', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: taskText, status: false })
      });

      if (response.ok) {
        const newTask = await response.json();
        todo.push({
          text: newTask.description,
          disabled: newTask.status
        });
        todoInput.value = "";
        displayTasks(); 
      } else {
        console.error('Error adding task:', response.statusText);
        alert("Failed to add task to the server.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred while adding a task.");
    }
  }
}

function displayTasks() {
  todoList.innerHTML = ""; 

  if (todo.length === 0) {
    return; 
  }

  todo.forEach((item) => {
    const p = document.createElement("p");
    p.innerHTML =
      '<div class="todo-container">' +
      '<input type="checkbox" class="todo-checkbox" id="input-' + item.id + '" ' + (item.status ? "checked" : "") + '>' +
      '<p id="todo-' + item.id + '" class="' + (item.status ? "false" : "") + '">' + item.text + '</p>' +
      '<button class="todo-deletebox" id="delete-' + item.id + '">&times;</button>' +
      '</div>';

    p.querySelector(".todo-checkbox").addEventListener("change", () => {
      toggleTask(item.id);
    });

    p.querySelector(".todo-deletebox").addEventListener("click", () => {
      deleteTask(item.id);
    });

    p.querySelector("#todo-" + item.id).addEventListener("click", () => {
      editTask(item.id);
    });

    todoList.appendChild(p);
  });
}

async function editTask(id){
  const task = todo.find(t=> t.id === id);

  const newDescription = prompt("Введите новое описание для задачи:", task.description);

  if (newDescription!=null){
    try{
      const response = await fetch('http://localhost:5222/api/Task/UPDATE', {
        method: 'PATCH',
        headers:{
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          Id: task.id,
          Description: newDescription
        })
      });

    if (response.ok) {
              task.text= newDescription;
              displayTasks(); 
              console.log(todo);
          } else {
            alert("увы.");
          }
      } catch (error) {
        alert("увы.");
      }
  } else {
    alert("увы.");
  }
}

async function deleteTask(id) {
  const task = todo.find(t => t.id === id); 

  if (task) {
      try {
          const response = await fetch('http://localhost:5222/api/Task/DELETE', {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  Id: task.id 
              })
          });

          if (response.ok) {
              todo = todo.filter(t => t.id !== id);
              displayTasks(); 
          } else {
            alert("увы.");
          }
      } catch (error) {
        alert("увы.");
      }
  } else {
    alert("увы.");
  }
}

async function toggleTask(id) {
  const task = todo.find(t => t.id === id); 
  if (task) {
      task.status = !task.status; 

      try {
          const response = await fetch('http://localhost:5222/api/Task/COMPLETED', {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  Id: task.id,                
                  Status: task.status         
              })
          });

          if (response.ok) {
              displayTasks(); 
          } else {
              alert("увы.");
          }
      } catch (error) {
          alert("увы.");
      }
  } else {
      console.error('Task not found for toggling:', id); 
  }
}

/*
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
*/
