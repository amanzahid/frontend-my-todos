/*
    Tasks:
        1. Read and understand how to add import and export functionality and implement it.
        2. Explore how to add play background sounds with JS and add it on all operations
        3. Use a suitable Google font before uploading.
*/

const deadlineDateInpt = document.querySelector("#deadlineDate");
const todoPrioritySelect = document.querySelector("#todoPriority");
const todoTextArea = document.querySelector("#todoTextInpt");
const addTodoBtn = document.querySelector("#addTodo");
const todosListItems = document.querySelector(".todos-list__items");
const alertDiv = document.querySelector(".alert");
let dateTrimed = "";
document.addEventListener("DOMContentLoaded", () => {
  setMinDate();
  syncTodos();
});

addTodoBtn.addEventListener("click", () => {
  savetodoItem(
    deadlineDateInpt.value,
    todoPrioritySelect.value,
    todoTextArea.value
  );
  deadlineDateInpt.value = "";
  todoPrioritySelect.value = "";
  todoTextArea.value = "";
  syncTodos();

  addTodoBtn.blur();
});

function setMinDate() {
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  let dateMin = year + "-" + month + "-" + day;
  dateTrimed = dateMin;
  deadlineDate.setAttribute("min", dateMin);
}

function syncTodos() {
  todosListItems.innerHTML = "";
  let todosList = Store.getItem("todos");
  todosList.forEach((todo) => {
    let item = document.createElement("li");
    item.classList.add("todos-list__item");
    if (todo.status == "done") {
      item.classList.add("disabled");
    }
    item.setAttribute("data-id", todo.id);
    item.innerHTML = `<div class="todo-meta">
                                <p><span>Dated: </span>${todo.date}</p>
                                <p><span>Deadline: </span>${todo.deadline}</p>
                                <p><span>Priority: </span><span class="bg-${
                                  todo.priority == "low"
                                    ? "success"
                                    : todo.priority == "normal"
                                    ? "warning"
                                    : "danger"
                                }">${
      todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)
    }</span></p>
                                </div>
                                <hr>
                                <p>${todo.text}</p>
                                <hr>
                                <div class="btn-group">
                                    <button class="btn btn-danger" onclick=deleteTodo(${
                                      todo.id
                                    })><i class="fas fa-trash"></i></button>
                                    <button class="btn btn-success ${
                                      todo.status == "done" ? "hide" : ""
                                    }" onclick=markTodoDone(${
      todo.id
    })><i class="fas fa-check"></i></button>
                                <div>`;
    todosListItems.appendChild(item);
  });
}

function savetodoItem(deadline, priority, text) {
  if (deadline == "" || priority == "Set Priority" || text == "") {
    return showAlert("Fill all fields before saving");
  }
  let todosList = Store.getItem("todos");
  let id;
  if (todosList.length < 1) {
    id = 1;
  } else {
    id = +todosList[todosList.length - 1].id + 1;
  }
  let todo = {
    id: id,
    date: dateTrimed,
    deadline: deadline,
    priority: priority,
    text: text,
    status: "pending",
  };
  todosList.unshift(todo);
  Store.setItem("todos", todosList);
  showAlert("Saved Successfuly", "success");
}

function deleteTodo(id) {
  let todosList = Store.getItem("todos");
  let updateTodos = todosList.filter((todo) => todo.id != id);
  Store.setItem("todos", updateTodos);
  syncTodos();
  showAlert("Deleted Successfuly", "success");
}

function markTodoDone(id) {
  let todosList = Store.getItem("todos");
  let todoIndex = todosList.findIndex((item) => item.id == id);
  let todo = todosList.find((item) => item.id == id);
  if (todo) {
    todo.status = "done";
    todosList[todoIndex] = todo;
    Store.setItem("todos", todosList);
    syncTodos();
    showAlert("Marked Done Successfuly", "success");
  }
}

function showAlert(msg, type = "danger") {
  if (type == "danger") {
    alertDiv.classList.add("bg-danger");
  } else if (type == "warning") {
    alertDiv.classList.add("bg-warning");
  } else {
    alertDiv.classList.add("bg-success");
  }
  alertDiv.innerHTML = `<p>${msg}</p>`;
  alertDiv.classList.remove("hide");
  setTimeout(() => {
    alertDiv.className = "alert";
    alertDiv.classList.add("hide");
  }, 1500);
}