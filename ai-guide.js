const stepModel = [
  {
    title: "Project Overview",
    question: "What was the overall objective of this project and why did it matter?",
  },
  {
    title: "Challenges Faced",
    question: "What was the biggest technical challenge you encountered during this project?",
  },
  {
    title: "Problem Solving",
    question: "How did you analyze the problem and decide on your final solution approach?",
  },
  {
    title: "Technical Learning",
    question: "Which new technical concept or tool did you learn, and how did you apply it?",
  },
  {
    title: "Skills Identified",
    question: "Which technical and soft skills did this project strengthen the most?",
  },
  {
    title: "Career Reflection",
    question: "How does this project prepare you for internships or junior developer roles?",
  },
];

const reflectionProjects = [
  {
    id: "inventory-control-api",
    title: "Inventory Control API",
    status: "in-progress",
    progress: 70,
    minutes: 8,
    type: "Backend",
    technologies: ["Express", "MongoDB"],
    githubConnected: true,
    started: "Jul 15",
    updated: "Today",
  },
  {
    id: "portfolio-cms",
    title: "Portfolio CMS",
    status: "draft",
    progress: 35,
    minutes: 12,
    type: "Frontend",
    technologies: ["React", "Supabase"],
    githubConnected: true,
    started: "Jul 10",
    updated: "Jul 25",
  },
  {
    id: "azure-deployment-lab",
    title: "Azure Deployment Lab",
    status: "completed",
    progress: 100,
    minutes: 0,
    type: "Cloud",
    technologies: ["Azure", "Docker"],
    githubConnected: true,
    started: "Jun 30",
    updated: "Jul 21",
  },
];

let currentStep = 0;
let selectedProjectId = "inventory-control-api";

const stepper = document.getElementById("reflectionStepper");
const stepStatusText = document.getElementById("stepStatusText");
const reflectionQuestionText = document.getElementById("reflectionQuestionText");
const featuredProgressFill = document.getElementById("featuredProgressFill");
const featuredProgressText = document.getElementById("featuredProgressText");
const featuredProgressChip = document.getElementById("featuredProgressChip");
const featuredTime = document.getElementById("featuredTime");
const featuredProjectLabel = document.getElementById("featuredProjectLabel");
const reflectionAnswer = document.getElementById("reflectionAnswer");
const toastWrap = document.getElementById("toastWrap");
const projectSelect = document.getElementById("projectSelect");
const projectConnectionChip = document.getElementById("projectConnectionChip");
const projectReflectionStatus = document.getElementById("projectReflectionStatus");
const projectLastUpdated = document.getElementById("projectLastUpdated");
const projectTypeChip = document.getElementById("projectTypeChip");
const projectInfoTitle = document.getElementById("projectInfoTitle");
const projectInfoRepoStatus = document.getElementById("projectInfoRepoStatus");
const projectInfoStarted = document.getElementById("projectInfoStarted");
const projectInfoUpdated = document.getElementById("projectInfoUpdated");
const projectTechStack = document.getElementById("projectTechStack");

const getSelectedProject = () => reflectionProjects.find((project) => project.id === selectedProjectId) || null;

const showToast = (message) => {
  if (!toastWrap) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastWrap.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2200);
};

const progressToStepIndex = (progress) => {
  const maxStepIndex = stepModel.length - 1;
  return Math.max(0, Math.min(maxStepIndex, Math.round((progress / 100) * maxStepIndex)));
};

const renderStepper = () => {
  if (!stepper) {
    return;
  }

  stepper.innerHTML = "";

  stepModel.forEach((step, index) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "guide-step";

    if (index < currentStep) {
      button.classList.add("done");
    } else if (index === currentStep) {
      button.classList.add("current");
    }

    button.setAttribute("aria-current", index === currentStep ? "step" : "false");
    button.innerHTML = `
      <span class="step-index">${index < currentStep ? "✓" : index + 1}</span>
      <span class="step-title">${step.title}</span>
    `;

    button.addEventListener("click", () => {
      currentStep = index;
      updateStepUI();
      showToast(`Moved to ${step.title}`);
    });

    li.appendChild(button);
    stepper.appendChild(li);
  });
};

