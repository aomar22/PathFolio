const STORAGE_KEY = "pathfolio-reflections-log";

const defaultEntries = [
  {
    id: "smart-attendance-technical-learning",
    title: "Technical Learning",
    project: "Smart Attendance Tracker",
    projectType: "Backend",
    status: "Completed",
    updated: "Jul 24, 2026",
    updatedAt: "2026-07-24",
    projectId: "smart-attendance-tracker",
    github: true,
    liveDemo: true,
    uploadedFiles: true,
    reflection:
      "I learned how to connect a Node.js backend to MongoDB while handling student attendance records reliably. The most valuable takeaway was structuring API routes clearly and validating incoming data before saving it to the database.",
  },
  {
    id: "inventory-api-career-reflection",
    title: "Career Reflection",
    project: "Inventory Control API",
    projectType: "Backend",
    status: "Draft",
    updated: "Jul 25, 2026",
    updatedAt: "2026-07-25",
    projectId: "inventory-control-api",
    github: true,
    liveDemo: false,
    uploadedFiles: true,
    reflection:
      "This project helped me understand how backend API design connects directly to real business workflows such as tracking stock, updating quantities, and handling validation. I still need to improve how I explain my decisions around route structure and error handling.",
  },
  {
    id: "portfolio-cms-problem-solving",
    title: "Problem Solving",
    project: "Portfolio CMS",
    projectType: "Frontend",
    status: "Completed",
    updated: "Jul 22, 2026",
    updatedAt: "2026-07-22",
    projectId: "portfolio-cms",
    github: true,
    liveDemo: true,
    uploadedFiles: true,
    reflection:
      "The main challenge was organizing content blocks in a way that stayed flexible without making the UI confusing. I solved this by separating editing controls from preview controls and keeping the data model simple enough to extend later.",
  },
  {
    id: "data-visualization-skills-reflection",
    title: "Skills Reflection",
    project: "Data Visualization App",
    projectType: "Data",
    status: "In Progress",
    updated: "Jul 19, 2026",
    updatedAt: "2026-07-19",
    projectId: "data-visualization-app",
    github: true,
    liveDemo: true,
    uploadedFiles: false,
    reflection:
      "This project is helping me build stronger data storytelling and frontend communication skills. I have identified progress in working with API data and chart rendering, but I still need to reflect more clearly on how I handled data transformation and presentation choices.",
  },
];

let entries = [];
let filteredEntries = [];
let editingEntryId = "";

const reflectionsTableBody = document.getElementById("reflectionsTableBody");
const reflectionSearch = document.getElementById("reflectionLibrarySearch");
const reflectionCountChip = document.getElementById("reflectionCountChip");
const headerReflectionCount = document.getElementById("headerReflectionCount");
const projectFilter = document.getElementById("projectFilter");
const statusFilter = document.getElementById("statusFilter");
const sortFilter = document.getElementById("sortFilter");
const totalReflectionsCount = document.getElementById("totalReflectionsCount");
const completedReflectionsCount = document.getElementById("completedReflectionsCount");
const draftReflectionsCount = document.getElementById("draftReflectionsCount");
const projectsReflectedCount = document.getElementById("projectsReflectedCount");
const emptyStateCard = document.getElementById("emptyStateCard");
const viewerCard = document.getElementById("viewerCard");
const viewerTitle = document.getElementById("viewerTitle");
const viewerStatusChip = document.getElementById("viewerStatusChip");
const viewerProject = document.getElementById("viewerProject");
const viewerUpdated = document.getElementById("viewerUpdated");
const viewerContent = document.getElementById("viewerContent");
const closeViewerBtn = document.getElementById("closeViewerBtn");
const editorCard = document.getElementById("editorCard");
const editorTitle = document.getElementById("editorTitle");
const editorStatusChip = document.getElementById("editorStatusChip");
const reflectionEditor = document.getElementById("reflectionEditor");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const toastWrap = document.getElementById("toastWrap");
let openMenuId = "";

