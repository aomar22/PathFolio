"use strict";

/* =========================================================
   PathFolio Skills Page
   Document → Reflect → Grow → Build → Showcase
   ========================================================= */

/* ---------------------------------------------------------
   Skills data
   --------------------------------------------------------- */

const skills = [
  {
    id: 1,
    name: "REST API Development",
    category: "technical",
    categoryLabel: "Technical",
    level: "Advanced",
    levelKey: "advanced",
    description:
      "Ability to design, build, test, and document RESTful APIs that allow applications to communicate with each other.",
    projects: [
      "Scholarly Peer Tutoring Platform",
      "Fintech Secure Application"
    ],
    suggestion:
      "Build an API with authentication, validation, error handling, pagination, and clear endpoint documentation."
  },
  {
    id: 2,
    name: "JavaScript",
    category: "technical",
    categoryLabel: "Technical",
    level: "Advanced",
    levelKey: "advanced",
    description:
      "Ability to use JavaScript to create interactive interfaces, manage application behaviour, and work with data in the browser.",
    projects: [
      "PathFolio MVP",
      "Scholarly Peer Tutoring Platform",
      "Tim Hortons App Redesign Prototype"
    ],
    suggestion:
      "Continue practising modular JavaScript, DOM manipulation, asynchronous functions, validation, and error handling."
  },
  {
    id: 3,
    name: "Cloud Deployment",
    category: "technical",
    categoryLabel: "Technical",
    level: "Intermediate",
    levelKey: "intermediate",
    description:
      "Ability to configure cloud resources and deploy applications using services such as Microsoft Azure.",
    projects: [
      "Azure Container Apps Assignment",
      "Azure DevOps Release Gates"
    ],
    suggestion:
      "Deploy another containerized application and document the architecture, security settings, monitoring, and deployment process."
  },
  {
    id: 4,
    name: "Database Design",
    category: "technical",
    categoryLabel: "Technical",
    level: "Intermediate",
    levelKey: "intermediate",
    description:
      "Ability to organize application data using tables, relationships, constraints, and efficient queries.",
    projects: [
      "Scholarly Peer Tutoring Platform",
      "Fintech Secure Application"
    ],
    suggestion:
      "Practise designing a normalized database and explain why each relationship, key, and constraint is needed."
  },
  {
    id: 5,
    name: "UI/UX Design",
    category: "technical",
    categoryLabel: "Technical",
    level: "Intermediate",
    levelKey: "intermediate",
    description:
      "Ability to improve digital experiences by understanding user needs, task flows, usability principles, and interface design.",
    projects: [
      "Tim Hortons Mobile App Redesign",
      "Public Library Study Space App"
    ],
    suggestion:
      "Run a small usability test and use the findings to improve one task flow in your current design."
  },
  {
    id: 6,
    name: "Team Collaboration",
    category: "professional",
    categoryLabel: "Professional",
    level: "Advanced",
    levelKey: "advanced",
    description:
      "Ability to coordinate responsibilities, communicate with team members, support decisions, and contribute to shared project goals.",
    projects: [
      "PathFolio Venture Project",
      "Scholarly Capstone Project",
      "Public Library UX Project"
    ],
    suggestion:
      "Continue documenting specific examples of how you coordinated tasks, resolved issues, and supported team progress."
  },
  {
    id: 7,
    name: "Technical Communication",
    category: "professional",
    categoryLabel: "Professional",
    level: "Beginner",
    levelKey: "beginner",
    description:
      "Ability to explain technical ideas clearly through reports, presentations, documentation, and demonstrations.",
    projects: [
      "Azure Compute Options Presentation"
    ],
    suggestion:
      "Practise explaining one technical topic in simple language using a diagram, a real example, and a short recommendation."
  },
  {
    id: 8,
    name: "Project Estimation",
    category: "professional",
    categoryLabel: "Professional",
    level: "Beginner",
    levelKey: "beginner",
    description:
      "Ability to estimate the time, effort, resources, and risks involved in completing project tasks.",
    projects: [],
    suggestion:
      "Break a small project into tasks, estimate each task, track the actual time, and compare the results with your original estimate."
  }
];

