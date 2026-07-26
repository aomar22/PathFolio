lucide.createIcons();

// Sample project data
const projects = [
  {
    id: 1,
    title: "Smart Attendance Tracker",
    category: "web",
    categoryLabel: "Web Development",
    technologies: ["Node.js", "MongoDB", "Express", "REST API"],
    reflectionStatus: "complete",
    reflectionProgress: 100,
    portfolioReady: true,
    portfolioProgress: 90,
    skills: ["Backend Development", "Database Design", "Problem Solving"],
    thumb: "thumb-web",
    updated: "Jul 24, 2026",
    action: "View Project",
  },
  {
    id: 2,
    title: "Inventory Control API",
    category: "web",
    categoryLabel: "API Development",
    technologies: ["Express", "JWT", "MongoDB"],
    reflectionStatus: "in-progress",
    reflectionProgress: 70,
    portfolioReady: false,
    portfolioProgress: 45,
    skills: ["Authentication", "API Design", "Database"],
    thumb: "thumb-mobile",
    updated: "Jul 23, 2026",
    action: "Continue Reflection",
  },
  {
    id: 3,
    title: "Portfolio CMS",
    category: "web",
    categoryLabel: "Frontend Development",
    technologies: ["React", "Supabase"],
    reflectionStatus: "complete",
    reflectionProgress: 100,
    portfolioReady: true,
    portfolioProgress: 88,
    skills: ["Frontend Dev", "State Management", "UI/UX"],
    thumb: "thumb-database",
    updated: "Jul 22, 2026",
    action: "Review AI Suggestions",
  },
  {
    id: 4,
    title: "Data Visualization App",
    category: "data",
    categoryLabel: "Data and Analytics",
    technologies: ["D3.js", "REST API", "JavaScript"],
    reflectionStatus: "needs",
    reflectionProgress: 35,
    portfolioReady: false,
    portfolioProgress: 20,
    skills: ["Data Analysis", "Visualization"],
    thumb: "thumb-cloud",
    updated: "Jul 21, 2026",
    action: "Start Reflection",
  },
  {
    id: 5,
    title: "Azure Deployment Lab",
    category: "cloud",
    categoryLabel: "Cloud and DevOps",
    technologies: ["Azure", "Docker", "GitHub Actions"],
    reflectionStatus: "complete",
    reflectionProgress: 100,
    portfolioReady: true,
    portfolioProgress: 92,
    skills: ["DevOps", "Cloud", "CI/CD"],
    thumb: "thumb-ux",
    updated: "Jul 20, 2026",
    action: "View Project",
  },
  {
    id: 6,
    title: "Mobile Coffee Ordering Redesign",
    category: "ux",
    categoryLabel: "UI/UX Design",
    technologies: ["Figma", "Wireframing", "Prototyping"],
    reflectionStatus: "complete",
    reflectionProgress: 100,
    portfolioReady: true,
    portfolioProgress: 85,
    skills: ["UI Design", "Prototyping", "User Research"],
    thumb: "thumb-data",
    updated: "Jul 19, 2026",
    action: "View Project",
  },
];

// State
let filteredProjects = [...projects];
let currentView = "grid";
let currentFilters = {
  search: "",
  status: "",
  category: "",
  sort: "updated",
};

// DOM Elements
const projectsContainer = document.getElementById("projectsContainer");
const emptyState = document.getElementById("emptyState");
const noResultsState = document.getElementById("noResultsState");
const addProjectBtn = document.getElementById("addProjectBtn");
const emptyStateBtn = document.getElementById("emptyStateBtn");
const addProjectModal = document.getElementById("addProjectModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const addProjectForm = document.getElementById("addProjectForm");
const projectSearch = document.getElementById("projectSearch");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const clearFilters = document.getElementById("clearFilters");
const viewBtns = document.querySelectorAll(".view-btn");
const noResultsClearBtn = document.getElementById("noResultsClearBtn");

// Modal handlers
addProjectBtn.addEventListener("click", () => {
  addProjectModal.style.display = "grid";
});

emptyStateBtn.addEventListener("click", () => {
  addProjectModal.style.display = "grid";
});

closeModal.addEventListener("click", closeProjectModal);
cancelBtn.addEventListener("click", closeProjectModal);

function closeProjectModal() {
  addProjectModal.style.display = "none";
  addProjectForm.reset();
}

addProjectModal.addEventListener("click", (e) => {
  if (e.target === addProjectModal) closeProjectModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && addProjectModal.style.display === "grid") {
    closeProjectModal();
  }
});

