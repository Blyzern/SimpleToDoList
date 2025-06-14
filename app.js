// creare variabili per gli elementi del DOM
const body = document.querySelector("body");
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const completedList = document.getElementById("completed-list");
const completedListHeader = document.getElementById("completed-header");

// Inizializzare ToDO oppure settare un array vuoto se non esiste
let todos = [];
try {
  todos = JSON.parse(localStorage.getItem("todos")) || [];
} catch {
  // Se c'è un errore nel parsing, inizializza come array vuoto
  todos = [];
}

// Funzione per salvare i ToDo nell'archiviazione locale
const saveTodos = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const setVisibility = (e, visible) => {
  e.style.visibility = visible ? "visible" : "hidden";
  e.style.position = visible ? "relative" : "absolute";
};

// Funzione per mostrare o nascondere la lista dei ToDo completati
const completedCheck = () => {
  const bShouldShowCompleted = todos.some((todo) => todo.completed);
  setVisibility(completedList, bShouldShowCompleted);
  setVisibility(completedListHeader, bShouldShowCompleted);
  return bShouldShowCompleted;
};

// Controlla se la lista dei ToDo contiene elementi non completati
const isEmpty = () => {
  const bIsEmpty = todos.some((todo) => !todo.completed);
  return bIsEmpty;
};

const renderTodo = (todo, index) => {
  const currentTodo = todos[index];
  // Creare gli elementi per ogni ToDo
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = todo.text;

  // Aggiungere la classe "todo" per lo stile
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => {
    currentTodo.completed = !currentTodo.completed;
    saveTodos();
    renderList();
  });

  // Creare il pulsante per rimuovere il ToDo
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Rimuovi";
  deleteBtn.classList.add("remove-btn");
  deleteBtn.addEventListener("click", () => {
    const todoText = currentTodo.text;

    // Creare un div per la conferma di rimozione
    const deleteDiv = document.createElement("div");
    deleteDiv.classList.add("remove-container");
    deleteDiv.addEventListener("click", (e) => {
      if (e.target === deleteDiv) {
        deleteDiv.remove();
      }
    });

    // Creare un form per la conferma di rimozione
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

    // Aggiungere gli elementi al DOM
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
  });

  // Aggiungere gli elementi al ToDo
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("actions");
  actionsDiv.appendChild(checkbox);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actionsDiv);
  if (todo.completed) {
    li.classList.add("completed");
    completedList.appendChild(li);
    completedList.style.visibility = "visible";
    completedListHeader.style.visibility = "visible";
  } else {
    list.appendChild(li);
  }
};

// Funzione per renderizzare la lista dei ToDo
const renderList = () => {
  list.innerHTML = "";
  completedList.innerHTML = "";

  if (isEmpty()) {
    list.textContent = "Nessuna attività da completare.";
  }

  completedCheck();

  todos.forEach((todo, index) => renderTodo(todo, index));
};

// Aggiungere un evento al form per aggiungere un nuovo ToDo
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

// Inizializzare la lista dei ToDo al caricamento della pagina
renderList();