/* ---------------------------------------------------------
   Page state
   --------------------------------------------------------- */

const state = {
  searchTerm: "",
  selectedCategory: "all",
  selectedSkillId: null
};

/* ---------------------------------------------------------
   DOM references
   --------------------------------------------------------- */

const elements = {};

function cacheElements() {
  elements.skillsGrid = document.getElementById("skillsGrid");
  elements.skillsResultsChip = document.getElementById(
    "skillsResultsChip"
  );
  elements.skillsEmptyState = document.getElementById(
    "skillsEmptyState"
  );
  elements.skillsToImproveList = document.getElementById(
    "skillsToImproveList"
  );

  elements.technicalSkillsCount = document.getElementById(
    "technicalSkillsCount"
  );
  elements.professionalSkillsCount = document.getElementById(
    "professionalSkillsCount"
  );
  elements.strongestSkillsCount = document.getElementById(
    "strongestSkillsCount"
  );
  elements.skillsToImproveCount = document.getElementById(
    "skillsToImproveCount"
  );

  elements.detailsPanel = document.getElementById("detailsPanel");
  elements.detailsOverlay = document.getElementById(
    "detailsOverlay"
  );
  elements.detailsTitle = document.getElementById("detailsTitle");
  elements.detailsCategoryChip = document.getElementById(
    "detailsCategoryChip"
  );
  elements.detailsLevelChip = document.getElementById(
    "detailsLevelChip"
  );
  elements.detailsDescription = document.getElementById(
    "detailsDescription"
  );
  elements.detailsProjects = document.getElementById(
    "detailsProjects"
  );
  elements.detailsSuggestion = document.getElementById(
    "detailsSuggestion"
  );

  /*
   * These controls were not included in the provided ID list.
   * The alternatives allow this file to work with common names
   * without requiring HTML changes.
   */
  elements.searchInput =
    document.getElementById("skillsSearch") ||
    document.getElementById("skillsSearchInput") ||
    document.getElementById("searchSkills");

  elements.categoryFilter =
    document.getElementById("skillsCategoryFilter") ||
    document.getElementById("categoryFilter") ||
    document.getElementById("skillsFilter");

  elements.refreshButton =
    document.getElementById("refreshSkills") ||
    document.getElementById("skillsRefreshButton") ||
    document.getElementById("refreshButton");

  elements.closeDetailsButton =
    document.getElementById("closeDetails") ||
    document.getElementById("detailsCloseButton") ||
    document.querySelector(
      "[data-action='close-details'], .details-close"
    );

  elements.toast =
    document.getElementById("toast") ||
    document.getElementById("skillsToast");
}

/* ---------------------------------------------------------
   Utility helpers
   --------------------------------------------------------- */

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function refreshIcons() {
  if (
    window.lucide &&
    typeof window.lucide.createIcons === "function"
  ) {
    window.lucide.createIcons();
  }
}

function getSkillById(skillId) {
  return skills.find((skill) => skill.id === skillId) || null;
}

function getBeginnerSkills() {
  return skills.filter((skill) => skill.levelKey === "beginner");
}

/* ---------------------------------------------------------
   Toast
   --------------------------------------------------------- */

let toastTimer = null;

function showToast(message) {
  if (!elements.toast) {
    return;
  }

  window.clearTimeout(toastTimer);

  const toastMessage =
    elements.toast.querySelector(
      "[data-toast-message], .toast-message"
    ) || elements.toast;

  toastMessage.textContent = message;

  elements.toast.hidden = false;
  elements.toast.classList.add("show", "is-visible");
  elements.toast.setAttribute("aria-hidden", "false");

  toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("show", "is-visible");
    elements.toast.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
      if (
        !elements.toast.classList.contains("show") &&
        !elements.toast.classList.contains("is-visible")
      ) {
        elements.toast.hidden = true;
      }
    }, 250);
  }, 2500);
}

