const toastWrap = document.getElementById("toastWrap");
const resumeSummaryText = document.getElementById("resumeSummaryText");
const resumeBulletsPreview = document.getElementById("resumeBulletsPreview");
const coverLetterPreviewText = document.getElementById("coverLetterPreviewText");
const resumeInlineEditor = document.getElementById("resumeInlineEditor");
const coverLetterInlineEditor = document.getElementById("coverLetterInlineEditor");
const resumeSummaryInput = document.getElementById("resumeSummaryInput");
const resumeBulletsEditor = document.getElementById("resumeBulletsEditor");
const addResumeBulletBtn = document.getElementById("addResumeBulletBtn");
const coverLetterOpeningInput = document.getElementById("coverLetterOpeningInput");
const coverLetterExperienceInput = document.getElementById("coverLetterExperienceInput");
const coverLetterClosingInput = document.getElementById("coverLetterClosingInput");
const saveResumeInlineBtn = document.getElementById("saveResumeInlineBtn");
const copyResumeInlineBtn = document.getElementById("copyResumeInlineBtn");
const cancelResumeInlineBtn = document.getElementById("cancelResumeInlineBtn");
const saveCoverLetterInlineBtn = document.getElementById("saveCoverLetterInlineBtn");
const copyCoverLetterInlineBtn = document.getElementById("copyCoverLetterInlineBtn");
const cancelCoverLetterInlineBtn = document.getElementById("cancelCoverLetterInlineBtn");

const portfolioState = {
  mode: "resume",
  resumeSummary:
    "Backend-focused Computer Programming student with experience developing REST APIs, working with MongoDB, and deploying applications using Azure. Strong problem-solving and communication skills demonstrated through academic projects.",
  resumeBullets: [
    "Developed a RESTful Inventory Control API using Express and MongoDB.",
    "Implemented CRUD operations, input validation, and structured error handling.",
  ],
  coverLetter: {
    opening:
      "I am excited to apply my backend development knowledge to opportunities where I can continue growing as a student developer and contribute to practical software projects.",
    experience:
      "Through developing projects such as the Inventory Control API, I strengthened my backend development, database design, and problem-solving skills while learning how to build scalable REST APIs.",
    closing:
      "I would welcome the opportunity to bring my technical curiosity, academic project experience, and strong work ethic to a professional team environment.",
  },
};

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

const copyText = async (text, successMessage) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch (error) {
    showToast("Copy action unavailable");
  }
};

const closeInlineEditors = () => {
  if (resumeInlineEditor) resumeInlineEditor.setAttribute("hidden", "hidden");
  if (coverLetterInlineEditor) coverLetterInlineEditor.setAttribute("hidden", "hidden");
};

const openResumeInlineEditor = () => {
  portfolioState.mode = "resume";
  closeInlineEditors();
  if (resumeSummaryInput) resumeSummaryInput.value = portfolioState.resumeSummary;
  renderResumeBulletsEditor();
  if (resumeInlineEditor) resumeInlineEditor.removeAttribute("hidden");
};

const openCoverLetterInlineEditor = () => {
  portfolioState.mode = "cover-letter";
  closeInlineEditors();
  if (coverLetterOpeningInput) coverLetterOpeningInput.value = portfolioState.coverLetter.opening;
  if (coverLetterExperienceInput) coverLetterExperienceInput.value = portfolioState.coverLetter.experience;
  if (coverLetterClosingInput) coverLetterClosingInput.value = portfolioState.coverLetter.closing;
  if (coverLetterInlineEditor) coverLetterInlineEditor.removeAttribute("hidden");
};

const renderResumePreview = () => {
  if (resumeSummaryText) {
    resumeSummaryText.textContent = portfolioState.resumeSummary;
  }

  if (resumeBulletsPreview) {
    resumeBulletsPreview.innerHTML = portfolioState.resumeBullets.map((bullet) => `<li>${bullet}</li>`).join("");
  }
};

const renderCoverLetterPreview = () => {
  if (coverLetterPreviewText) {
    coverLetterPreviewText.textContent = portfolioState.coverLetter.experience;
  }
};