// Form submission
addProjectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProject = {
    id: projects.length + 1,
    title: document.getElementById("projectTitle").value,
    category: document.getElementById("projectType").value,
    categoryLabel: getCategoryLabel(document.getElementById("projectType").value),
    technologies: document.getElementById("projectTech").value.split(",").map((t) => t.trim()),
    reflectionStatus: "needs",
    reflectionProgress: 0,
    portfolioReady: false,
    portfolioProgress: 0,
    skills: [],
    thumb: "thumb-web",
    updated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    action: "Start Reflection",
  };
  projects.unshift(newProject);
  filteredProjects = filterAndSortProjects([...projects]);
  renderProjects();
  closeProjectModal();
});

function getCategoryLabel(cat) {
  const labels = {
    web: "Web Development",
    mobile: "Mobile Development",
    database: "Database",
    cloud: "Cloud and DevOps",
    ux: "UI/UX",
    data: "Data and Analytics",
  };
  return labels[cat] || cat;
}

// Filter and search
projectSearch.addEventListener("input", () => {
  currentFilters.search = projectSearch.value.toLowerCase();
  filteredProjects = filterAndSortProjects([...projects]);
  renderProjects();
});

statusFilter.addEventListener("change", () => {
  currentFilters.status = statusFilter.value;
  filteredProjects = filterAndSortProjects([...projects]);
  renderProjects();
});

categoryFilter.addEventListener("change", () => {
  currentFilters.category = categoryFilter.value;
  filteredProjects = filterAndSortProjects([...projects]);
  renderProjects();
});

sortFilter.addEventListener("change", () => {
  currentFilters.sort = sortFilter.value;
  filteredProjects = filterAndSortProjects([...projects]);
  renderProjects();
});

clearFilters.addEventListener("click", () => {
  projectSearch.value = "";
  statusFilter.value = "";
  categoryFilter.value = "";
  sortFilter.value = "updated";
  currentFilters = {
    search: "",
    status: "",
    category: "",
    sort: "updated",
  };
  filteredProjects = [...projects];
  renderProjects();
});

noResultsClearBtn.addEventListener("click", clearFilters.click);

// View toggle
viewBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    viewBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentView = btn.dataset.view;
    projectsContainer.classList.toggle("list-view", currentView === "list");
  });
});

// Filter and sort logic
function filterAndSortProjects(projectList) {
  let filtered = projectList;

  if (currentFilters.search) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(currentFilters.search) ||
        p.technologies.some((t) => t.toLowerCase().includes(currentFilters.search)) ||
        p.skills.some((s) => s.toLowerCase().includes(currentFilters.search))
    );
  }

  if (currentFilters.status) {
    filtered = filtered.filter((p) => p.reflectionStatus === currentFilters.status);
  }

  if (currentFilters.category) {
    filtered = filtered.filter((p) => p.category === currentFilters.category);
  }

  // Sort
  if (currentFilters.sort === "newest") {
    filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
  } else if (currentFilters.sort === "oldest") {
    filtered.sort((a, b) => new Date(a.updated) - new Date(b.updated));
  } else if (currentFilters.sort === "completion") {
    filtered.sort((a, b) => b.reflectionProgress - a.reflectionProgress);
  } else if (currentFilters.sort === "portfolio") {
    filtered.sort((a, b) => b.portfolioProgress - a.portfolioProgress);
  }

  return filtered;
}