/* ---------------------------------------------------------
   Filtering
   --------------------------------------------------------- */

function getVisibleSkills() {
  const normalizedSearch = state.searchTerm.trim().toLowerCase();

  return skills.filter((skill) => {
    const matchesCategory =
      state.selectedCategory === "all" ||
      skill.category === state.selectedCategory;

    const searchableText = [
      skill.name,
      skill.category,
      skill.categoryLabel,
      skill.level,
      skill.description,
      skill.suggestion,
      ...skill.projects
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      normalizedSearch === "" ||
      searchableText.includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
}

/* ---------------------------------------------------------
   Summary cards
   --------------------------------------------------------- */

function renderSummaryCards() {
  const technicalCount = skills.filter(
    (skill) => skill.category === "technical"
  ).length;

  const professionalCount = skills.filter(
    (skill) => skill.category === "professional"
  ).length;

  const strongestCount = skills.filter(
    (skill) => skill.levelKey === "advanced"
  ).length;

  const improveCount = getBeginnerSkills().length;

  if (elements.technicalSkillsCount) {
    elements.technicalSkillsCount.textContent = technicalCount;
  }

  if (elements.professionalSkillsCount) {
    elements.professionalSkillsCount.textContent =
      professionalCount;
  }

  if (elements.strongestSkillsCount) {
    elements.strongestSkillsCount.textContent = strongestCount;
  }

  if (elements.skillsToImproveCount) {
    elements.skillsToImproveCount.textContent = improveCount;
  }
}

/* ---------------------------------------------------------
   Skills table
   --------------------------------------------------------- */

function createSkillRow(skill) {
  const row = document.createElement("button");

  row.type = "button";
  row.className = "skills-list-row";
  row.setAttribute("role", "row");
  row.setAttribute(
    "aria-label",
    `View details for ${skill.name}`
  );

  const projectCount = Array.isArray(skill.projects)
    ? skill.projects.length
    : 0;

  row.innerHTML = `
    <span class="skills-col skills-col-name" role="cell">
      ${escapeHtml(skill.name)}
    </span>

    <span class="skills-col" role="cell">
      ${escapeHtml(skill.categoryLabel)}
    </span>

    <span class="skills-col" role="cell">
      <span class="chip skill-level-${escapeHtml(
        skill.levelKey
      )}">
        ${escapeHtml(skill.level)}
      </span>
    </span>

    <span class="skills-col" role="cell">
      ${projectCount}
      ${projectCount === 1 ? "Project" : "Projects"}
    </span>

    <span
      class="skills-col skills-col-action"
      role="cell"
    >
      <span class="skill-row-action">
        View Details
        <i
          data-lucide="chevron-right"
          aria-hidden="true"
        ></i>
      </span>
    </span>
  `;

  row.addEventListener("click", () => {
    openDetails(skill.id);
  });

  return row;
}

function renderSkills() {
  const visibleSkills = getVisibleSkills();

  if (elements.skillsResultsChip) {
    elements.skillsResultsChip.textContent = `${
      visibleSkills.length
    } ${visibleSkills.length === 1 ? "Skill" : "Skills"}`;
  }

  if (elements.skillsGrid) {
    elements.skillsGrid.innerHTML = "";

    if (visibleSkills.length > 0) {
      const table = document.createElement("div");

      table.className = "skills-list-table";
      table.setAttribute("role", "table");
      table.setAttribute("aria-label", "Skills list");

      const header = document.createElement("div");

      header.className = "skills-list-header";
      header.setAttribute("role", "row");

      header.innerHTML = `
        <span
          class="skills-col skills-col-name"
          role="columnheader"
        >
          Skill Name
        </span>

        <span class="skills-col" role="columnheader">
          Category
        </span>

        <span class="skills-col" role="columnheader">
          Level
        </span>

        <span class="skills-col" role="columnheader">
          Projects
        </span>

        <span
          class="skills-col skills-col-action"
          role="columnheader"
        >
          Action
        </span>
      `;

      table.appendChild(header);

      visibleSkills.forEach((skill) => {
        table.appendChild(createSkillRow(skill));
      });

      elements.skillsGrid.appendChild(table);
    }
  }

  if (elements.skillsEmptyState) {
    elements.skillsEmptyState.hidden =
      visibleSkills.length > 0;
  }

  refreshIcons();
}

/* ---------------------------------------------------------
   Skills to improve sidebar
   --------------------------------------------------------- */

function createImproveSkillItem(skill) {
  const item = document.createElement("button");

  item.type = "button";
  item.className = "skill-improve-item";
  item.setAttribute(
    "aria-label",
    `View improvement details for ${skill.name}`
  );

  item.innerHTML = `
    <span class="skill-improve-header">
      <span class="skill-improve-name">
        ${escapeHtml(skill.name)}
      </span>

      <span class="chip skill-level-beginner">
        Beginner
      </span>
    </span>

    <span class="skill-improve-suggestion">
      ${escapeHtml(skill.suggestion)}
    </span>

    <span class="skill-improve-action">
      View Details
      <i
        data-lucide="chevron-right"
        aria-hidden="true"
      ></i>
    </span>
  `;

  item.addEventListener("click", () => {
    openDetails(skill.id);
  });

  return item;
}

function renderSkillsToImprove() {
  if (!elements.skillsToImproveList) {
    return;
  }

  const beginnerSkills = getBeginnerSkills();

  elements.skillsToImproveList.innerHTML = "";

  beginnerSkills.forEach((skill) => {
    elements.skillsToImproveList.appendChild(
      createImproveSkillItem(skill)
    );
  });

  refreshIcons();
}

/* ---------------------------------------------------------
   Details slide-over
   --------------------------------------------------------- */

function renderDetailsProjects(projects) {
  if (!elements.detailsProjects) {
    return;
  }

  elements.detailsProjects.innerHTML = "";

  if (!Array.isArray(projects) || projects.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "details-projects-empty";
    emptyMessage.textContent =
      "No linked projects yet. Add this skill to a project as you develop it.";

    elements.detailsProjects.appendChild(emptyMessage);
    return;
  }

  const list = document.createElement("ul");
  list.className = "details-projects-list";

  projects.forEach((project) => {
    const listItem = document.createElement("li");
    listItem.textContent = project;
    list.appendChild(listItem);
  });

  elements.detailsProjects.appendChild(list);
}

function openDetails(skillId) {
  const skill = getSkillById(skillId);

  if (!skill) {
    return;
  }

  state.selectedSkillId = skill.id;

  if (elements.detailsTitle) {
    elements.detailsTitle.textContent = skill.name;
  }

  if (elements.detailsCategoryChip) {
    elements.detailsCategoryChip.textContent =
      skill.categoryLabel;

    elements.detailsCategoryChip.className =
      "chip details-category-chip";

    elements.detailsCategoryChip.classList.add(
      `skill-category-${skill.category}`
    );
  }

  if (elements.detailsLevelChip) {
    elements.detailsLevelChip.textContent = skill.level;

    elements.detailsLevelChip.className =
      "chip details-level-chip";

    elements.detailsLevelChip.classList.add(
      `skill-level-${skill.levelKey}`
    );
  }

  if (elements.detailsDescription) {
    elements.detailsDescription.textContent =
      skill.description;
  }

  renderDetailsProjects(skill.projects);

  if (elements.detailsSuggestion) {
    elements.detailsSuggestion.textContent =
      skill.suggestion;
  }

  if (elements.detailsOverlay) {
    elements.detailsOverlay.hidden = false;
    elements.detailsOverlay.classList.add(
      "show",
      "is-visible",
      "active"
    );
    elements.detailsOverlay.setAttribute(
      "aria-hidden",
      "false"
    );
  }

  if (elements.detailsPanel) {
    elements.detailsPanel.hidden = false;
    elements.detailsPanel.classList.add(
      "open",
      "show",
      "is-open",
      "active"
    );
    elements.detailsPanel.setAttribute("aria-hidden", "false");
  }

  document.body.classList.add("details-panel-open");

  window.requestAnimationFrame(() => {
    if (elements.closeDetailsButton) {
      elements.closeDetailsButton.focus();
    } else if (elements.detailsPanel) {
      elements.detailsPanel.focus();
    }
  });

  refreshIcons();
}

function closeDetails() {
  state.selectedSkillId = null;

  if (elements.detailsPanel) {
    elements.detailsPanel.classList.remove(
      "open",
      "show",
      "is-open",
      "active"
    );
    elements.detailsPanel.setAttribute("aria-hidden", "true");
  }

  if (elements.detailsOverlay) {
    elements.detailsOverlay.classList.remove(
      "show",
      "is-visible",
      "active"
    );
    elements.detailsOverlay.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  document.body.classList.remove("details-panel-open");

  window.setTimeout(() => {
    if (
      elements.detailsPanel &&
      !elements.detailsPanel.classList.contains("open") &&
      !elements.detailsPanel.classList.contains("is-open") &&
      !elements.detailsPanel.classList.contains("active")
    ) {
      elements.detailsPanel.hidden = true;
    }

    if (
      elements.detailsOverlay &&
      !elements.detailsOverlay.classList.contains("show") &&
      !elements.detailsOverlay.classList.contains(
        "is-visible"
      ) &&
      !elements.detailsOverlay.classList.contains("active")
    ) {
      elements.detailsOverlay.hidden = true;
    }
  }, 250);
}

/* ---------------------------------------------------------
   Controls
   --------------------------------------------------------- */

function syncControls() {
  if (elements.searchInput) {
    elements.searchInput.value = state.searchTerm;
  }

  if (elements.categoryFilter) {
    elements.categoryFilter.value =
      state.selectedCategory;
  }
}

function resetFilters() {
  state.searchTerm = "";
  state.selectedCategory = "all";

  syncControls();
  renderSkills();

  showToast("Skills refreshed");
}

/* ---------------------------------------------------------
   Event listeners
   --------------------------------------------------------- */

function bindEvents() {
  if (elements.searchInput) {
    elements.searchInput.addEventListener("input", (event) => {
      state.searchTerm = event.target.value;
      renderSkills();
    });
  }

  if (elements.categoryFilter) {
    elements.categoryFilter.addEventListener(
      "change",
      (event) => {
        state.selectedCategory =
          event.target.value || "all";

        renderSkills();
      }
    );
  }

  if (elements.refreshButton) {
    elements.refreshButton.addEventListener(
      "click",
      resetFilters
    );
  }

  if (elements.closeDetailsButton) {
    elements.closeDetailsButton.addEventListener(
      "click",
      closeDetails
    );
  }

  if (elements.detailsOverlay) {
    elements.detailsOverlay.addEventListener(
      "click",
      closeDetails
    );
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.selectedSkillId !== null) {
      closeDetails();
    }
  });
}

/* ---------------------------------------------------------
   Initialization
   --------------------------------------------------------- */

function initSkillsPage() {
  cacheElements();

  renderSummaryCards();
  renderSkillsToImprove();
  syncControls();
  renderSkills();
  bindEvents();

  if (elements.detailsPanel) {
    elements.detailsPanel.setAttribute("aria-hidden", "true");
  }

  if (elements.detailsOverlay) {
    elements.detailsOverlay.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  refreshIcons();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initSkillsPage,
    { once: true }
  );
} else {
  initSkillsPage();
}