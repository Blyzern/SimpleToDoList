const body = document.querySelector("body");
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodo(todo, index) {
  const li = document.createElement("li");
  if (todo.completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = todo.text;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderList();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Rimuovi";
  deleteBtn.classList.add("remove-btn");
  deleteBtn.addEventListener("click", () => {
    const todoText = todos[index].text;

    const deleteDiv = document.createElement("div");
    deleteDiv.classList.add("remove-container");
    deleteDiv.addEventListener("click", (e) => {
      if (e.target === deleteDiv) {
        deleteDiv.remove();
      }
    });

    const confirmForm = document.createElement("form");
    confirmForm.classList.add("remove-form");

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("remove-btn-container");

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("confirm-delete-btn");
    closeBtn.textContent = "No";

    const confirmText = document.createElement("p");
    confirmText.classList.add("remove-text");
    confirmText.textContent = `Sei sicuro di voler rimuovere: "${todoText}"?`;

    const confirmYes = document.createElement("button");
    confirmYes.classList.add("confirm-delete-btn");
    confirmYes.type = "submit";
    confirmYes.textContent = "Sì";

    body.appendChild(deleteDiv);
    deleteDiv.appendChild(confirmForm);
    confirmForm.appendChild(confirmText);
    confirmForm.appendChild(btnContainer);
    btnContainer.appendChild(confirmYes);
    btnContainer.appendChild(closeBtn);

    confirmYes.addEventListener("click", (e) => {
      e.preventDefault();
      todos.splice(index, 1);
      saveTodos();
      renderList();
      deleteDiv.remove();
    });
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      deleteDiv.remove();
    });
    // todos.splice(index, 1);
    // saveTodos();
    // renderList();
  });

  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("actions");
  actionsDiv.appendChild(checkbox);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actionsDiv);
  list.appendChild(li);
}

function renderList() {
  list.innerHTML = "";
  todos.forEach((todo, index) => renderTodo(todo, index));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text !== "") {
    todos.push({ text, completed: false });
    input.value = "";
    saveTodos();
    renderList();
  }
});

renderList();