const updateStepUI = () => {
  const model = stepModel[currentStep];
  if (!model) {
    return;
  }

  if (stepStatusText) {
    stepStatusText.textContent = `Step ${currentStep + 1} of ${stepModel.length} - ${model.title}`;
  }

  if (reflectionQuestionText) {
    reflectionQuestionText.textContent = model.question;
  }

  renderStepper();
};

const updateFeaturedUI = (project) => {
  if (!project) {
    return;
  }

  if (featuredProjectLabel) {
    featuredProjectLabel.textContent = `Project: ${project.title}`;
  }

  if (featuredProgressText) {
    featuredProgressText.textContent = `${project.progress}%`;
  }

  if (featuredProgressChip) {
    featuredProgressChip.textContent = `${project.progress}% Complete`;
  }

  if (featuredTime) {
    featuredTime.textContent = project.minutes > 0 ? `${project.minutes} minutes` : "Completed";
  }

  if (featuredProgressFill) {
    featuredProgressFill.style.setProperty("--value", `${project.progress}%`);
    featuredProgressFill.style.width = `${project.progress}%`;
  }
};

const updateProjectInfoUI = (project) => {
  if (!project) {
    return;
  }

  if (projectConnectionChip) {
    projectConnectionChip.textContent = project.githubConnected ? "GitHub Connected" : "GitHub Not Connected";
  }

  if (projectReflectionStatus) {
    projectReflectionStatus.textContent = `Reflection ${project.progress}% Complete`;
  }

  if (projectLastUpdated) {
    projectLastUpdated.textContent = `Last Updated: ${project.updated}`;
  }

  if (projectTypeChip) {
    projectTypeChip.textContent = project.type;
  }

  if (projectInfoTitle) {
    projectInfoTitle.textContent = project.title;
  }

  if (projectInfoRepoStatus) {
    projectInfoRepoStatus.textContent = project.githubConnected ? "GitHub Connected" : "GitHub Not Connected";
  }

  if (projectInfoStarted) {
    projectInfoStarted.textContent = project.started;
  }

  if (projectInfoUpdated) {
    projectInfoUpdated.textContent = project.updated;
  }

  if (projectTechStack) {
    projectTechStack.innerHTML = project.technologies
      .map((technology) => `<span class="skill-pill tech">${technology}</span>`)
      .join("");
  }
};

const populateProjectSelect = () => {
  if (!projectSelect) {
    return;
  }

  projectSelect.innerHTML = "";
  reflectionProjects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.title;
    projectSelect.appendChild(option);
  });
  projectSelect.value = selectedProjectId;
};

const selectProject = (projectId) => {
  selectedProjectId = projectId;
  const project = getSelectedProject();
  if (!project) {
    return;
  }

  currentStep = progressToStepIndex(project.progress);
  updateFeaturedUI(project);
  updateProjectInfoUI(project);
  updateStepUI();

  if (projectSelect) {
    projectSelect.value = project.id;
  }
};

const handleExpanders = () => {
  document.querySelectorAll("[data-expand-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const parent = btn.closest("[data-expand-item]");
      const content = parent ? parent.querySelector(".expand-content") : null;
      if (!content) {
        return;
      }

      const isOpen = !content.hasAttribute("hidden");
      if (isOpen) {
        content.setAttribute("hidden", "hidden");
        btn.setAttribute("aria-expanded", "false");
      } else {
        content.removeAttribute("hidden");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
};

const handleSectionToggles = () => {
  document.querySelectorAll(".section-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) {
        return;
      }

      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", isExpanded ? "false" : "true");
      if (isExpanded) {
        target.setAttribute("hidden", "hidden");
      } else {
        target.removeAttribute("hidden");
      }
    });
  });
};

