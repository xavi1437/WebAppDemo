const menuButton = document.querySelector("[data-menu-toggle]");
const sidebar = document.querySelector(".sidebar");
const sidebarScrim = document.querySelector("[data-sidebar-scrim]");
const navLinks = document.querySelectorAll(".sidebar .nav-link");

function closeSidebar() {
  document.body.classList.remove("sidebar-open");
  if (sidebarScrim) {
    sidebarScrim.hidden = true;
  }
}

function openSidebar() {
  document.body.classList.add("sidebar-open");
  if (sidebarScrim) {
    sidebarScrim.hidden = false;
  }
}

if (menuButton) {
  menuButton.addEventListener("click", () => {
    if (document.body.classList.contains("sidebar-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

if (sidebarScrim) {
  sidebarScrim.addEventListener("click", closeSidebar);
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 980) {
      closeSidebar();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("sidebar-open")) {
    closeSidebar();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    closeSidebar();
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
      dueDate: "2026-07-07",
      description: "Compile the complete inspection sequence, attach the required equipment checklist, and confirm that all crew members have acknowledged their assigned steps.",
      history: [
        { type: "system", author: "TaskFlow", text: "Task created and assigned to Maya Henderson.", timestamp: "2026-07-07T08:45:00" },
        { type: "comment", author: "Maya Henderson", text: "Route notes were added for the north zone handoff.", timestamp: "2026-07-07T11:00:00" },
        { type: "system", author: "Supervisor", text: "Due date changed from 2026-07-08 to 2026-07-07.", timestamp: "2026-07-07T09:30:00" }
      ]
    },
    {
      id: "TK-474",
      title: "Validate equipment tags",
      owner: "Carlos Diaz",
      status: "Completed",
      priority: "Normal",
      department: "Warehouse",
      dueDate: "2026-07-07",
      description: "Check every outgoing unit for the latest asset tag and replace damaged labels before dispatch.",
      history: [
        { type: "system", author: "TaskFlow", text: "Task created and assigned to Carlos Diaz.", timestamp: "2026-07-06T16:10:00" },
        { type: "comment", author: "Carlos Diaz", text: "All scanner mismatches were corrected during the morning shift.", timestamp: "2026-07-07T08:05:00" },
        { type: "system", author: "Carlos Diaz", text: "Status changed from In progress to Completed.", timestamp: "2026-07-07T08:10:00" }
      ]
    },
    {
      id: "TK-478",
      title: "Approve crew assignment",
      owner: "Naomi Lee",
      status: "Blocked",
      priority: "High",
      department: "Scheduling",
      dueDate: "2026-07-07",
      description: "Approve the final assignment list and resolve overlap with the maintenance rotation before field departure.",
      history: [
        { type: "system", author: "TaskFlow", text: "Task created and assigned to Naomi Lee.", timestamp: "2026-07-07T07:50:00" },
        { type: "system", author: "Naomi Lee", text: "Status changed from Planned to Blocked.", timestamp: "2026-07-07T10:15:00" },
        { type: "comment", author: "Naomi Lee", text: "Waiting for confirmation from the backup driver.", timestamp: "2026-07-07T10:18:00" }
      ]
    },
    {
      id: "TK-489",
      title: "Finalize post-inspection report",
      owner: "Julien Moreau",
      status: "Planned",
      priority: "Normal",
      department: "Compliance",
      dueDate: "2026-07-08",
      description: "Prepare the final inspection report package with attachments and approval notes after the job is closed.",
      history: [
        { type: "system", author: "TaskFlow", text: "Task created and assigned to Julien Moreau.", timestamp: "2026-07-07T09:05:00" }
      ]
    },
    {
      id: "TK-492",
      title: "Restock emergency kits",
      owner: "Aisha Patel",
      status: "In progress",
      priority: "High",
      department: "Procurement",
      dueDate: "2026-07-07",
      description: "Review emergency kit levels, replace missing consumables, and log the replenishment in the storage register.",
      history: [
        { type: "system", author: "TaskFlow", text: "Task created and assigned to Aisha Patel.", timestamp: "2026-07-07T08:20:00" },
        { type: "system", author: "Aisha Patel", text: "Status changed from Planned to In progress.", timestamp: "2026-07-07T09:10:00" },
        { type: "comment", author: "Aisha Patel", text: "Two kits still need replacement flashlights.", timestamp: "2026-07-07T11:20:00" }
      ]
    },
    {
      id: "TK-496",
      title: "Update weather risk summary",
      owner: "Blau Bloom",
      status: "Planned",
      priority: "Low",
      department: "Operations",
      dueDate: "2026-07-08",
      description: "Refresh the daily weather summary and note any site-specific warnings for tomorrow's teams.",
      history: [
        { type: "system", author: "TaskFlow", text: "Task created and assigned to Blau Bloom.", timestamp: "2026-07-07T09:55:00" }
      ]
    }
  ];

  const state = {
    selectedTaskId: tasks[0]?.id || null,
    editingTaskId: null,
    detailEditing: false,
    filters: {
      owner: "all",
      status: "all",
      priority: "all",
      hideCompleted: false,
      kpi: "all"
    }
  };

  const elements = {
    taskList: taskManagerRoot.querySelector("[data-task-list]"),
    taskDetailPanel: document.querySelector("[data-task-detail-panel]"),
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
    detailModal: document.querySelector("[data-task-detail-modal]"),
    closeDetailModalButtons: document.querySelectorAll("[data-close-task-detail-modal]"),
    detailHeaderActions: document.querySelector("[data-task-detail-header-actions]"),
    activeMetric: taskManagerRoot.querySelector("[data-metric-visible]"),
    dueMetric: taskManagerRoot.querySelector("[data-metric-progress]"),
    blockedMetric: taskManagerRoot.querySelector("[data-metric-blocked]"),
    lastUpdated: taskManagerRoot.querySelector("[data-last-updated]"),
    kpiCards: taskManagerRoot.querySelectorAll("[data-kpi-filter]")
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

  const currentUserName = "Blau Bloom";

  const fieldLabels = {
    title: "Title",
    owner: "Owner",
    status: "Status",
    priority: "Priority",
    department: "Department",
    dueDate: "Due date",
    description: "Description"
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getNowIsoString() {
    return new Date().toISOString();
  }

  function formatTimestamp(value) {
    const date = new Date(value);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function parseDateOnly(value) {
    if (!value) {
      return null;
    }

    const parts = value.split("-");
    if (parts.length !== 3) {
      return null;
    }

    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function formatDueDate(value) {
    const date = parseDateOnly(value);
    if (!date) {
      return value || "Not set";
    }

    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  }

  function setLastUpdated() {
    elements.lastUpdated.textContent = `Last updated - ${formatTimestamp(getNowIsoString())}`;
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
      if (state.filters.kpi === "active" && !isTaskActive(task)) {
        return false;
      }
      if (state.filters.kpi === "due" && !isTaskDueTodayOrOverdue(task)) {
        return false;
      }
      if (state.filters.kpi === "blocked" && task.status !== "Blocked") {
        return false;
      }
      return true;
    });
  }

  function getSelectedTask(filteredTasks) {
    const selected = filteredTasks.find((task) => task.id === state.selectedTaskId);
    return selected || filteredTasks[0] || null;
  }

  function getLatestHistoryEntry(task) {
    return [...task.history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] || null;
  }

  function isTaskActive(task) {
    return task.status !== "Completed";
  }

  function isTaskDueTodayOrOverdue(task) {
    if (!isTaskActive(task) || !task.dueDate) {
      return false;
    }

    const dueDate = parseDateOnly(task.dueDate);
    if (!dueDate) {
      return false;
    }
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return dueDate < new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  }

  function renderMetrics(filteredTasks) {
    elements.activeMetric.textContent = String(tasks.filter(isTaskActive).length);
    elements.dueMetric.textContent = String(tasks.filter(isTaskDueTodayOrOverdue).length);
    elements.blockedMetric.textContent = String(tasks.filter((task) => task.status === "Blocked").length);
  }

  function renderKpiState() {
    elements.kpiCards.forEach((card) => {
      const kpiKey = card.getAttribute("data-kpi-filter");
      card.classList.toggle("active", state.filters.kpi === kpiKey);
      card.setAttribute("aria-pressed", state.filters.kpi === kpiKey ? "true" : "false");
    });
  }

  function renderTaskList(filteredTasks) {
    if (!filteredTasks.length) {
      elements.taskList.innerHTML = "";
      elements.emptyState.hidden = false;
      return;
    }

    elements.emptyState.hidden = true;
    elements.taskList.innerHTML = filteredTasks.map((task) => {
      const latestEntry = getLatestHistoryEntry(task);

      return `
        <article class="task-list-card" data-task-id="${escapeHtml(task.id)}">
          <div class="task-card-top">
            <div class="task-card-summary">
              <strong>${escapeHtml(task.title)}</strong>
              <span>${escapeHtml(task.id)} - ${escapeHtml(task.department || "No department")}</span>
              <p>${escapeHtml(task.description)}</p>
            </div>
            <div class="task-card-badges">
              <span class="pill ${pillClassMap[task.status] || "gray"}">${escapeHtml(task.status)}</span>
              <span class="pill ${pillClassMap[task.priority] || "gray"}">${escapeHtml(task.priority)}</span>
            </div>
          </div>
          <div class="task-card-meta">
            <span>Owner: ${escapeHtml(task.owner)}</span>
            <span>Due: ${escapeHtml(formatDueDate(task.dueDate || ""))}</span>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderTaskDetail(task) {
    if (!task) {
      elements.detailHeaderActions.innerHTML = "";
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

    if (state.detailEditing) {
      renderTaskDetailEditForm(task);
      return;
    }

    renderTaskDetailView(task);
  }

  function renderTaskDetailView(task) {
    elements.detailHeaderActions.innerHTML = `
      <button class="icon-button subtle-icon-button" type="button" data-edit-inline="${escapeHtml(task.id)}" aria-label="Edit task" title="Edit task">&#9998;</button>
    `;

    const historyMarkup = [...task.history]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map((entry) => `
        <div class="timeline-entry ${escapeHtml(entry.type)}">
          <div class="timeline-entry-header">
            <strong>${escapeHtml(entry.author)}</strong>
            <span>${escapeHtml(formatTimestamp(entry.timestamp))}</span>
          </div>
          <p>${escapeHtml(entry.text)}</p>
        </div>
      `)
      .join("");

    elements.taskDetailPanel.innerHTML = `
      <div class="task-detail-grid">
        <div class="task-detail-summary task-detail-summary-static">
          <h3>${escapeHtml(task.title)}</h3>
        </div>
        <p class="task-detail-copy">${escapeHtml(task.description)}</p>
        <div class="detail-metadata">
          <div class="meta-box"><span>Task ID</span><strong>${escapeHtml(task.id)}</strong></div>
          <div class="meta-box"><span>Owner</span><strong>${escapeHtml(task.owner)}</strong></div>
          <div class="meta-box"><span>Status</span><strong>${escapeHtml(task.status)}</strong></div>
          <div class="meta-box"><span>Priority</span><strong>${escapeHtml(task.priority)}</strong></div>
          <div class="meta-box"><span>Department</span><strong>${escapeHtml(task.department || "Not set")}</strong></div>
          <div class="meta-box"><span>Due date</span><strong>${escapeHtml(formatDueDate(task.dueDate || ""))}</strong></div>
        </div>
        <div>
          <div class="card-header">
            <div>
              <h2 class="card-title">Activity log</h2>
              <p class="card-subtitle">Every change and comment is tracked with the time it happened.</p>
            </div>
          </div>
          <form class="task-comment-form" data-inline-comment-form="${escapeHtml(task.id)}">
            <label class="form-field full-span">
              <span>Add comment</span>
              <textarea class="text-input" name="comment" placeholder="Write an update that should appear in the activity log" required></textarea>
            </label>
            <div class="task-comment-actions">
              <button class="button button-primary" type="submit">Add comment</button>
            </div>
          </form>
          <div class="timeline-log">${historyMarkup}</div>
        </div>
      </div>
    `;
  }

  function renderTaskDetailEditForm(task) {
    elements.detailHeaderActions.innerHTML = "";

    const historyMarkup = [...task.history]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map((entry) => `
        <div class="timeline-entry ${escapeHtml(entry.type)}">
          <div class="timeline-entry-header">
            <strong>${escapeHtml(entry.author)}</strong>
            <span>${escapeHtml(formatTimestamp(entry.timestamp))}</span>
          </div>
          <p>${escapeHtml(entry.text)}</p>
        </div>
      `)
      .join("");

    elements.taskDetailPanel.innerHTML = `
      <form data-inline-task-form="${escapeHtml(task.id)}" class="task-detail-grid">
        <div class="task-detail-summary">
          <div>
            <h3>Edit ${escapeHtml(task.id)}</h3>
            <p>Update the task fields here and save without leaving this popup.</p>
          </div>
          <div class="task-card-actions">
            <button class="button" type="button" data-cancel-inline-edit>Cancel</button>
            <button class="button button-primary" type="submit">Save changes</button>
          </div>
        </div>
        <input type="hidden" name="id" value="${escapeHtml(task.id)}" />
        <div class="form-grid">
          <label class="form-field">
            <span>Title</span>
            <input class="text-input" name="title" value="${escapeHtml(task.title)}" required />
          </label>
          <label class="form-field">
            <span>Owner</span>
            <input class="text-input" name="owner" value="${escapeHtml(task.owner)}" required />
          </label>
          <label class="form-field">
            <span>Status</span>
            <select class="select-input" name="status" required>
              <option value="Planned" ${task.status === "Planned" ? "selected" : ""}>Planned</option>
              <option value="In progress" ${task.status === "In progress" ? "selected" : ""}>In progress</option>
              <option value="Blocked" ${task.status === "Blocked" ? "selected" : ""}>Blocked</option>
              <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
            </select>
          </label>
          <label class="form-field">
            <span>Priority</span>
            <select class="select-input" name="priority" required>
              <option value="Low" ${task.priority === "Low" ? "selected" : ""}>Low</option>
              <option value="Normal" ${task.priority === "Normal" ? "selected" : ""}>Normal</option>
              <option value="High" ${task.priority === "High" ? "selected" : ""}>High</option>
              <option value="Urgent" ${task.priority === "Urgent" ? "selected" : ""}>Urgent</option>
            </select>
          </label>
          <label class="form-field">
            <span>Department</span>
            <input class="text-input" name="department" value="${escapeHtml(task.department || "")}" />
          </label>
          <label class="form-field">
            <span>Due date</span>
            <input class="text-input" type="date" name="dueDate" value="${escapeHtml(task.dueDate || "")}" />
          </label>
          <label class="form-field full-span">
            <span>Description</span>
            <textarea class="text-input" name="description" required>${escapeHtml(task.description)}</textarea>
          </label>
          <label class="form-field full-span">
            <span>Add comment</span>
            <textarea class="text-input" name="comments" placeholder="Write an update that should appear in the activity log"></textarea>
          </label>
        </div>
        <div>
          <div class="card-header">
            <div>
              <h2 class="card-title">Activity log</h2>
              <p class="card-subtitle">Every change and comment is tracked with the time it happened.</p>
            </div>
          </div>
          <div class="timeline-log">${historyMarkup}</div>
        </div>
      </form>
    `;
  }

  function openDetailModal(taskId) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }

    state.selectedTaskId = task.id;
    state.detailEditing = false;
    renderTaskDetail(task);
    elements.detailModal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeDetailModal() {
    elements.detailModal.hidden = true;
    state.detailEditing = false;
    if (elements.modal.hidden) {
      document.body.classList.remove("modal-open");
    }
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
    renderKpiState();
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
      elements.form.elements.comments.value = "";
    } else {
      elements.modalTitle.textContent = "Create task";
    }

    elements.modal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    elements.modal.hidden = true;
    if (elements.detailModal.hidden && elements.occurrenceModal.hidden) {
      document.body.classList.remove("modal-open");
    }
    resetForm();
  }

  function createTaskId() {
    const maxNumber = tasks.reduce((max, task) => {
      const numericPart = Number(task.id.replace("TK-", ""));
      return Number.isFinite(numericPart) ? Math.max(max, numericPart) : max;
    }, 500);
    return `TK-${maxNumber + 1}`;
  }

  function createHistoryEntry(type, author, text, timestamp = getNowIsoString()) {
    return { type, author, text, timestamp };
  }

  function normalizeValue(value) {
    return value.trim() || "Not set";
  }

  function buildTaskHistory(previousTask, updatedTask, newCommentText) {
    const nextHistory = previousTask ? [...previousTask.history] : [];
    const timestamp = getNowIsoString();

    if (!previousTask) {
      nextHistory.push(
        createHistoryEntry(
          "system",
          "TaskFlow",
          `Task created and assigned to ${updatedTask.owner}.`,
          timestamp
        )
      );
    } else {
      Object.keys(fieldLabels).forEach((key) => {
        const oldValue = normalizeValue(previousTask[key] || "");
        const newValue = normalizeValue(updatedTask[key] || "");

        if (oldValue !== newValue) {
          nextHistory.push(
            createHistoryEntry(
              "system",
              updatedTask.owner || "TaskFlow",
              `${fieldLabels[key]} changed from ${oldValue} to ${newValue}.`,
              timestamp
            )
          );
        }
      });
    }

    if (newCommentText) {
      nextHistory.push(
        createHistoryEntry(
          "comment",
          updatedTask.owner || "Team note",
          newCommentText,
          timestamp
        )
      );
    }

    return nextHistory;
  }

  function saveTask(formData) {
    const newCommentText = formData.get("comments").trim();
    const previousTask = state.editingTaskId
      ? tasks.find((task) => task.id === state.editingTaskId)
      : null;

    const payload = {
      id: state.editingTaskId || createTaskId(),
      title: formData.get("title").trim(),
      owner: formData.get("owner").trim(),
      status: formData.get("status"),
      priority: formData.get("priority"),
      department: formData.get("department").trim(),
      dueDate: formData.get("dueDate").trim(),
      description: formData.get("description").trim()
    };

    payload.history = buildTaskHistory(previousTask, payload, newCommentText);

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

    const savedTask = tasks.find((task) => task.id === state.selectedTaskId);
    state.detailEditing = false;

    if (state.editingTaskId && !elements.detailModal.hidden) {
      renderAll();
      renderTaskDetail(savedTask);
    } else {
      closeModal();
      renderAll();
    }

    if (!state.editingTaskId) {
      renderAll();
    }
  }

  function addTaskComment(taskId, commentText) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }

    task.history.push(
      createHistoryEntry(
        "comment",
        currentUserName,
        commentText.trim(),
        getNowIsoString()
      )
    );

    state.selectedTaskId = task.id;
    renderAll();
    if (!elements.detailModal.hidden) {
      renderTaskDetail(task);
    }
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
      hideCompleted: false,
      kpi: "all"
    };
    renderAll();
  });

  elements.kpiCards.forEach((card) => {
    const applyKpiFilter = () => {
      const kpiKey = card.getAttribute("data-kpi-filter");
      state.filters.kpi = state.filters.kpi === kpiKey ? "all" : kpiKey;
      renderAll();
    };

    card.addEventListener("click", applyKpiFilter);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        applyKpiFilter();
      }
    });
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

  elements.closeDetailModalButtons.forEach((button) => {
    button.addEventListener("click", closeDetailModal);
  });

  elements.detailModal.addEventListener("click", (event) => {
    if (event.target === elements.detailModal) {
      closeDetailModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.modal.hidden) {
      closeModal();
    } else if (event.key === "Escape" && !elements.detailModal.hidden) {
      closeDetailModal();
    }
  });

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(elements.form);
    saveTask(formData);
  });

  elements.taskDetailPanel.addEventListener("submit", (event) => {
    const inlineForm = event.target.closest("[data-inline-task-form]");
    if (!inlineForm) {
      const inlineCommentForm = event.target.closest("[data-inline-comment-form]");
      if (!inlineCommentForm) {
        return;
      }

      event.preventDefault();
      const commentField = inlineCommentForm.elements.comment;
      const commentText = commentField.value.trim();
      if (!commentText) {
        return;
      }

      addTaskComment(inlineCommentForm.getAttribute("data-inline-comment-form"), commentText);
      return;
    }

    event.preventDefault();
    state.editingTaskId = inlineForm.getAttribute("data-inline-task-form");
    const formData = new FormData(inlineForm);
    saveTask(formData);
  });

  document.addEventListener("click", (event) => {
    const taskCard = event.target.closest("[data-task-id]");
    if (taskCard) {
      state.selectedTaskId = taskCard.getAttribute("data-task-id");
      renderAll();
      openDetailModal(state.selectedTaskId);
      return;
    }

    const editInlineTrigger = event.target.closest("[data-edit-inline]");
    if (editInlineTrigger) {
      state.detailEditing = true;
      renderTaskDetail(tasks.find((task) => task.id === editInlineTrigger.getAttribute("data-edit-inline")));
      return;
    }

    const cancelInlineTrigger = event.target.closest("[data-cancel-inline-edit]");
    if (cancelInlineTrigger) {
      state.detailEditing = false;
      renderTaskDetail(tasks.find((task) => task.id === state.selectedTaskId));
    }
  });

  renderAll();
}

const planificationRoot = document.querySelector("[data-planification-manager]");

if (planificationRoot) {
  const recurringTasks = [
    {
      id: "RP-201",
      title: "Workshop deep cleaning",
      owner: "Sofia Marin",
      lane: "Maintenance",
      priority: "Normal",
      status: "Active",
      frequencyValue: 1,
      frequencyUnit: "weeks",
      startDate: "2026-07-06",
      time: "07:30",
      duration: "2h",
      area: "Workshop A",
      description: "Run the full cleaning checklist for benches, tools, and shared surfaces before the repair shift begins.",
      color: "blue"
    },
    {
      id: "RP-202",
      title: "Emergency lighting inspection",
      owner: "Ruben Costa",
      lane: "Field operations",
      priority: "High",
      status: "Active",
      frequencyValue: 2,
      frequencyUnit: "weeks",
      startDate: "2026-07-08",
      time: "09:00",
      duration: "1h 30m",
      area: "North route assets",
      description: "Inspect emergency lighting units, verify battery status, and log any replacements needed for route equipment.",
      color: "orange"
    },
    {
      id: "RP-203",
      title: "Cold storage sensor calibration",
      owner: "Naomi Lee",
      lane: "Warehouse",
      priority: "Normal",
      status: "Active",
      frequencyValue: 1,
      frequencyUnit: "months",
      startDate: "2026-07-11",
      time: "11:00",
      duration: "3h",
      area: "Cold room zone",
      description: "Calibrate temperature sensors, compare readings with the control panel, and document any deviations.",
      color: "green"
    },
    {
      id: "RP-204",
      title: "Office waste removal",
      owner: "Maya Henderson",
      lane: "Administration",
      priority: "Low",
      status: "Paused",
      frequencyValue: 3,
      frequencyUnit: "days",
      startDate: "2026-07-05",
      time: "18:00",
      duration: "45m",
      area: "HQ office",
      description: "Clear archived packaging and routine waste from admin rooms to keep shared desks and storage points clear.",
      color: "red"
    }
  ];

  const scheduledTasks = [
    {
      id: "TK-481",
      title: "Prepare equipment inspection brief",
      owner: "Maya Henderson",
      lane: "Field Operations",
      priority: "Urgent",
      status: "In progress",
      date: "2026-07-07",
      time: "08:45",
      duration: "1h 30m",
      area: "North zone handoff",
      description: "Compile the complete inspection sequence and confirm crew acknowledgement.",
      color: "red"
    },
    {
      id: "TK-474",
      title: "Validate equipment tags",
      owner: "Carlos Diaz",
      lane: "Warehouse",
      priority: "Normal",
      status: "Completed",
      date: "2026-07-07",
      time: "08:00",
      duration: "1h",
      area: "Dispatch bench",
      description: "Check outgoing units for the latest asset tag and replace damaged labels.",
      color: "blue"
    },
    {
      id: "TK-478",
      title: "Approve crew assignment",
      owner: "Naomi Lee",
      lane: "Scheduling",
      priority: "High",
      status: "Blocked",
      date: "2026-07-07",
      time: "10:15",
      duration: "45m",
      area: "Dispatch office",
      description: "Approve the final assignment list and resolve maintenance rotation overlap.",
      color: "orange"
    },
    {
      id: "TK-489",
      title: "Finalize post-inspection report",
      owner: "Julien Moreau",
      lane: "Compliance",
      priority: "Normal",
      status: "Planned",
      date: "2026-07-08",
      time: "09:05",
      duration: "2h",
      area: "HQ review desk",
      description: "Prepare the final inspection report package with attachments and approval notes.",
      color: "green"
    },
    {
      id: "TK-492",
      title: "Restock emergency kits",
      owner: "Aisha Patel",
      lane: "Procurement",
      priority: "High",
      status: "In progress",
      date: "2026-07-07",
      time: "09:10",
      duration: "2h 30m",
      area: "Storage register",
      description: "Review kit levels, replace consumables, and log replenishment.",
      color: "orange"
    },
    {
      id: "TK-496",
      title: "Update weather risk summary",
      owner: "Blau Bloom",
      lane: "Operations",
      priority: "Low",
      status: "Planned",
      date: "2026-07-08",
      time: "09:55",
      duration: "1h",
      area: "Operations desk",
      description: "Refresh the daily weather summary and note site-specific warnings.",
      color: "blue"
    }
  ];

  const state = {
    selectedTaskId: recurringTasks[0]?.id || null,
    editingTaskId: null,
    currentView: "month",
    currentTab: "calendar",
    cursorDate: new Date(2026, 6, 7),
    selectedDateIso: "2026-07-07",
    filters: {
      lane: "all",
      unit: "all",
      search: "",
      hidePaused: false
    }
  };

  const elements = {
    list: planificationRoot.querySelector("[data-recurring-task-list]"),
    emptyState: planificationRoot.querySelector("[data-plan-empty-state]"),
    laneFilter: planificationRoot.querySelector("[data-plan-filter-lane]"),
    unitFilter: planificationRoot.querySelector("[data-plan-filter-unit]"),
    search: planificationRoot.querySelector("[data-plan-search]"),
    hidePaused: planificationRoot.querySelector("[data-plan-hide-paused]"),
    calendar: planificationRoot.querySelector("[data-planner-calendar]"),
    calendarTitle: planificationRoot.querySelector("[data-calendar-title]"),
    calendarRange: planificationRoot.querySelector("[data-calendar-range]"),
    viewButtons: planificationRoot.querySelectorAll("[data-calendar-view]"),
    tabButtons: planificationRoot.querySelectorAll("[data-plan-tab]"),
    tabPanels: planificationRoot.querySelectorAll("[data-plan-panel]"),
    createButton: planificationRoot.querySelector("[data-plan-create-button]"),
    shiftButtons: planificationRoot.querySelectorAll("[data-shift-range]"),
    todayButton: planificationRoot.querySelector("[data-today-plan]"),
    openModalButtons: document.querySelectorAll("[data-open-recurring-modal]"),
    closeModalButtons: document.querySelectorAll("[data-close-recurring-modal]"),
    modal: document.querySelector("[data-recurring-modal]"),
    modalTitle: document.querySelector("[data-recurring-modal-title]"),
    form: document.querySelector("[data-recurring-form]"),
    detailModal: document.querySelector("[data-recurring-detail-modal]"),
    detailPanel: document.querySelector("[data-recurring-detail-panel]"),
    detailHeaderActions: document.querySelector("[data-recurring-detail-header-actions]"),
    closeDetailModalButtons: document.querySelectorAll("[data-close-recurring-detail-modal]"),
    selectedDateLabel: planificationRoot.querySelector("[data-selected-date-label]"),
    selectedDateCount: planificationRoot.querySelector("[data-selected-date-count]"),
    selectedDateList: planificationRoot.querySelector("[data-selected-date-list]"),
    occurrenceModal: document.querySelector("[data-occurrence-modal]"),
    occurrenceModalTitle: document.querySelector("[data-occurrence-modal-title]"),
    occurrenceModalSubtitle: document.querySelector("[data-occurrence-modal-subtitle]"),
    occurrenceDetailPanel: document.querySelector("[data-occurrence-detail-panel]"),
    closeOccurrenceModalButtons: document.querySelectorAll("[data-close-occurrence-modal]"),
    templateCount: planificationRoot.querySelector("[data-plan-template-count]"),
    occurrenceCount: planificationRoot.querySelector("[data-plan-occurrence-count]"),
    lastUpdated: planificationRoot.querySelector("[data-plan-last-updated]")
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getNowIsoString() {
    return new Date().toISOString();
  }

  function parseDateOnly(value) {
    if (!value) {
      return null;
    }

    const parts = value.split("-");
    if (parts.length !== 3) {
      return null;
    }

    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function formatDateShort(date) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short"
    }).format(date);
  }

  function formatDateLong(date) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  function formatMonthTitle(date) {
    return new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function formatDayLabel(date) {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short"
    }).format(date);
  }

  function formatDateWithWeekday(date) {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function formatTimestamp(value) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  }

  const priorityWeight = {
    Urgent: 4,
    High: 3,
    Normal: 2,
    Low: 1
  };

  function setLastUpdated() {
    elements.lastUpdated.textContent = `Last updated - ${formatTimestamp(getNowIsoString())}`;
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function datesMatch(left, right) {
    return left.getFullYear() === right.getFullYear()
      && left.getMonth() === right.getMonth()
      && left.getDate() === right.getDate();
  }

  function getDateKey(date) {
    return startOfDay(date).toISOString().slice(0, 10);
  }

  function addInterval(date, value, unit) {
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (unit === "days") {
      next.setDate(next.getDate() + value);
      return next;
    }
    if (unit === "weeks") {
      next.setDate(next.getDate() + value * 7);
      return next;
    }

    const dayOfMonth = next.getDate();
    const targetMonth = next.getMonth() + value;
    const targetYear = next.getFullYear() + Math.floor(targetMonth / 12);
    const normalizedMonth = ((targetMonth % 12) + 12) % 12;
    const lastDayOfTargetMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();
    return new Date(targetYear, normalizedMonth, Math.min(dayOfMonth, lastDayOfTargetMonth));
  }

  function startOfWeek(date) {
    const current = startOfDay(date);
    const day = current.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    current.setDate(current.getDate() + diff);
    return current;
  }

  function endOfWeek(date) {
    const start = startOfWeek(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return end;
  }

  function startOfMonthGrid(date) {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    return startOfWeek(first);
  }

  function endOfMonthGrid(date) {
    const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const end = endOfWeek(last);
    return end;
  }

  function getUniqueValues(key) {
    return [...new Set(recurringTasks.map((task) => task[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function renderFilterOptions(select, values, placeholder) {
    const currentValue = select.value || "all";
    select.innerHTML = [`<option value="all">${placeholder}</option>`]
      .concat(values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`))
      .join("");
    select.value = values.includes(currentValue) ? currentValue : "all";
  }

  function getFilteredTasks() {
    return recurringTasks.filter((task) => {
      if (state.filters.lane !== "all" && task.lane.toLowerCase() !== state.filters.lane.toLowerCase()) {
        return false;
      }
      if (state.filters.unit !== "all" && task.frequencyUnit !== state.filters.unit) {
        return false;
      }
      if (state.filters.hidePaused && task.status === "Paused") {
        return false;
      }
      if (state.filters.search) {
        const searchValue = state.filters.search.toLowerCase();
        const haystack = [
          task.title,
          task.owner,
          task.lane,
          task.area,
          task.description
        ].join(" ").toLowerCase();
        if (!haystack.includes(searchValue)) {
          return false;
        }
      }
      return true;
    });
  }

  function getFilteredScheduledTasks() {
    return scheduledTasks.filter((task) => {
      if (state.filters.lane !== "all" && task.lane.toLowerCase() !== state.filters.lane.toLowerCase()) {
        return false;
      }
      if (state.filters.search) {
        const searchValue = state.filters.search.toLowerCase();
        const haystack = [
          task.title,
          task.owner,
          task.lane,
          task.area,
          task.description
        ].join(" ").toLowerCase();
        if (!haystack.includes(searchValue)) {
          return false;
        }
      }
      return true;
    });
  }

  function getSelectedTask(filteredTasks) {
    if (!filteredTasks.length) {
      return null;
    }

    const selected = filteredTasks.find((task) => task.id === state.selectedTaskId);
    return selected || filteredTasks[0] || null;
  }

  function getFrequencyLabel(task) {
    const unitLabel = task.frequencyValue === 1
      ? task.frequencyUnit.slice(0, -1)
      : task.frequencyUnit;
    return `Every ${task.frequencyValue} ${unitLabel}`;
  }

  function generateOccurrencesForTask(task, rangeStart, rangeEnd, limit = 100) {
    if (task.status === "Paused" || task.status === "Completed") {
      return [];
    }

    const occurrences = [];
    let pointer = parseDateOnly(task.startDate);
    const start = startOfDay(rangeStart);
    const end = startOfDay(rangeEnd);

    if (!pointer) {
      return occurrences;
    }

    let guard = 0;
    while (pointer <= end && guard < limit) {
      if (pointer >= start) {
        occurrences.push({
          taskId: task.id,
          title: task.title,
          owner: task.owner,
          lane: task.lane,
          priority: task.priority || "Normal",
          date: new Date(pointer),
          time: task.time,
          duration: task.duration,
          area: task.area,
          color: task.color || "blue",
          status: task.status,
          source: "periodic",
          isCompleted: false
        });
      }

      pointer = addInterval(pointer, task.frequencyValue, task.frequencyUnit);
      guard += 1;
    }

    return occurrences;
  }

  function generateOccurrencesForScheduledTasks(tasks, rangeStart, rangeEnd) {
    const start = startOfDay(rangeStart);
    const end = startOfDay(rangeEnd);

    return tasks.map((task) => {
      if (task.status === "Completed") {
        return null;
      }

      const date = parseDateOnly(task.date);
      if (!date || date < start || date > end) {
        return null;
      }

      return {
        taskId: task.id,
        title: task.title,
        owner: task.owner,
        lane: task.lane,
        priority: task.priority || "Normal",
        date,
        time: task.time,
        duration: task.duration,
        area: task.area,
        color: task.color || "blue",
        status: task.status,
        source: "task",
        isCompleted: task.status === "Completed"
      };
    }).filter(Boolean);
  }

  function getVisibleRange() {
    if (state.currentView === "week") {
      return {
        start: startOfWeek(state.cursorDate),
        end: endOfWeek(state.cursorDate)
      };
    }

    return {
      start: startOfMonthGrid(state.cursorDate),
      end: endOfMonthGrid(state.cursorDate)
    };
  }

  function getVisibleOccurrences(filteredTasks, filteredScheduledTasks) {
    const range = getVisibleRange();
    return filteredTasks
      .flatMap((task) => generateOccurrencesForTask(task, range.start, range.end))
      .concat(generateOccurrencesForScheduledTasks(filteredScheduledTasks, range.start, range.end))
      .sort((left, right) => {
        const dateComparison = left.date.getTime() - right.date.getTime();
        if (dateComparison !== 0) {
          return dateComparison;
        }

        const priorityComparison = (priorityWeight[right.priority] || 0) - (priorityWeight[left.priority] || 0);
        if (priorityComparison !== 0) {
          return priorityComparison;
        }

        const timeComparison = left.time.localeCompare(right.time);
        if (timeComparison !== 0) {
          return timeComparison;
        }

        return left.taskId.localeCompare(right.taskId);
      });
  }

  function getNextRuns(task, count = 5) {
    const start = startOfDay(state.cursorDate);
    const futureEnd = new Date(start);
    futureEnd.setMonth(futureEnd.getMonth() + 6);
    return generateOccurrencesForTask(task, start, futureEnd, 250).slice(0, count);
  }

  function getOccurrenceKey(occurrence) {
    return [occurrence.source, occurrence.taskId, getDateKey(occurrence.date), occurrence.time].join("|");
  }

  function renderOccurrenceCard(item) {
    return `
      <button class="planner-occurrence ${escapeHtml(item.color)}" type="button" data-occurrence-key="${escapeHtml(getOccurrenceKey(item))}">
        <span class="planner-occurrence-time">${escapeHtml(item.time)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <span class="planner-occurrence-meta">${escapeHtml(item.owner)} · ${escapeHtml(item.lane)}</span>
      </button>
    `;
  }

  function getOccurrencesForDate(occurrences, dateIso) {
    return occurrences.filter((item) => getDateKey(item.date) === dateIso);
  }

  function findOccurrenceByKey(occurrences, occurrenceKey) {
    return occurrences.find((item) => getOccurrenceKey(item) === occurrenceKey) || null;
  }

  function renderList(filteredTasks) {
    elements.templateCount.textContent = `${filteredTasks.length} template${filteredTasks.length === 1 ? "" : "s"}`;

    if (!filteredTasks.length) {
      elements.list.innerHTML = "";
      elements.emptyState.hidden = false;
      return;
    }

    elements.emptyState.hidden = true;
    elements.list.innerHTML = filteredTasks.map((task) => {
      const nextRun = getNextRuns(task, 1)[0];
      return `
        <article class="task-list-card ${state.selectedTaskId === task.id ? "active" : ""}" data-recurring-task-id="${escapeHtml(task.id)}">
          <div class="task-card-top">
            <div class="task-card-summary">
              <strong>${escapeHtml(task.title)}</strong>
              <span>${escapeHtml(task.id)} - ${escapeHtml(task.lane)}</span>
              <div class="task-card-frequency">${escapeHtml(getFrequencyLabel(task))} at ${escapeHtml(task.time)}</div>
              <p>${escapeHtml(task.description)}</p>
            </div>
            <div class="task-card-badges">
              <span class="pill ${task.status === "Paused" ? "gray" : task.color || "blue"}">${escapeHtml(task.status)}</span>
            </div>
          </div>
          <div class="task-card-meta">
            <span>Owner: ${escapeHtml(task.owner)}</span>
            <span>Next run: ${escapeHtml(nextRun ? `${formatDateLong(nextRun.date)} at ${task.time}` : "Paused")}</span>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderRecurringDetailModal(task) {
    if (!task) {
      elements.detailHeaderActions.innerHTML = "";
      elements.detailPanel.innerHTML = `
        <div class="task-detail-empty">
          <strong>No periodic task selected.</strong>
          <span>Choose a recurring template from the list to inspect or edit it.</span>
        </div>
      `;
      return;
    }

    const nextRuns = getNextRuns(task, 5);
    const nextRunsMarkup = nextRuns.length
      ? nextRuns.map((run) => `
          <div class="upcoming-run-card">
            <strong>${escapeHtml(formatDateLong(run.date))} at ${escapeHtml(run.time)}</strong>
            <span>${escapeHtml(run.duration)} - ${escapeHtml(run.area)}</span>
          </div>
        `).join("")
      : `
        <div class="planner-empty">
          <span>This template is paused, so no future runs are being generated.</span>
        </div>
      `;

    elements.detailHeaderActions.innerHTML = `
      <button class="icon-button subtle-icon-button" type="button" data-edit-recurring="${escapeHtml(task.id)}" aria-label="Edit periodic task" title="Edit periodic task">&#9998;</button>
    `;

    elements.detailPanel.innerHTML = `
      <div class="task-detail-grid">
        <div class="task-detail-summary task-detail-summary-static">
          <h3>${escapeHtml(task.title)}</h3>
        </div>
        <p class="task-detail-copy">${escapeHtml(task.description)}</p>
        <div class="detail-metadata">
          <div class="meta-box"><span>Task ID</span><strong>${escapeHtml(task.id)}</strong></div>
          <div class="meta-box"><span>Owner</span><strong>${escapeHtml(task.owner)}</strong></div>
          <div class="meta-box"><span>Status</span><strong>${escapeHtml(task.status)}</strong></div>
          <div class="meta-box"><span>Lane</span><strong>${escapeHtml(task.lane)}</strong></div>
          <div class="meta-box"><span>Cadence</span><strong>${escapeHtml(getFrequencyLabel(task))}</strong></div>
          <div class="meta-box"><span>Start date</span><strong>${escapeHtml(task.startDate)}</strong></div>
          <div class="meta-box"><span>Preferred time</span><strong>${escapeHtml(task.time)}</strong></div>
          <div class="meta-box"><span>Duration</span><strong>${escapeHtml(task.duration)}</strong></div>
          <div class="meta-box"><span>Area</span><strong>${escapeHtml(task.area)}</strong></div>
          <div class="meta-box"><span>Repeat unit</span><strong>${escapeHtml(task.frequencyValue)} ${escapeHtml(task.frequencyUnit)}</strong></div>
        </div>
        <div>
          <div class="card-header">
            <div>
              <h2 class="card-title">Next generated dates</h2>
              <p class="card-subtitle">Preview of the next recurring executions from this template.</p>
            </div>
          </div>
          <div class="planification-upcoming">${nextRunsMarkup}</div>
        </div>
      </div>
    `;
  }

  function openRecurringDetailModal(taskId) {
    const task = recurringTasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }

    state.selectedTaskId = task.id;
    renderRecurringDetailModal(task);
    elements.detailModal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeRecurringDetailModal() {
    elements.detailModal.hidden = true;
    if (elements.modal.hidden && elements.occurrenceModal.hidden) {
      document.body.classList.remove("modal-open");
    }
  }

  function renderWeekCalendar(occurrences, rangeStart) {
    const today = startOfDay(new Date());
    const byDate = new Map();

    occurrences.forEach((occurrence) => {
      const key = occurrence.date.toISOString().slice(0, 10);
      const items = byDate.get(key) || [];
      items.push(occurrence);
      byDate.set(key, items);
    });

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(rangeStart);
      date.setDate(rangeStart.getDate() + index);
      return date;
    });

    elements.calendarTitle.textContent = "Weekly calendar";
    elements.calendarRange.textContent = `${formatDateLong(days[0])} to ${formatDateLong(days[6])}`;
    elements.calendar.innerHTML = `
      <div class="planner-week-grid">
        ${days.map((day) => {
          const key = day.toISOString().slice(0, 10);
          const items = byDate.get(key) || [];
          return `
            <div class="planner-day-column ${datesMatch(day, today) ? "is-today" : ""}">
              <div class="planner-day-head">
                <strong>${escapeHtml(formatDayLabel(day))}</strong>
                <span>${escapeHtml(formatDateShort(day))}</span>
              </div>
              <div class="planner-occurrence-list">
                ${items.length ? items.map((item) => `
                  <div class="planner-occurrence ${escapeHtml(item.color)}">
                    <strong>${escapeHtml(item.taskId)}</strong>
                    <div class="planner-occurrence-tooltip">
                      <strong>${escapeHtml(item.title)}</strong>
                      <span>${escapeHtml(item.taskId)} · ${escapeHtml(item.time)} · ${escapeHtml(item.duration)}</span>
                      <span>${escapeHtml(item.owner)} · ${escapeHtml(item.area)}</span>
                      <span>${escapeHtml(item.lane)} · ${escapeHtml(item.source === "periodic" ? "Periodic task" : item.status)}</span>
                    </div>
                  </div>
                `).join("") : ""}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderMonthCalendar(occurrences) {
    const today = startOfDay(new Date());
    const monthStart = new Date(state.cursorDate.getFullYear(), state.cursorDate.getMonth(), 1);
    const monthEnd = new Date(state.cursorDate.getFullYear(), state.cursorDate.getMonth() + 1, 0);
    const byDate = new Map();
    const leadingOffset = (monthStart.getDay() + 6) % 7;
    const trailingOffset = (7 - ((leadingOffset + monthEnd.getDate()) % 7)) % 7;

    occurrences.forEach((occurrence) => {
      const key = occurrence.date.toISOString().slice(0, 10);
      const items = byDate.get(key) || [];
      items.push(occurrence);
      byDate.set(key, items);
    });

    const cells = [];
    for (let index = 0; index < leadingOffset; index += 1) {
      cells.push(null);
    }
    for (let dayNumber = 1; dayNumber <= monthEnd.getDate(); dayNumber += 1) {
      cells.push(new Date(state.cursorDate.getFullYear(), state.cursorDate.getMonth(), dayNumber));
    }
    for (let index = 0; index < trailingOffset; index += 1) {
      cells.push(null);
    }

    elements.calendarTitle.textContent = "Monthly calendar";
    elements.calendarRange.textContent = formatMonthTitle(monthStart);
    elements.calendar.innerHTML = `
      <div class="planner-month-grid">
        ${cells.map((day) => {
          if (!day) {
            return '<div class="planner-month-spacer" aria-hidden="true"></div>';
          }

          const key = day.toISOString().slice(0, 10);
          const items = (byDate.get(key) || []).slice(0, 3);
          const isOutside = day.getMonth() !== state.cursorDate.getMonth();
          return `
            <div class="planner-month-cell ${isOutside ? "is-outside" : ""} ${datesMatch(day, today) ? "is-today" : ""}">
              <div class="planner-month-head">
                <strong>${escapeHtml(String(day.getDate()))}</strong>
                <span>${escapeHtml(formatDayLabel(day))}</span>
              </div>
              <div class="planner-occurrence-list">
                ${items.length ? items.map((item) => `
                  <div class="planner-occurrence ${escapeHtml(item.color)}">
                    <strong>${escapeHtml(item.taskId)}</strong>
                    <div class="planner-occurrence-tooltip">
                      <strong>${escapeHtml(item.title)}</strong>
                      <span>${escapeHtml(item.taskId)} · ${escapeHtml(item.time)} · ${escapeHtml(item.duration)}</span>
                      <span>${escapeHtml(item.owner)} · ${escapeHtml(item.area)}</span>
                      <span>${escapeHtml(item.lane)} · ${escapeHtml(item.source === "periodic" ? "Periodic task" : item.status)}</span>
                    </div>
                  </div>
                `).join("") : ""}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderCalendar(filteredTasks, filteredScheduledTasks) {
    const range = getVisibleRange();
    const occurrences = getVisibleOccurrences(filteredTasks, filteredScheduledTasks);
    elements.occurrenceCount.textContent = `${occurrences.length} occurrence${occurrences.length === 1 ? "" : "s"}`;

    if (state.currentView === "week") {
      renderWeekCalendar(occurrences, range.start);
    } else {
      renderMonthCalendar(occurrences);
    }
  }

  function renderWeekCalendar(occurrences, rangeStart) {
    const today = startOfDay(new Date());
    const byDate = new Map();

    occurrences.forEach((occurrence) => {
      const key = getDateKey(occurrence.date);
      const items = byDate.get(key) || [];
      items.push(occurrence);
      byDate.set(key, items);
    });

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(rangeStart);
      date.setDate(rangeStart.getDate() + index);
      return date;
    });

    elements.calendarTitle.textContent = "Weekly schedule";
    elements.calendarRange.textContent = `${formatDateLong(days[0])} to ${formatDateLong(days[6])}`;
    elements.calendar.innerHTML = `
      <div class="planner-weekday-row">
        ${days.map((day) => `<div class="planner-weekday">${escapeHtml(formatDayLabel(day))}</div>`).join("")}
      </div>
      <div class="planner-week-grid">
        ${days.map((day) => {
          const key = getDateKey(day);
          const items = byDate.get(key) || [];
          return `
            <div class="planner-day-column ${datesMatch(day, today) ? "is-today" : ""} ${state.selectedDateIso === key ? "is-selected" : ""}" data-plan-date="${escapeHtml(key)}">
              <div class="planner-day-head">
                <strong>${escapeHtml(formatDateShort(day))}</strong>
                <span>${items.length} card${items.length === 1 ? "" : "s"}</span>
              </div>
              <div class="planner-occurrence-list">
                ${items.length ? items.map((item) => renderOccurrenceCard(item)).join("") : ""}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderMonthCalendar(occurrences) {
    const today = startOfDay(new Date());
    const monthStart = new Date(state.cursorDate.getFullYear(), state.cursorDate.getMonth(), 1);
    const gridStart = startOfMonthGrid(state.cursorDate);
    const gridEnd = endOfMonthGrid(state.cursorDate);
    const byDate = new Map();

    occurrences.forEach((occurrence) => {
      const key = getDateKey(occurrence.date);
      const items = byDate.get(key) || [];
      items.push(occurrence);
      byDate.set(key, items);
    });

    const cells = [];
    const pointer = new Date(gridStart);
    while (pointer <= gridEnd) {
      cells.push(new Date(pointer));
      pointer.setDate(pointer.getDate() + 1);
    }

    const weekdayLabels = Array.from({ length: 7 }, (_, index) => {
      const labelDate = new Date(gridStart);
      labelDate.setDate(gridStart.getDate() + index);
      return labelDate;
    });

    elements.calendarTitle.textContent = "Calendar schedule";
    elements.calendarRange.textContent = formatMonthTitle(monthStart);
    elements.calendar.innerHTML = `
      <div class="planner-weekday-row">
        ${weekdayLabels.map((day) => `<div class="planner-weekday">${escapeHtml(formatDayLabel(day))}</div>`).join("")}
      </div>
      <div class="planner-month-grid">
        ${cells.map((day) => {
          const key = getDateKey(day);
          const items = byDate.get(key) || [];
          const visibleItems = items.slice(0, 4);
          const isOutside = day.getMonth() !== state.cursorDate.getMonth();
          return `
            <div class="planner-month-cell ${isOutside ? "is-outside" : ""} ${datesMatch(day, today) ? "is-today" : ""} ${state.selectedDateIso === key ? "is-selected" : ""}" data-plan-date="${escapeHtml(key)}">
              <div class="planner-month-head">
                <strong>${escapeHtml(String(day.getDate()))}</strong>
                <span>${items.length ? `${items.length} cards` : formatDayLabel(day)}</span>
              </div>
              <div class="planner-occurrence-list">
                ${visibleItems.length ? visibleItems.map((item) => renderOccurrenceCard(item)).join("") : ""}
                ${items.length > visibleItems.length ? `<button class="planner-more-button" type="button" data-plan-date="${escapeHtml(key)}">+${items.length - visibleItems.length} more</button>` : ""}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderSelectedDateAgenda(occurrences) {
    const selectedIso = state.selectedDateIso || getDateKey(state.cursorDate);
    const selectedDate = parseDateOnly(selectedIso) || state.cursorDate;
    const selectedOccurrences = getOccurrencesForDate(occurrences, selectedIso);

    elements.selectedDateLabel.textContent = formatDateWithWeekday(selectedDate);
    elements.selectedDateCount.textContent = `${selectedOccurrences.length} card${selectedOccurrences.length === 1 ? "" : "s"}`;

    if (!selectedOccurrences.length) {
      elements.selectedDateList.innerHTML = "";
      return;
    }

    elements.selectedDateList.innerHTML = selectedOccurrences.map((item) => `
      <article class="planner-agenda-item" data-occurrence-key="${escapeHtml(getOccurrenceKey(item))}">
        <div class="planner-agenda-top">
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.taskId)} · ${escapeHtml(item.source === "periodic" ? "Recurring template" : item.status)}</p>
          </div>
          <span class="pill ${escapeHtml(item.color)}">${escapeHtml(item.time)}</span>
        </div>
        <p>${escapeHtml(item.description)}</p>
        <div class="planner-agenda-meta">
          <span>${escapeHtml(item.owner)}</span>
          <span>${escapeHtml(item.area)}</span>
          <span>${escapeHtml(item.duration)}</span>
        </div>
      </article>
    `).join("");
  }

  function renderOccurrenceDetail(occurrence) {
    if (!occurrence) {
      return;
    }

    const recurringTask = occurrence.source === "periodic"
      ? recurringTasks.find((task) => task.id === occurrence.taskId)
      : null;

    elements.occurrenceModalTitle.textContent = occurrence.title;
    elements.occurrenceModalSubtitle.textContent = `${formatDateWithWeekday(occurrence.date)} at ${occurrence.time}`;
    elements.occurrenceDetailPanel.innerHTML = `
      <div class="occurrence-detail">
        <p class="occurrence-detail-copy">${escapeHtml(occurrence.description)}</p>
        <div class="detail-metadata">
          <div class="meta-box"><span>Card ID</span><strong>${escapeHtml(occurrence.taskId)}</strong></div>
          <div class="meta-box"><span>Type</span><strong>${escapeHtml(occurrence.source === "periodic" ? "Recurring template" : "Scheduled task")}</strong></div>
          <div class="meta-box"><span>Owner</span><strong>${escapeHtml(occurrence.owner)}</strong></div>
          <div class="meta-box"><span>Lane</span><strong>${escapeHtml(occurrence.lane)}</strong></div>
          <div class="meta-box"><span>Priority</span><strong>${escapeHtml(occurrence.priority)}</strong></div>
          <div class="meta-box"><span>Status</span><strong>${escapeHtml(occurrence.status)}</strong></div>
          <div class="meta-box"><span>Area</span><strong>${escapeHtml(occurrence.area)}</strong></div>
          <div class="meta-box"><span>Duration</span><strong>${escapeHtml(occurrence.duration)}</strong></div>
        </div>
        ${recurringTask ? `<div class="occurrence-detail-actions"><button class="button button-soft" type="button" data-open-related-template="${escapeHtml(recurringTask.id)}">Open recurring template</button></div>` : ""}
      </div>
    `;
  }

  function openOccurrenceModal(occurrence) {
    renderOccurrenceDetail(occurrence);
    elements.occurrenceModal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeOccurrenceModal() {
    elements.occurrenceModal.hidden = true;
    if (elements.modal.hidden && elements.detailModal.hidden) {
      document.body.classList.remove("modal-open");
    }
  }

  function renderCalendar(filteredTasks, filteredScheduledTasks) {
    const occurrences = getVisibleOccurrences(filteredTasks, []);
    elements.occurrenceCount.textContent = `${occurrences.length} occurrence${occurrences.length === 1 ? "" : "s"}`;

    if (state.currentView === "week") {
      renderWeekCalendar(occurrences, getVisibleRange().start);
    } else {
      renderMonthCalendar(occurrences);
    }

    renderSelectedDateAgenda(occurrences);
  }

  function renderViewButtons() {
    elements.viewButtons.forEach((button) => {
      const isActive = button.getAttribute("data-calendar-view") === state.currentView;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function renderTabState() {
    elements.tabButtons.forEach((button) => {
      const isActive = button.getAttribute("data-plan-tab") === state.currentTab;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    elements.tabPanels.forEach((panel) => {
      panel.hidden = panel.getAttribute("data-plan-panel") !== state.currentTab;
    });

    elements.createButton.hidden = state.currentTab !== "tasks";
  }

  function resetForm() {
    elements.form.reset();
    elements.form.elements.id.value = "";
    elements.form.elements.status.value = "Active";
    elements.form.elements.frequencyValue.value = "1";
    elements.form.elements.frequencyUnit.value = "days";
    state.editingTaskId = null;
  }

  function openModal(taskId = null) {
    resetForm();

    if (taskId) {
      const task = recurringTasks.find((item) => item.id === taskId);
      if (!task) {
        return;
      }

      state.editingTaskId = task.id;
      elements.modalTitle.textContent = `Edit ${task.id}`;
      elements.form.elements.id.value = task.id;
      elements.form.elements.title.value = task.title;
      elements.form.elements.owner.value = task.owner;
      elements.form.elements.lane.value = task.lane;
      elements.form.elements.status.value = task.status;
      elements.form.elements.frequencyValue.value = String(task.frequencyValue);
      elements.form.elements.frequencyUnit.value = task.frequencyUnit;
      elements.form.elements.startDate.value = task.startDate;
      elements.form.elements.time.value = task.time;
      elements.form.elements.duration.value = task.duration;
      elements.form.elements.area.value = task.area;
      elements.form.elements.description.value = task.description;
    } else {
      elements.modalTitle.textContent = "Create periodic task";
      elements.form.elements.startDate.value = state.cursorDate.toISOString().slice(0, 10);
      elements.form.elements.time.value = "08:00";
    }

    elements.modal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    elements.modal.hidden = true;
    if (elements.detailModal.hidden) {
      document.body.classList.remove("modal-open");
    }
    resetForm();
  }

  function createRecurringTaskId() {
    const maxNumber = recurringTasks.reduce((max, task) => {
      const numericPart = Number(task.id.replace("RP-", ""));
      return Number.isFinite(numericPart) ? Math.max(max, numericPart) : max;
    }, 200);
    return `RP-${maxNumber + 1}`;
  }

  function saveRecurringTask(formData) {
    const payload = {
      id: state.editingTaskId || createRecurringTaskId(),
      title: formData.get("title").trim(),
      owner: formData.get("owner").trim(),
      lane: formData.get("lane").trim(),
      status: formData.get("status"),
      frequencyValue: Number(formData.get("frequencyValue")),
      frequencyUnit: formData.get("frequencyUnit"),
      startDate: formData.get("startDate"),
      time: formData.get("time"),
      duration: formData.get("duration").trim(),
      area: formData.get("area").trim(),
      description: formData.get("description").trim(),
      color: state.editingTaskId
        ? recurringTasks.find((task) => task.id === state.editingTaskId)?.color || "blue"
        : ["blue", "green", "orange", "red"][recurringTasks.length % 4]
    };

    if (state.editingTaskId) {
      const index = recurringTasks.findIndex((task) => task.id === state.editingTaskId);
      if (index >= 0) {
        recurringTasks[index] = payload;
      }
      state.selectedTaskId = payload.id;
    } else {
      recurringTasks.unshift(payload);
      state.selectedTaskId = payload.id;
    }

    closeModal();
    renderAll();
  }

  function shiftRange(direction) {
    if (state.currentView === "week") {
      state.cursorDate.setDate(state.cursorDate.getDate() + direction * 7);
    } else {
      state.cursorDate.setMonth(state.cursorDate.getMonth() + direction);
    }
    renderAll();
  }

  function renderAll() {
    renderFilterOptions(elements.laneFilter, getUniqueValues("lane"), "All lanes");
    renderFilterOptions(elements.unitFilter, getUniqueValues("frequencyUnit"), "All cadences");
    elements.laneFilter.value = state.filters.lane;
    elements.unitFilter.value = state.filters.unit;
    elements.search.value = state.filters.search;
    elements.hidePaused.checked = state.filters.hidePaused;

    const filteredTasks = getFilteredTasks();
    const selectedTask = getSelectedTask(filteredTasks);
    state.selectedTaskId = selectedTask ? selectedTask.id : null;

    renderTabState();
    renderViewButtons();
    renderList(filteredTasks);
    renderCalendar(filteredTasks, []);
    setLastUpdated();
  }

  elements.laneFilter.addEventListener("change", (event) => {
    state.filters.lane = event.target.value;
    renderAll();
  });

  elements.unitFilter.addEventListener("change", (event) => {
    state.filters.unit = event.target.value;
    renderAll();
  });

  elements.search.addEventListener("input", (event) => {
    state.filters.search = event.target.value.trim();
    renderAll();
  });

  elements.hidePaused.addEventListener("change", (event) => {
    state.filters.hidePaused = event.target.checked;
    renderAll();
  });

  elements.viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.currentView = button.getAttribute("data-calendar-view");
      renderAll();
    });
  });

  elements.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.currentTab = button.getAttribute("data-plan-tab");
      renderAll();
    });
  });

  elements.shiftButtons.forEach((button) => {
    button.addEventListener("click", () => {
      shiftRange(Number(button.getAttribute("data-shift-range")));
    });
  });

  elements.todayButton.addEventListener("click", () => {
    state.cursorDate = new Date();
    state.selectedDateIso = getDateKey(state.cursorDate);
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

  elements.closeDetailModalButtons.forEach((button) => {
    button.addEventListener("click", closeRecurringDetailModal);
  });

  elements.detailModal.addEventListener("click", (event) => {
    if (event.target === elements.detailModal) {
      closeRecurringDetailModal();
    }
  });

  elements.closeOccurrenceModalButtons.forEach((button) => {
    button.addEventListener("click", closeOccurrenceModal);
  });

  elements.occurrenceModal.addEventListener("click", (event) => {
    if (event.target === elements.occurrenceModal) {
      closeOccurrenceModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.modal.hidden) {
      closeModal();
    } else if (event.key === "Escape" && !elements.detailModal.hidden) {
      closeRecurringDetailModal();
    } else if (event.key === "Escape" && !elements.occurrenceModal.hidden) {
      closeOccurrenceModal();
    }
  });

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveRecurringTask(new FormData(elements.form));
  });

  document.addEventListener("click", (event) => {
    const occurrenceCard = event.target.closest("[data-occurrence-key]");
    if (occurrenceCard) {
      const occurrences = getVisibleOccurrences(getFilteredTasks(), []);
      const occurrence = findOccurrenceByKey(occurrences, occurrenceCard.getAttribute("data-occurrence-key"));
      if (occurrence) {
        state.selectedDateIso = getDateKey(occurrence.date);
        renderAll();
        openOccurrenceModal(occurrence);
      }
      return;
    }

    const planDate = event.target.closest("[data-plan-date]");
    if (planDate) {
      state.selectedDateIso = planDate.getAttribute("data-plan-date");
      renderAll();
      return;
    }

    const relatedTemplateButton = event.target.closest("[data-open-related-template]");
    if (relatedTemplateButton) {
      closeOccurrenceModal();
      openRecurringDetailModal(relatedTemplateButton.getAttribute("data-open-related-template"));
      return;
    }

    const taskCard = event.target.closest("[data-recurring-task-id]");
    if (taskCard) {
      state.selectedTaskId = taskCard.getAttribute("data-recurring-task-id");
      renderAll();
      openRecurringDetailModal(state.selectedTaskId);
      return;
    }

    const editButton = event.target.closest("[data-edit-recurring]");
    if (editButton) {
      closeRecurringDetailModal();
      openModal(editButton.getAttribute("data-edit-recurring"));
    }
  });

  renderAll();
}