const renderResumeBulletsEditor = () => {
  if (!resumeBulletsEditor) {
    return;
  }

  resumeBulletsEditor.innerHTML = "";

  portfolioState.resumeBullets.forEach((bullet, index) => {
    const item = document.createElement("div");
    item.className = "bullet-editor-item";
    item.innerHTML = `
      <div class="bullet-editor-row">
        <textarea class="bullet-input" data-bullet-index="${index}" rows="3">${bullet}</textarea>
        <div class="bullet-controls">
          <button class="bullet-control-btn" data-bullet-move="up" data-bullet-index="${index}">Up</button>
          <button class="bullet-control-btn" data-bullet-move="down" data-bullet-index="${index}">Down</button>
          <button class="bullet-control-btn" data-bullet-remove="${index}">Remove</button>
        </div>
      </div>
    `;
    resumeBulletsEditor.appendChild(item);
  });

  resumeBulletsEditor.querySelectorAll("[data-bullet-index]").forEach((field) => {
    field.addEventListener("input", () => {
      const index = Number(field.getAttribute("data-bullet-index"));
      portfolioState.resumeBullets[index] = field.value;
    });
  });

  resumeBulletsEditor.querySelectorAll("[data-bullet-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.getAttribute("data-bullet-remove"));
      portfolioState.resumeBullets.splice(index, 1);
      renderResumeBulletsEditor();
    });
  });

  resumeBulletsEditor.querySelectorAll("[data-bullet-move]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.getAttribute("data-bullet-move");
      const index = Number(button.getAttribute("data-bullet-index"));
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= portfolioState.resumeBullets.length) {
        return;
      }
      const temp = portfolioState.resumeBullets[index];
      portfolioState.resumeBullets[index] = portfolioState.resumeBullets[swapIndex];
      portfolioState.resumeBullets[swapIndex] = temp;
      renderResumeBulletsEditor();
    });
  });
};

const saveSideEditorChanges = () => {
  if (portfolioState.mode === "resume") {
    if (resumeSummaryInput) {
      portfolioState.resumeSummary = resumeSummaryInput.value.trim();
    }
    renderResumePreview();
    showToast("Resume content updated");
    if (resumeInlineEditor) resumeInlineEditor.setAttribute("hidden", "hidden");
  }

  if (portfolioState.mode === "cover-letter") {
    if (coverLetterOpeningInput) portfolioState.coverLetter.opening = coverLetterOpeningInput.value.trim();
    if (coverLetterExperienceInput) portfolioState.coverLetter.experience = coverLetterExperienceInput.value.trim();
    if (coverLetterClosingInput) portfolioState.coverLetter.closing = coverLetterClosingInput.value.trim();
    renderCoverLetterPreview();
    showToast("Cover letter content updated");
    if (coverLetterInlineEditor) coverLetterInlineEditor.setAttribute("hidden", "hidden");
  }
};

const copyEditorContent = () => {
  if (portfolioState.mode === "resume") {
    const payload = [portfolioState.resumeSummary, ...portfolioState.resumeBullets.map((bullet) => `• ${bullet}`)].join("\n\n");
    copyText(payload, "Resume content copied");
    return;
  }

  const payload = [
    portfolioState.coverLetter.opening,
    portfolioState.coverLetter.experience,
    portfolioState.coverLetter.closing,
  ].join("\n\n");
  copyText(payload, "Cover letter content copied");
};

document.getElementById("previewPortfolioBtn")?.addEventListener("click", () => {
  showToast("Portfolio preview opened");
});

document.getElementById("publishPortfolioBtn")?.addEventListener("click", () => {
  showToast("Portfolio published successfully");
});

document.getElementById("previewFullPortfolioBtn")?.addEventListener("click", () => {
  showToast("Career portfolio preview opened");
});

document.getElementById("editResumeContentBtn")?.addEventListener("click", () => {
  openResumeInlineEditor();
});

document.getElementById("editCoverLetterContentBtn")?.addEventListener("click", () => {
  openCoverLetterInlineEditor();
});

document.getElementById("copyResumeSummaryBtn")?.addEventListener("click", () => {
  const payload = [portfolioState.resumeSummary, ...portfolioState.resumeBullets.map((bullet) => `• ${bullet}`)].join("\n\n");
  copyText(payload, "Resume content copied");
});

document.getElementById("copyCoverLetterContentBtn")?.addEventListener("click", () => {
  const payload = [portfolioState.coverLetter.opening, portfolioState.coverLetter.experience, portfolioState.coverLetter.closing].join("\n\n");
  copyText(payload, "Cover letter content copied");
});

document.getElementById("generateCareerPortfolioBtn")?.addEventListener("click", () => {
  showToast("Career-ready portfolio version generated");
});

document.getElementById("exportPortfolioPdfBtn")?.addEventListener("click", () => {
  showToast("Portfolio PDF exported");
});

addResumeBulletBtn?.addEventListener("click", () => {
  portfolioState.resumeBullets.push("Add a new resume bullet here.");
  renderResumeBulletsEditor();
});

saveResumeInlineBtn?.addEventListener("click", saveSideEditorChanges);
copyResumeInlineBtn?.addEventListener("click", copyEditorContent);
cancelResumeInlineBtn?.addEventListener("click", closeInlineEditors);
saveCoverLetterInlineBtn?.addEventListener("click", saveSideEditorChanges);
copyCoverLetterInlineBtn?.addEventListener("click", copyEditorContent);
cancelCoverLetterInlineBtn?.addEventListener("click", closeInlineEditors);

document.querySelectorAll("[data-portfolio-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.getAttribute("data-portfolio-action") || "Portfolio action";
    showToast(`${action} opened`);
  });
});

renderResumePreview();
renderCoverLetterPreview();