const copySummary = async () => {
  const summary = document.getElementById("portfolioSummary");
  if (!summary) {
    return;
  }

  const text = summary.textContent ? summary.textContent.trim() : "";
  if (!text) {
    showToast("No summary available to copy");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast("Portfolio summary copied");
  } catch (error) {
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
    showToast("Portfolio summary copied");
  }
};

const handleSuggestionChips = () => {
  const chipWrap = document.getElementById("assistChipsWrap");
  const toggleBtn = document.getElementById("toggleSuggestionsBtn");

  if (toggleBtn && chipWrap) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = chipWrap.hasAttribute("hidden");
      if (isHidden) {
        chipWrap.removeAttribute("hidden");
      } else {
        chipWrap.setAttribute("hidden", "hidden");
      }
      toggleBtn.setAttribute("aria-pressed", isHidden ? "false" : "true");
      showToast(isHidden ? "AI suggestions shown" : "AI suggestions hidden");
    });
  }

  document.querySelectorAll(".assist-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
      const action = chip.getAttribute("data-action") || "Suggestion";
      showToast(`${action} activated`);
    });
  });
};

const buildInterviewReview = (answer, question) => {
  const trimmed = answer.trim();
  const notes = [];

  if (trimmed.length < 80) {
    notes.push("Add more detail. Aim for at least 4 to 5 sentences.");
  }

  if (!/[.!?]$/.test(trimmed)) {
    notes.push("Finish your answer with clear punctuation.");
  }

  if (/\b(thing|stuff|maybe)\b/i.test(trimmed)) {
    notes.push("Replace vague words like 'thing' or 'stuff' with specific technical terms.");
  }

  if (!/\b(I|my)\b/i.test(trimmed)) {
    notes.push("Use first-person language to highlight your contribution.");
  }

  if (
    /database|api|auth|jwt|node|express|mongodb|azure/i.test(question) &&
    !/database|api|auth|jwt|node|express|mongodb|azure/i.test(trimmed)
  ) {
    notes.push("Reference concrete technical choices from your project (for example API routes, MongoDB schema, JWT, or deployment).");
  }

  const quality = Math.max(58, 95 - notes.length * 9);
  return { quality, notes };
};