// Render projects
function renderProjects() {
  projectsContainer.innerHTML = "";

  if (filteredProjects.length === 0) {
    if (projects.length === 0) {
      emptyState.style.display = "flex";
      noResultsState.style.display = "none";
    } else {
      emptyState.style.display = "none";
      noResultsState.style.display = "flex";
    }
    return;
  }

  emptyState.style.display = "none";
  noResultsState.style.display = "none";

  filteredProjects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card glass-card";

    const statusBadges = getStatusBadges(project);
    const techDisplay = project.technologies.slice(0, 3);
    const techMore = project.technologies.length > 3 ? project.technologies.length - 3 : 0;
    const skillsDisplay = project.skills.slice(0, 3);
    const skillsMore = project.skills.length > 3 ? project.skills.length - 3 : 0;

    card.innerHTML = `
      <div class="project-thumb ${project.thumb}"></div>
      <div class="project-main">
        <div class="project-head">
          <h3 class="project-title">${project.title}</h3>
          <button class="project-menu-btn" aria-label="Project menu">
            <i data-lucide="more-vertical"></i>
          </button>
        </div>
        <div class="project-meta">
          <span class="project-category">${project.categoryLabel}</span>
          <span>${project.updated}</span>
        </div>
        <div class="project-tech">
          ${techDisplay.map((t) => `<span class="tech-chip">${t}</span>`).join("")}
          ${techMore > 0 ? `<span class="tech-chip more">+${techMore} more</span>` : ""}
        </div>
        <div class="project-skills">
          ${skillsDisplay.map((s) => `<span class="skill-chip">${s}</span>`).join("")}
          ${skillsMore > 0 ? `<span class="skill-chip more">+${skillsMore} more</span>` : ""}
        </div>
        <div class="project-progress">
          <div class="progress-label">
            <span>Reflection: ${project.reflectionProgress}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${project.reflectionProgress}%"></div>
          </div>
        </div>
        <div class="project-badges">
          ${statusBadges.map((badge) => `<span class="badge ${badge.class}">${badge.label}</span>`).join("")}
        </div>
        <button class="project-action">${project.action}</button>
      </div>
    `;

    projectsContainer.appendChild(card);

    // Menu button
    const menuBtn = card.querySelector(".project-menu-btn");
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showActionMenu(e, project);
    });

    lucide.createIcons();
  });
}

function getStatusBadges(project) {
  const badges = [];
  if (project.reflectionStatus === "complete") {
    badges.push({ label: "Reflection Complete", class: "success" });
  } else if (project.reflectionStatus === "in-progress") {
    badges.push({ label: "Reflection In Progress", class: "warning" });
  } else if (project.reflectionStatus === "needs") {
    badges.push({ label: "Needs Reflection", class: "warning" });
  }

  if (Math.random() > 0.5 && project.reflectionStatus === "complete") {
    badges.push({ label: "AI Reviewed", class: "info" });
  }

  if (project.portfolioReady) {
    badges.push({ label: "Portfolio Ready", class: "success" });
  }

  return badges;
}

// Action menu
function showActionMenu(e, project) {
  const template = document.getElementById("actionMenuTemplate");
  const menu = template.cloneNode(true);
  menu.style.display = "block";
  menu.style.position = "absolute";
  menu.style.zIndex = "999";

  const rect = e.target.getBoundingClientRect();
  menu.style.top = rect.bottom + 5 + "px";
  menu.style.left = rect.left - 140 + "px";

  document.body.appendChild(menu);

  menu.querySelectorAll(".action-item").forEach((item) => {
    item.addEventListener("click", () => {
      const action = item.dataset.action;
      handleAction(action, project);
      menu.remove();
    });
  });

  document.addEventListener("click", () => {
    menu.remove();
  }, { once: true });
}

function handleAction(action, project) {
  console.log(`Action: ${action}, Project: ${project.title}`);
  // Frontend-only interactions
}

// Initial render
renderProjects();
