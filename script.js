const menuButton = document.querySelector("[data-menu-toggle]");
if (menuButton) {
  menuButton.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-open");
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    document.body.classList.remove("sidebar-open");
  }
});

const taskManagerRoot = document.querySelector("[data-task-manager]");

if (taskManagerRoot) {
  const tasks = [
    {
      id: "TK-481",
      title: "Prepare equipment inspection brief",
      owner: "Maya Henderson",
      status: "In progress",
      priority: "Urgent",
      department: "Field Operations",
      dueDate: "2026-07-07 15:00",
      description: "Compile the complete inspection sequence, attach the required equipment checklist, and confirm that all crew members have acknowledged their assigned steps.",
      comments: [
        { author: "Maya Henderson", text: "Route notes were added for the north zone handoff." },
        { author: "Supervisor", text: "Due time moved forward after the first crew confirmed readiness." }
      ]
    },
    {
      id: "TK-474",
      title: "Validate equipment tags",
      owner: "Carlos Diaz",
      status: "Completed",
      priority: "Normal",
      department: "Warehouse",
      dueDate: "2026-07-07 08:00",
      description: "Check every outgoing unit for the latest asset tag and replace damaged labels before dispatch.",
      comments: [
        { author: "Carlos Diaz", text: "All scanner mismatches were corrected during the morning shift." }
      ]
    },
    {
      id: "TK-478",
      title: "Approve crew assignment",
      owner: "Naomi Lee",
      status: "Blocked",
      priority: "High",
      department: "Scheduling",
      dueDate: "2026-07-07 12:30",
      description: "Approve the final assignment list and resolve overlap with the maintenance rotation before field departure.",
      comments: [
        { author: "Naomi Lee", text: "Waiting for confirmation from the backup driver." }
      ]
    },
    {
      id: "TK-489",
      title: "Finalize post-inspection report",
      owner: "Julien Moreau",
      status: "Planned",
      priority: "Normal",
      department: "Compliance",
      dueDate: "2026-07-08 17:00",
      description: "Prepare the final inspection report package with attachments and approval notes after the job is closed.",
      comments: []
    },
    {
      id: "TK-492",
      title: "Restock emergency kits",
      owner: "Aisha Patel",
      status: "In progress",
      priority: "High",
      department: "Inventory",
      dueDate: "2026-07-07 18:30",
      description: "Review emergency kit levels, replace missing consumables, and log the replenishment in the storage register.",
      comments: [
        { author: "Aisha Patel", text: "Two kits still need replacement flashlights." }
      ]
    },
    {
      id: "TK-496",
      title: "Update weather risk summary",
      owner: "Blau Bloom",
      status: "Planned",
      priority: "Low",
      department: "Operations",
      dueDate: "2026-07-08 09:15",
      description: "Refresh the daily weather summary and note any site-specific warnings for tomorrow's teams.",
      comments: []
    }
  ];

  const state = {
    selectedTaskId: tasks[0]?.id || null,
    editingTaskId: null,
    filters: {
      owner: "all",
      status: "all",
      priority: "all",
      hideCompleted: false
    }
  };

  const elements = {
    taskList: taskManagerRoot.querySelector("[data-task-list]"),
    taskDetailPanel: taskManagerRoot.querySelector("[data-task-detail-panel]"),
    emptyState: taskManagerRoot.querySelector("[data-empty-state]"),
    ownerFilter: taskManagerRoot.querySelector("[data-filter-owner]"),
    statusFilter: taskManagerRoot.querySelector("[data-filter-status]"),
    priorityFilter: taskManagerRoot.querySelector("[data-filter-priority]"),
    hideCompletedFilter: taskManagerRoot.querySelector("[data-filter-hide-completed]"),
    resetFiltersButton: taskManagerRoot.querySelector("[data-reset-filters]"),
    openModalButtons: document.querySelectorAll("[data-open-task-modal]"),
    closeModalButtons: document.querySelectorAll("[data-close-task-modal]"),
    modal: document.querySelector("[data-task-modal]"),
    modalTitle: document.querySelector("[data-modal-title]"),
    form: document.querySelector("[data-task-form]"),
    visibleMetric: taskManagerRoot.querySelector("[data-metric-visible]"),
    progressMetric: taskManagerRoot.querySelector("[data-metric-progress]"),
    blockedMetric: taskManagerRoot.querySelector("[data-metric-blocked]"),
    completedMetric: taskManagerRoot.querySelector("[data-metric-completed]"),
    lastUpdated: taskManagerRoot.querySelector("[data-last-updated]")
  };

  const pillClassMap = {
    Planned: "blue",
    "In progress": "orange",
    Blocked: "red",
    Completed: "green",
    Low: "gray",
    Normal: "blue",
    High: "orange",
    Urgent: "red"
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setLastUpdated() {
    const now = new Date();
    const datePart = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(now);
    const timePart = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(now);
    elements.lastUpdated.textContent = `Last updated - ${datePart} ${timePart}`;
  }

  function getUniqueValues(key) {
    return [...new Set(tasks.map((task) => task[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function renderFilterOptions(select, values, placeholder) {
    const currentValue = select.value || "all";
    select.innerHTML = [`<option value="all">${placeholder}</option>`]
      .concat(values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`))
      .join("");
    select.value = values.includes(currentValue) ? currentValue : "all";
  }

  function getFilteredTasks() {
    return tasks.filter((task) => {
      if (state.filters.owner !== "all" && task.owner !== state.filters.owner) {
        return false;
      }
      if (state.filters.status !== "all" && task.status !== state.filters.status) {
        return false;
      }
      if (state.filters.priority !== "all" && task.priority !== state.filters.priority) {
        return false;
      }
      if (state.filters.hideCompleted && task.status === "Completed") {
        return false;
      }
      return true;
    });
  }

  function getSelectedTask(filteredTasks) {
    const selected = filteredTasks.find((task) => task.id === state.selectedTaskId);
    return selected || filteredTasks[0] || null;
  }

  function renderMetrics(filteredTasks) {
    elements.visibleMetric.textContent = String(filteredTasks.length);
    elements.progressMetric.textContent = String(tasks.filter((task) => task.status === "In progress").length);
    elements.blockedMetric.textContent = String(tasks.filter((task) => task.status === "Blocked").length);
    elements.completedMetric.textContent = String(tasks.filter((task) => task.status === "Completed").length);
  }

  function renderTaskList(filteredTasks) {
    if (!filteredTasks.length) {
      elements.taskList.innerHTML = "";
      elements.emptyState.hidden = false;
      return;
    }

    elements.emptyState.hidden = true;
    elements.taskList.innerHTML = filteredTasks.map((task) => {
      const isActive = task.id === state.selectedTaskId;
      return `
        <article class="task-list-card ${isActive ? "active" : ""}" data-task-id="${escapeHtml(task.id)}">
          <div class="task-card-top">
            <div>
              <strong>${escapeHtml(task.title)}</strong>
              <span>${escapeHtml(task.id)} - ${escapeHtml(task.department || "No department")}</span>
            </div>
            <span class="pill ${pillClassMap[task.priority] || "gray"}">${escapeHtml(task.priority)}</span>
          </div>
          <div class="task-card-meta">
            <span>Owner: ${escapeHtml(task.owner)}</span>
            <span>Due: ${escapeHtml(task.dueDate || "No due date")}</span>
          </div>
          <div class="task-card-bottom">
            <span class="pill ${pillClassMap[task.status] || "gray"}">${escapeHtml(task.status)}</span>
            <div class="task-card-actions">
              <button class="button button-ghost mini-button" type="button" data-select-task="${escapeHtml(task.id)}">View</button>
              <button class="button mini-button" type="button" data-edit-task="${escapeHtml(task.id)}">Edit</button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderTaskDetail(task) {
    if (!task) {
      elements.taskDetailPanel.innerHTML = `
        <div class="card-header">
          <div>
            <h2 class="card-title">Task details</h2>
            <p class="card-subtitle">Click any task from the list to view its latest information.</p>
          </div>
        </div>
        <div class="task-detail-empty">
          <strong>No task selected yet.</strong>
          <span>Pick a task from the list to preview its description, comments, and assignment details.</span>
        </div>
      `;
      return;
    }

    const commentsMarkup = task.comments.length
      ? task.comments.map((comment) => `
          <div class="comment-card">
            <span>${escapeHtml(comment.author)}</span>
            <p>${escapeHtml(comment.text)}</p>
          </div>
        `).join("")
      : `<div class="comment-card"><span>No comments yet</span><p>Add comments when editing the task to capture updates or handoff notes.</p></div>`;

    elements.taskDetailPanel.innerHTML = `
      <div class="task-detail-grid">
        <div class="task-detail-summary">
          <div>
            <h3>${escapeHtml(task.title)}</h3>
            <p>${escapeHtml(task.description)}</p>
          </div>
          <div class="task-card-actions">
            <button class="button" type="button" data-edit-task="${escapeHtml(task.id)}">Edit task</button>
          </div>
        </div>
        <div class="detail-metadata">
          <div class="meta-box"><span>Task ID</span><strong>${escapeHtml(task.id)}</strong></div>
          <div class="meta-box"><span>Owner</span><strong>${escapeHtml(task.owner)}</strong></div>
          <div class="meta-box"><span>Status</span><strong>${escapeHtml(task.status)}</strong></div>
          <div class="meta-box"><span>Priority</span><strong>${escapeHtml(task.priority)}</strong></div>
          <div class="meta-box"><span>Department</span><strong>${escapeHtml(task.department || "Not set")}</strong></div>
          <div class="meta-box"><span>Due date</span><strong>${escapeHtml(task.dueDate || "Not set")}</strong></div>
        </div>
        <div>
          <div class="card-header">
            <div>
              <h2 class="card-title">Comments</h2>
              <p class="card-subtitle">Editable notes for the team working on this task.</p>
            </div>
          </div>
          <div class="comment-list">${commentsMarkup}</div>
        </div>
      </div>
    `;
  }

  function renderAll() {
    renderFilterOptions(elements.ownerFilter, getUniqueValues("owner"), "All owners");
    renderFilterOptions(elements.statusFilter, getUniqueValues("status"), "All statuses");
    renderFilterOptions(elements.priorityFilter, getUniqueValues("priority"), "All priorities");

    elements.ownerFilter.value = state.filters.owner;
    elements.statusFilter.value = state.filters.status;
    elements.priorityFilter.value = state.filters.priority;
    elements.hideCompletedFilter.checked = state.filters.hideCompleted;

    const filteredTasks = getFilteredTasks();
    const selectedTask = getSelectedTask(filteredTasks);
    state.selectedTaskId = selectedTask ? selectedTask.id : null;

    renderMetrics(filteredTasks);
    renderTaskList(filteredTasks);
    renderTaskDetail(selectedTask);
    setLastUpdated();
  }

  function resetForm() {
    elements.form.reset();
    elements.form.elements.id.value = "";
    elements.form.elements.status.value = "Planned";
    elements.form.elements.priority.value = "Normal";
    state.editingTaskId = null;
  }

  function openModal(taskId = null) {
    resetForm();

    if (taskId) {
      const task = tasks.find((item) => item.id === taskId);
      if (!task) {
        return;
      }

      state.editingTaskId = task.id;
      elements.modalTitle.textContent = `Edit ${task.id}`;
      elements.form.elements.id.value = task.id;
      elements.form.elements.title.value = task.title;
      elements.form.elements.owner.value = task.owner;
      elements.form.elements.status.value = task.status;
      elements.form.elements.priority.value = task.priority;
      elements.form.elements.department.value = task.department || "";
      elements.form.elements.dueDate.value = task.dueDate || "";
      elements.form.elements.description.value = task.description;
      elements.form.elements.comments.value = task.comments.map((comment) => comment.text).join("\n");
    } else {
      elements.modalTitle.textContent = "Create task";
    }

    elements.modal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    elements.modal.hidden = true;
    document.body.classList.remove("modal-open");
    resetForm();
  }

  function createTaskId() {
    const maxNumber = tasks.reduce((max, task) => {
      const numericPart = Number(task.id.replace("TK-", ""));
      return Number.isFinite(numericPart) ? Math.max(max, numericPart) : max;
    }, 500);
    return `TK-${maxNumber + 1}`;
  }

  function saveTask(formData) {
    const comments = formData.get("comments")
      .split(/\r?\n/)
      .map((comment) => comment.trim())
      .filter(Boolean)
      .map((comment) => ({
        author: formData.get("owner").trim() || "Team note",
        text: comment
      }));

    const payload = {
      id: state.editingTaskId || createTaskId(),
      title: formData.get("title").trim(),
      owner: formData.get("owner").trim(),
      status: formData.get("status"),
      priority: formData.get("priority"),
      department: formData.get("department").trim(),
      dueDate: formData.get("dueDate").trim(),
      description: formData.get("description").trim(),
      comments
    };

    if (state.editingTaskId) {
      const index = tasks.findIndex((task) => task.id === state.editingTaskId);
      if (index >= 0) {
        tasks[index] = payload;
      }
      state.selectedTaskId = state.editingTaskId;
    } else {
      tasks.unshift(payload);
      state.selectedTaskId = payload.id;
    }

    closeModal();
    renderAll();
  }

  elements.ownerFilter.addEventListener("change", (event) => {
    state.filters.owner = event.target.value;
    renderAll();
  });

  elements.statusFilter.addEventListener("change", (event) => {
    state.filters.status = event.target.value;
    renderAll();
  });

  elements.priorityFilter.addEventListener("change", (event) => {
    state.filters.priority = event.target.value;
    renderAll();
  });

  elements.hideCompletedFilter.addEventListener("change", (event) => {
    state.filters.hideCompleted = event.target.checked;
    renderAll();
  });

  elements.resetFiltersButton.addEventListener("click", () => {
    state.filters = {
      owner: "all",
      status: "all",
      priority: "all",
      hideCompleted: false
    };
    renderAll();
  });

  elements.openModalButtons.forEach((button) => {
    button.addEventListener("click", () => openModal());
  });

  elements.closeModalButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  elements.modal.addEventListener("click", (event) => {
    if (event.target === elements.modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.modal.hidden) {
      closeModal();
    }
  });

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(elements.form);
    saveTask(formData);
  });

  document.addEventListener("click", (event) => {
    const selectTrigger = event.target.closest("[data-select-task]");
    if (selectTrigger) {
      state.selectedTaskId = selectTrigger.getAttribute("data-select-task");
      renderAll();
      return;
    }

    const taskCard = event.target.closest("[data-task-id]");
    if (taskCard && !event.target.closest("button")) {
      state.selectedTaskId = taskCard.getAttribute("data-task-id");
      renderAll();
      return;
    }

    const editTrigger = event.target.closest("[data-edit-task]");
    if (editTrigger) {
      openModal(editTrigger.getAttribute("data-edit-task"));
    }
  });

  renderAll();
}