const bindActions = () => {
  const nextStepBtn = document.getElementById("nextStepBtn");
  const continueBtn = document.getElementById("continueReflectionBtn");
  const saveBtn = document.getElementById("saveProgressBtn");
  const startBtn = document.getElementById("startNewReflectionBtn");
  const secondaryStartBtn = document.getElementById("secondaryStartBtn");
  const editSummaryBtn = document.getElementById("editSummaryBtn");
  const addToPortfolioBtn = document.getElementById("addToPortfolioBtn");
  const copySummaryBtn = document.getElementById("copySummaryBtn");
  const reviewAnswerBtn = document.getElementById("reviewAnswerBtn");
  const clearAnswerBtn = document.getElementById("clearAnswerBtn");
  const interviewQuestionSelect = document.getElementById("interviewQuestionSelect");
  const interviewAnswerInput = document.getElementById("interviewAnswerInput");
  const aiReviewBox = document.getElementById("aiReviewBox");
  const openProjectBtn = document.getElementById("openProjectBtn");
  const viewGithubBtn = document.getElementById("viewGithubBtn");
  const liveDemoBtn = document.getElementById("liveDemoBtn");
  const uploadedFilesBtn = document.getElementById("uploadedFilesBtn");

  const goToNextStep = () => {
    currentStep = Math.min(stepModel.length - 1, currentStep + 1);
    const project = getSelectedProject();
    if (project) {
      project.progress = Math.round(((currentStep + 1) / stepModel.length) * 100);
      project.minutes = Math.max(0, 20 - currentStep * 3);
      project.status = project.progress >= 100 ? "completed" : "in-progress";
      project.updated = "Today";
      updateFeaturedUI(project);
      updateProjectInfoUI(project);
    }
    updateStepUI();
    showToast("Progress updated");
  };

  const restartReflection = () => {
    currentStep = 0;
    const project = getSelectedProject();
    if (project) {
      project.progress = 12;
      project.minutes = 18;
      project.status = "in-progress";
      project.updated = "Today";
      updateFeaturedUI(project);
      updateProjectInfoUI(project);
    }
    if (reflectionAnswer) {
      reflectionAnswer.value = "";
    }
    updateStepUI();
    showToast("Reflection restarted for selected project");
  };

  if (projectSelect) {
    projectSelect.addEventListener("change", () => {
      selectProject(projectSelect.value);
      showToast("Project switched");
    });
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener("click", goToNextStep);
  }

  if (continueBtn) {
    continueBtn.addEventListener("click", goToNextStep);
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      showToast("Reflection progress saved");
    });
  }

  if (startBtn) {
    startBtn.addEventListener("click", restartReflection);
  }

  if (secondaryStartBtn) {
    secondaryStartBtn.addEventListener("click", restartReflection);
  }

  if (editSummaryBtn) {
    editSummaryBtn.addEventListener("click", () => {
      showToast("Summary editing mode enabled");
    });
  }

  if (addToPortfolioBtn) {
    addToPortfolioBtn.addEventListener("click", () => {
      showToast("Summary added to portfolio queue");
    });
  }

  if (copySummaryBtn) {
    copySummaryBtn.addEventListener("click", copySummary);
  }

  if (openProjectBtn) {
    openProjectBtn.addEventListener("click", () => {
      window.location.href = "projects.html";
    });
  }

  if (viewGithubBtn) {
    viewGithubBtn.addEventListener("click", () => {
      showToast("GitHub repository preview opened");
    });
  }

  if (liveDemoBtn) {
    liveDemoBtn.addEventListener("click", () => {
      showToast("Live demo preview opened");
    });
  }

  if (uploadedFilesBtn) {
    uploadedFilesBtn.addEventListener("click", () => {
      showToast("Uploaded files opened");
    });
  }

  if (reviewAnswerBtn && interviewAnswerInput && interviewQuestionSelect && aiReviewBox) {
    reviewAnswerBtn.addEventListener("click", () => {
      const answer = interviewAnswerInput.value;
      if (!answer.trim()) {
        showToast("Write your answer first, then request AI review");
        return;
      }

      const question = interviewQuestionSelect.value;
      const result = buildInterviewReview(answer, question);
      const notesHtml = result.notes.length
        ? `<ul>${result.notes.map((note) => `<li>${note}</li>`).join("")}</ul>`
        : "<p>No major mistakes found. Your answer is clear and specific.</p>";

      aiReviewBox.innerHTML = `
        <strong>Learning Review (${result.quality}%)</strong>
        <p>Question: ${question}</p>
        ${notesHtml}
        <p>AI guidance only: Improve your own wording rather than memorizing fixed answers.</p>
      `;
      aiReviewBox.removeAttribute("hidden");
      showToast("AI review completed");
    });
  }

  if (clearAnswerBtn && interviewAnswerInput && aiReviewBox) {
    clearAnswerBtn.addEventListener("click", () => {
      interviewAnswerInput.value = "";
      aiReviewBox.setAttribute("hidden", "hidden");
      aiReviewBox.innerHTML = "";
      showToast("Interview answer cleared");
    });
  }

  document.querySelectorAll("[data-open-reflection]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const projectLabel = btn.getAttribute("data-open-reflection") || "";
      const query = encodeURIComponent(projectLabel);
      window.location.href = `reflections-log.html?project=${query}`;
    });
  });

  document.querySelectorAll("[data-continue-reflection]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const projectId = btn.getAttribute("data-continue-reflection") || "";
      if (!projectId) {
        return;
      }
      selectProject(projectId);
      showToast("Draft reflection loaded");
    });
  });
};

populateProjectSelect();
selectProject(selectedProjectId);
handleExpanders();
handleSectionToggles();
handleSuggestionChips();
bindActions();