const showToast = (message) => {
  if (!toastWrap) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastWrap.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2200);
};

const saveEntries = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

const normalizeEntry = (entry, fallbackIndex = 0) => {
  const fallback = defaultEntries[fallbackIndex % defaultEntries.length];
  return {
    ...fallback,
    ...entry,
    id: entry?.id || fallback.id,
    title: entry?.title || fallback.title,
    project: entry?.project || fallback.project,
    projectType: entry?.projectType || fallback.projectType || "Project",
    status: entry?.status || fallback.status,
    updated: entry?.updated || fallback.updated,
    updatedAt: entry?.updatedAt || fallback.updatedAt,
    projectId: entry?.projectId || fallback.projectId,
    github: typeof entry?.github === "boolean" ? entry.github : fallback.github,
    liveDemo: typeof entry?.liveDemo === "boolean" ? entry.liveDemo : fallback.liveDemo,
    uploadedFiles: typeof entry?.uploadedFiles === "boolean" ? entry.uploadedFiles : fallback.uploadedFiles,
    reflection: entry?.reflection || fallback.reflection,
  };
};

const getStatusChipClass = (status) => {
  if (status === "Completed") {
    return "success";
  }
  if (status === "Draft") {
    return "neutral";
  }
  return "blue";
};

const loadEntries = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    entries = [...defaultEntries];
    saveEntries();
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      entries = [...defaultEntries];
      saveEntries();
      return;
    }

    entries = parsed.map((entry, index) => normalizeEntry(entry, index));
    saveEntries();
  } catch (error) {
    entries = [...defaultEntries];
    saveEntries();
  }
};

const updateSummaryCards = () => {
  const total = entries.length;
  const completed = entries.filter((entry) => entry.status === "Completed").length;
  const drafts = entries.filter((entry) => entry.status === "Draft" || entry.status === "In Progress").length;
  const uniqueProjects = new Set(entries.map((entry) => entry.project)).size;

  if (totalReflectionsCount) totalReflectionsCount.textContent = `${total}`;
  if (completedReflectionsCount) completedReflectionsCount.textContent = `${completed}`;
  if (draftReflectionsCount) draftReflectionsCount.textContent = `${drafts}`;
  if (projectsReflectedCount) projectsReflectedCount.textContent = `${uniqueProjects}`;
  if (headerReflectionCount) headerReflectionCount.textContent = `${total} Reflections`;
};

const populateProjectFilter = () => {
  if (!projectFilter) {
    return;
  }

  const selected = projectFilter.value;
  const projects = [...new Set(entries.map((entry) => entry.project))].sort((a, b) => a.localeCompare(b));
  projectFilter.innerHTML = '<option value="">All Projects</option>';
  projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project;
    option.textContent = project;
    projectFilter.appendChild(option);
  });
  projectFilter.value = selected;
};

const renderEmptyState = () => {
  const hasEntries = filteredEntries.length > 0;
  if (emptyStateCard) {
    if (hasEntries) emptyStateCard.setAttribute("hidden", "hidden");
    else emptyStateCard.removeAttribute("hidden");
  }
};

