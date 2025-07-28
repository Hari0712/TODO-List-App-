const categories = [
  { title: "Personal", img: "boy.png" },
  { title: "Work", img: "briefcase.png" },
  { title: "Shopping", img: "shopping.png" },
  { title: "Coding", img: "web-design.png" },
  { title: "Health", img: "healthcare.png" },
  { title: "Fitness", img: "dumbbell.png" },
  { title: "Education", img: "education.png" },
  { title: "Finance", img: "saving.png" },
];

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const elements = {
  wrapper: document.querySelector(".wrapper"),
  categoriesContainer: document.querySelector(".categories"),
  tasksContainer: document.querySelector(".tasks"),
  totalTasks: document.getElementById("total-tasks"),
  categoryTitle: document.getElementById("category-title"),
  categoryImg: document.getElementById("category-img"),
  numTasks: document.getElementById("num-tasks"),
  taskInput: document.getElementById("task-input"),
  categorySelect: document.getElementById("category-select"),
  addBtn: document.querySelector(".add-btn"),
  cancelBtn: document.querySelector(".cancel-btn"),
  blackBackdrop: document.querySelector(".black-backdrop"),
  addTaskBtn: document.querySelector(".add-task-btn"),
  addTaskWrapper: document.querySelector(".add-task"),
  menuBtn: document.querySelector(".menu-btn"),
  backBtn: document.querySelector(".back-btn"),
};

let selectedCategory = categories[0];

const saveTasks = () => localStorage.setItem("tasks", JSON.stringify(tasks));

const updateTotals = () => {
  const count = tasks.filter(t => t.category === selectedCategory.title).length;
  elements.totalTasks.textContent = tasks.length;
  elements.numTasks.textContent = `${count} task${count !== 1 ? 's' : ''}`;
};

const renderCategories = () => {
  elements.categoriesContainer.innerHTML = "";
  categories.forEach(category => {
    const count = tasks.filter(t => t.category === category.title).length;
    const div = document.createElement("div");
    div.classList.add("category");
    div.innerHTML = `
      <div class="left">
        <img src="images/${category.img}" alt="${category.title}" />
        <div class="content">
          <h1>${category.title}</h1>
          <p>${count} Tasks</p>
        </div>
      </div>
    `;
    div.onclick = () => {
      selectedCategory = category;
      elements.wrapper.classList.add("show-category");
      elements.categoryTitle.textContent = category.title;
      elements.categoryImg.src = `images/${category.img}`;
      renderTasks();
      updateTotals();
    };
    elements.categoriesContainer.appendChild(div);
  });
};

const renderTasks = () => {
  elements.tasksContainer.innerHTML = "";
  const filtered = tasks.filter(t => t.category === selectedCategory.title);

  if (filtered.length === 0) {
    elements.tasksContainer.innerHTML = `<p class="no-tasks">🎉 No tasks here. Add one!</p>`;
    return;
  }

  filtered.forEach(task => {
    const div = document.createElement("div");
    div.classList.add("task-wrapper");

    const label = document.createElement("label");
    label.classList.add("task");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    };

    label.appendChild(checkbox);
    label.innerHTML += `
      <span class="checkmark">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </span>
      <p>${task.task}</p>
    `;

    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("delete");
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
           viewBox="0 0 24 24" stroke-width="1.5"
           stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9M18.16 19.67a2.25 2.25 0 01-2.24 2.08H8.08a2.25 2.25 0 01-2.24-2.08L4.77 5.79" />
      </svg>
    `;
    deleteBtn.onclick = () => {
      tasks = tasks.filter(t => t !== task);
      saveTasks();
      renderTasks();
      renderCategories();
    };

    div.append(label, deleteBtn);
    elements.tasksContainer.appendChild(div);
  });
};

const toggleAddTaskForm = () => {
  elements.addTaskWrapper.classList.toggle("active");
  elements.blackBackdrop.classList.toggle("active");
  elements.addTaskBtn.classList.toggle("active");
};

const addTask = () => {
  const taskText = elements.taskInput.value.trim();
  const category = elements.categorySelect.value;

  if (!taskText) return alert("Please enter a task.");

  tasks.push({
    id: Date.now(),
    task: taskText,
    category: category,
    completed: false
  });

  elements.taskInput.value = "";
  saveTasks();
  toggleAddTaskForm();
  renderTasks();
  renderCategories();
  updateTotals();
};

const init = () => {
  // Fill category dropdown
  categories.forEach(c => {
    const option = document.createElement("option");
    option.value = c.title;
    option.textContent = c.title;
    elements.categorySelect.appendChild(option);
  });

  elements.menuBtn.onclick = () => elements.wrapper.classList.remove("show-category");
  elements.backBtn.onclick = () => elements.wrapper.classList.remove("show-category");
  elements.addTaskBtn.onclick = toggleAddTaskForm;
  elements.cancelBtn.onclick = toggleAddTaskForm;
  elements.blackBackdrop.onclick = toggleAddTaskForm;
  elements.addBtn.onclick = addTask;

  renderCategories();
  renderTasks();
  updateTotals();
};

init();
