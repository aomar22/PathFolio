function createSkillRow(skill) {
  const row = document.createElement("button");

  row.type = "button";
  row.className = "skills-list-row";
  row.setAttribute("aria-label", `View details for ${skill.name}`);

  row.innerHTML = `
    <span class="skills-col skills-col-name">
      ${skill.name}
    </span>

    <span class="skills-col">
      ${skill.categoryLabel}
    </span>

    <span class="skills-col">
      <span class="chip skill-level-${skill.levelKey}">
        ${skill.level}
      </span>
    </span>

    <span class="skills-col">
      ${skill.projects.length}
      ${skill.projects.length === 1 ? "Project" : "Projects"}
    </span>

    <span class="skills-col skills-col-action">
      <span class="skill-row-action">
        View Details
        <i data-lucide="chevron-right"></i>
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
    elements.skillsResultsChip.textContent = `${visibleSkills.length} ${
      visibleSkills.length === 1 ? "Skill" : "Skills"
    }`;
  }

  if (elements.skillsGrid) {
    elements.skillsGrid.innerHTML = "";

    if (visibleSkills.length > 0) {
      const table = document.createElement("div");

      table.className = "skills-list-table";
      table.setAttribute("role", "table");
      table.setAttribute("aria-label", "Skills list");

      table.innerHTML = `
        <div class="skills-list-header" role="row">
          <span class="skills-col skills-col-name">Skill Name</span>
          <span class="skills-col">Category</span>
          <span class="skills-col">Level</span>
          <span class="skills-col">Projects</span>
          <span class="skills-col skills-col-action">Action</span>
        </div>
      `;

      visibleSkills.forEach((skill) => {
        table.appendChild(createSkillRow(skill));
      });

      elements.skillsGrid.appendChild(table);
    }
  }

  if (elements.skillsEmptyState) {
    elements.skillsEmptyState.hidden = visibleSkills.length > 0;
  }

  if (
    visibleSkills.length > 0 &&
    !visibleSkills.some(
      (skill) => skill.id === state.selectedSkillId
    )
  ) {
    state.selectedSkillId = visibleSkills[0].id;
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}
renderSummaryCards();
renderSkillsToImprove();
syncControls();
renderSkills();
bindEvents();