const renderTable = () => {
  if (!reflectionsTableBody) {
    return;
  }

  reflectionsTableBody.innerHTML = "";

  filteredEntries.forEach((entry) => {
    const row = document.createElement("tr");
    const moreMenu = [];
    if (entry.status !== "Completed") {
      moreMenu.push('<button class="log-menu-item" data-action="continue" data-entry-id="' + entry.id + '">Continue in AI Reflection Workspace</button>');
    }
    moreMenu.push('<button class="log-menu-item" data-action="project" data-entry-id="' + entry.id + '">Open Project</button>');
    if (entry.github) {
      moreMenu.push('<button class="log-menu-item" data-action="github" data-entry-id="' + entry.id + '">View GitHub</button>');
    }
    if (entry.liveDemo) {
      moreMenu.push('<button class="log-menu-item" data-action="demo" data-entry-id="' + entry.id + '">Live Demo</button>');
    }
    if (entry.uploadedFiles) {
      moreMenu.push('<button class="log-menu-item" data-action="files" data-entry-id="' + entry.id + '">Uploaded Files</button>');
    }
    moreMenu.push('<button class="log-menu-item danger" data-action="delete" data-entry-id="' + entry.id + '">Delete Reflection</button>');

    row.innerHTML = `
      <td>
        <p class="log-reflection-title">${entry.title}</p>
        <p class="log-reflection-preview">${entry.reflection.slice(0, 90)}${entry.reflection.length > 90 ? "..." : ""}</p>
      </td>
      <td>
        <p class="log-project-name">${entry.project}</p>
        <span class="project-type-badge">${entry.projectType}</span>
      </td>
      <td>${entry.updated}</td>
      <td><span class="chip ${getStatusChipClass(entry.status)}">${entry.status}</span></td>
      <td>
        <div class="log-actions-wrap">
          <button class="log-primary-action" data-action="view" data-entry-id="${entry.id}">View</button>
          <button class="log-primary-action" data-action="edit" data-entry-id="${entry.id}">Edit</button>
          <button class="log-menu-trigger" data-more-toggle="${entry.id}" aria-label="More actions">
            <i data-lucide="ellipsis"></i>
          </button>
          <div class="log-more-menu" data-more-menu="${entry.id}" hidden>
            ${moreMenu.join("")}
          </div>
        </div>
      </td>
    `;
    reflectionsTableBody.appendChild(row);
  });

  if (reflectionCountChip) {
    reflectionCountChip.textContent = `${filteredEntries.length} Reflections`;
  }

  renderEmptyState();

  const allMenus = document.querySelectorAll("[data-more-menu]");
  allMenus.forEach((menu) => {
    if (menu.getAttribute("data-more-menu") === openMenuId) {
      menu.removeAttribute("hidden");
    } else {
      menu.setAttribute("hidden", "hidden");
    }
  });

  document.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const entryId = btn.getAttribute("data-entry-id") || "";
      const action = btn.getAttribute("data-action") || "";
      handleEntryAction(action, entryId);
    });
  });

  document.querySelectorAll("[data-more-toggle]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const menuId = btn.getAttribute("data-more-toggle") || "";
      openMenuId = openMenuId === menuId ? "" : menuId;
      renderTable();
    });
  });

  lucide.createIcons();
};

const applyFilters = () => {
  const query = (reflectionSearch?.value || "").trim().toLowerCase();
  const projectValue = projectFilter?.value || "";
  const statusValue = statusFilter?.value || "";
  const sortValue = sortFilter?.value || "updated-desc";

  filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.project.toLowerCase().includes(query) ||
      entry.title.toLowerCase().includes(query) ||
      entry.reflection.toLowerCase().includes(query);
    const matchesProject = !projectValue || entry.project === projectValue;
    const matchesStatus = !statusValue || entry.status === statusValue;
    return matchesSearch && matchesProject && matchesStatus;
  });

  filteredEntries.sort((left, right) => {
    if (sortValue === "updated-asc") return left.updatedAt.localeCompare(right.updatedAt);
    if (sortValue === "title-asc") return left.title.localeCompare(right.title);
    if (sortValue === "project-asc") return left.project.localeCompare(right.project);
    return right.updatedAt.localeCompare(left.updatedAt);
  });

  renderTable();
};

const openViewer = (entryId) => {
  const entry = entries.find((item) => item.id === entryId);
  if (!entry || !viewerCard || !viewerTitle || !viewerStatusChip || !viewerProject || !viewerUpdated || !viewerContent) {
    return;
  }

  viewerTitle.textContent = entry.title;
  viewerStatusChip.textContent = entry.status;
  viewerStatusChip.className = `chip ${getStatusChipClass(entry.status)}`;
  viewerProject.textContent = `Project: ${entry.project}`;
  viewerUpdated.textContent = `Last Updated: ${entry.updated}`;
  viewerContent.textContent = entry.reflection;
  viewerCard.removeAttribute("hidden");
};

