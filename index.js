// selectors:
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todoList");
const filterOption = document.querySelector(".filter-todos");

// Event Listener:
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", checkRemove);
filterOption.addEventListener("click", filterTodos);
document.addEventListener("DOMContentLoaded", getLocalTodos);

//Functions:
function addTodo(e) {
  e.preventDefault(); // its default action should not be taken as it normally would be.(refresh page)

  saveLocalTodos({
    id: new Date().getTime(),
    title: todoInput.value,
    isCompleted: false,
  });
  todoInput.value = "";
  getLocalTodos();
}

function checkRemove(e) {
  const classList = [...e.target.classList]; // convert DOM token list to array
  const item = e.target;
  const todoItem = item.parentElement.parentElement;
  const key = todoItem.getAttribute("key");
  const todo = { id: `${key}`, title: "", isCompleted: "" };

  if (classList[1] === "fa-check-square") {
    todoItem.classList.toggle("completed");
    const isCompleted = todoItem.getAttribute("class").includes("completed");
    todo.isCompleted = isCompleted;
    editLocalTodo(todo);
  } else if (classList[1] === "fa-trash-alt") {
    const todoItem = item.parentElement.parentElement;
    removeLocalTodos(todo);

    getLocalTodos();
  }
}
function filterTodos(e) {
  const todos = [...todoList.childNodes];
  todos.forEach((todo) => {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}
// Local Storage
function saveLocalTodos(todo) {
  //add todos to local storage
  let savedTodos = JSON.parse(localStorage.getItem("todos"));

  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
}

function getLocalTodos() {
  todoList.innerHTML = "";
  let savedTodos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : [];
  savedTodos.forEach((todo) => {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    if (todo.isCompleted) {
      todoDiv.classList.add("completed");
    }
    todoDiv.setAttribute("key", `${todo.id}`);

    const newTodo = `<li>${todo.title}</li>
        <span><i class="far fa-check-square"></i></span>
        <span><i class="far fa-trash-alt"></i></span>`;
    todoDiv.innerHTML = newTodo;
    // append to todo List
    todoList.appendChild(todoDiv);
  });
}

function removeLocalTodos(todo) {
  let savedTodos = JSON.parse(localStorage.getItem("todos"));

  const filterdTodos = savedTodos.filter((t) => t.id !== Number(todo.id));
  localStorage.setItem("todos", JSON.stringify(filterdTodos));
}

function editLocalTodo(todo) {
  const savedTodos = JSON.parse(localStorage.getItem("todos"));

  const index = savedTodos.findIndex((item) => item.id == todo.id);

  const selectedTodo = { ...savedTodos[index] };
  selectedTodo.isCompleted = todo.isCompleted;

  const updatedTodos = [...savedTodos];
  updatedTodos[index] = selectedTodo;

  localStorage.setItem("todos", JSON.stringify(updatedTodos));
}