const openEditor = (entryId) => {
  const entry = entries.find((item) => item.id === entryId);
  if (!entry || !editorCard || !editorTitle || !editorStatusChip || !reflectionEditor) {
    return;
  }

  editingEntryId = entryId;
  editorTitle.textContent = `Edit Reflection - ${entry.title}`;
  editorStatusChip.textContent = entry.status;
  editorStatusChip.className = `chip ${getStatusChipClass(entry.status)}`;
  reflectionEditor.value = entry.reflection;
  editorCard.removeAttribute("hidden");
  reflectionEditor.focus();
};

const closeViewer = () => {
  if (viewerCard) {
    viewerCard.setAttribute("hidden", "hidden");
  }
};

const closeEditor = () => {
  editingEntryId = "";
  if (editorCard) {
    editorCard.setAttribute("hidden", "hidden");
  }
};

const closeMenus = () => {
  if (!openMenuId) {
    return;
  }
  openMenuId = "";
  renderTable();
};

const saveCurrentEdit = () => {
  if (!editingEntryId || !reflectionEditor) {
    return;
  }

  const entry = entries.find((item) => item.id === editingEntryId);
  if (!entry) {
    return;
  }

  entry.reflection = reflectionEditor.value.trim();
  entry.status = entry.reflection ? "Completed" : "Draft";
  entry.updated = "Jul 27, 2026";
  entry.updatedAt = "2026-07-27";

  saveEntries();
  updateSummaryCards();
  populateProjectFilter();
  applyFilters();
  closeEditor();
  showToast("Reflection updated");
};

const handleEntryAction = (action, entryId) => {
  const entry = entries.find((item) => item.id === entryId);
  if (!entry) {
    return;
  }

  if (action === "view") {
    openViewer(entryId);
    return;
  }

  if (action === "edit") {
    openEditor(entryId);
    return;
  }

  if (action === "continue") {
    window.location.href = `ai-reflection-guide.html?project=${encodeURIComponent(entry.projectId)}`;
    return;
  }

  if (action === "project") {
    window.location.href = "projects.html";
    return;
  }

  if (action === "github") {
    showToast("GitHub link opened");
    return;
  }

  if (action === "demo") {
    showToast("Live demo opened");
    return;
  }

  if (action === "files") {
    showToast("Uploaded files opened");
    return;
  }

  if (action === "delete") {
    entries = entries.filter((item) => item.id !== entryId);
    saveEntries();
    updateSummaryCards();
    populateProjectFilter();
    applyFilters();
    closeViewer();
    closeEditor();
    showToast("Reflection deleted");
  }
};

const autoOpenFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const requestedProject = (params.get("project") || "").trim().toLowerCase();
  if (!requestedProject) {
    return;
  }

  const match = entries.find((entry) => entry.project.toLowerCase().includes(requestedProject));
  if (match) {
    openViewer(match.id);
  }
};

loadEntries();
filteredEntries = [...entries];
updateSummaryCards();
populateProjectFilter();
applyFilters();
autoOpenFromQuery();

if (reflectionSearch) {
  reflectionSearch.addEventListener("input", applyFilters);
}

if (projectFilter) {
  projectFilter.addEventListener("change", applyFilters);
}

if (statusFilter) {
  statusFilter.addEventListener("change", applyFilters);
}

if (sortFilter) {
  sortFilter.addEventListener("change", applyFilters);
}

if (saveEditBtn) {
  saveEditBtn.addEventListener("click", saveCurrentEdit);
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", closeEditor);
}

if (closeViewerBtn) {
  closeViewerBtn.addEventListener("click", closeViewer);
}

document.addEventListener("click", () => {
  closeMenus();
});
