const analyticsData = {
  summary: {
    projectsDocumented: 6,
    reflectionsCompleted: 14,
    learningStreak: 7,
    careerReadiness: 72,
  },

  activity: [
    {
      label: "Week 1",
      projects: 1,
      reflections: 2,
    },
    {
      label: "Week 2",
      projects: 2,
      reflections: 3,
    },
    {
      label: "Week 3",
      projects: 1,
      reflections: 4,
    },
    {
      label: "Week 4",
      projects: 2,
      reflections: 5,
    },
  ],

  readiness: [
    {
      name: "Projects Documented",
      value: 85,
    },
    {
      name: "Reflections Completed",
      value: 76,
    },
    {
      name: "Portfolio Content",
      value: 65,
    },
    {
      name: "Career Evidence",
      value: 60,
    },
  ],

  projects: [
    {
      name: "Inventory Control API",
      progress: 90,
      status: "Almost Complete",
      reflections: 3,
    },
    {
      name: "Smart Attendance Tracker",
      progress: 75,
      status: "In Progress",
      reflections: 2,
    },
    {
      name: "Portfolio CMS",
      progress: 60,
      status: "In Progress",
      reflections: 4,
    },
    {
      name: "Azure Deployment Lab",
      progress: 100,
      status: "Completed",
      reflections: 2,
    },
  ],

  consistency: [
    {
      label: "W1",
      value: 35,
    },
    {
      label: "W2",
      value: 65,
    },
    {
      label: "W3",
      value: 45,
    },
    {
      label: "W4",
      value: 90,
    },
  ],

  insights: [
    {
      icon: "trending-up",
      title: "Reflection activity is improving",
      description:
        "You completed more reflections this month than the previous month. Continue reflecting shortly after each project milestone.",
    },
    {
      icon: "layers-3",
      title: "Your strongest evidence comes from backend projects",
      description:
        "Your API and database projects currently provide the clearest examples of technical problem solving.",
    },
    {
      icon: "briefcase-business",
      title: "Your portfolio needs more outcome-focused content",
      description:
        "Add measurable project results and explain how your work improved the final solution.",
    },
  ],
};

const elements = {
  projectsDocumentedCount: document.getElementById(
    "projectsDocumentedCount"
  ),

  reflectionsCompletedCount: document.getElementById(
    "reflectionsCompletedCount"
  ),

  learningStreakCount: document.getElementById(
    "learningStreakCount"
  ),

  careerReadinessCount: document.getElementById(
    "careerReadinessCount"
  ),

  activityChart: document.getElementById("activityChart"),
  readinessCircle: document.getElementById("readinessCircle"),

  readinessCircleValue: document.getElementById(
    "readinessCircleValue"
  ),

  readinessList: document.getElementById("readinessList"),

  projectProgressList: document.getElementById(
    "projectProgressList"
  ),

  consistencyChart: document.getElementById("consistencyChart"),
  aiInsightsGrid: document.getElementById("aiInsightsGrid"),

  analyticsPeriod: document.getElementById("analyticsPeriod"),

  refreshAnalyticsBtn: document.getElementById(
    "refreshAnalyticsBtn"
  ),

  generateInsightBtn: document.getElementById(
    "generateInsightBtn"
  ),

  toastWrap: document.getElementById("toastWrap"),
};

const showToast = (message) => {
  if (!elements.toastWrap) {
    return;
  }

  const toast = document.createElement("div");

  toast.className = "toast";
  toast.textContent = message;

  elements.toastWrap.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2200);
};

const renderSummary = () => {
  const summary = analyticsData.summary;

  if (elements.projectsDocumentedCount) {
    elements.projectsDocumentedCount.textContent =
      summary.projectsDocumented;
  }

  if (elements.reflectionsCompletedCount) {
    elements.reflectionsCompletedCount.textContent =
      summary.reflectionsCompleted;
  }

  if (elements.learningStreakCount) {
    elements.learningStreakCount.textContent =
      `${summary.learningStreak} Days`;
  }

  if (elements.careerReadinessCount) {
    elements.careerReadinessCount.textContent =
      `${summary.careerReadiness}%`;
  }
};

const renderActivityChart = () => {
  if (!elements.activityChart) {
    return;
  }

  const maximumValue = Math.max(
    ...analyticsData.activity.flatMap((item) => [
      item.projects,
      item.reflections,
    ])
  );

  elements.activityChart.innerHTML = analyticsData.activity
    .map((item) => {
      const projectHeight =
        maximumValue === 0
          ? 0
          : Math.max((item.projects / maximumValue) * 100, 7);

      const reflectionHeight =
        maximumValue === 0
          ? 0
          : Math.max((item.reflections / maximumValue) * 100, 7);

      return `
        <div class="activity-column">
          <div class="activity-bars">
            <div
              class="activity-bar projects"
              style="height: ${projectHeight}%"
              title="${item.projects} projects"
            ></div>

            <div
              class="activity-bar reflections"
              style="height: ${reflectionHeight}%"
              title="${item.reflections} reflections"
            ></div>
          </div>

          <span class="activity-label">${item.label}</span>
        </div>
      `;
    })
    .join("");
};

const renderCareerReadiness = () => {
  const readinessScore =
    analyticsData.summary.careerReadiness;

  if (elements.readinessCircle) {
    const angle = readinessScore * 3.6;

    elements.readinessCircle.style.setProperty(
      "--readiness-value",
      `${angle}deg`
    );
  }

  if (elements.readinessCircleValue) {
    elements.readinessCircleValue.textContent =
      `${readinessScore}%`;
  }

  if (!elements.readinessList) {
    return;
  }

  elements.readinessList.innerHTML =
    analyticsData.readiness
      .map(
        (item) => `
          <div class="readiness-item">
            <div class="readiness-item-top">
              <span>${item.name}</span>
              <span>${item.value}%</span>
            </div>

            <div class="readiness-track">
              <div
                class="readiness-fill"
                style="width: ${item.value}%"
              ></div>
            </div>
          </div>
        `
      )
      .join("");
};

const renderProjectProgress = () => {
  if (!elements.projectProgressList) {
    return;
  }

  elements.projectProgressList.innerHTML =
    analyticsData.projects
      .map(
        (project) => `
          <div class="project-progress-item">
            <div class="project-progress-top">
              <h4>${project.name}</h4>
              <span>${project.progress}%</span>
            </div>

            <div class="project-progress-track">
              <div
                class="project-progress-fill"
                style="width: ${project.progress}%"
              ></div>
            </div>

            <div class="project-progress-meta">
              <span>${project.status}</span>

              <span>
                ${project.reflections}
                ${
                  project.reflections === 1
                    ? "Reflection"
                    : "Reflections"
                }
              </span>
            </div>
          </div>
        `
      )
      .join("");
};

const renderConsistencyChart = () => {
  if (!elements.consistencyChart) {
    return;
  }

  elements.consistencyChart.innerHTML =
    analyticsData.consistency
      .map(
        (week) => `
          <div class="consistency-week">
            <div
              class="consistency-bar"
              style="height: ${week.value}%"
              title="${week.value}% consistency"
            ></div>

            <span>${week.label}</span>
          </div>
        `
      )
      .join("");
};

const renderInsights = () => {
  if (!elements.aiInsightsGrid) {
    return;
  }

  elements.aiInsightsGrid.innerHTML =
    analyticsData.insights
      .map(
        (insight) => `
          <article class="ai-insight-item">
            <div class="ai-insight-icon">
              <i data-lucide="${insight.icon}"></i>
            </div>

            <h4>${insight.title}</h4>

            <p>${insight.description}</p>
          </article>
        `
      )
      .join("");

  if (window.lucide) {
    window.lucide.createIcons();
  }
};

const generateNewInsight = () => {
  const newInsight = {
    icon: "lightbulb",
    title: "Add evidence from collaborative projects",
    description:
      "Your reflections describe individual technical work clearly. Add one teamwork example to strengthen your professional story.",
  };

  analyticsData.insights = [
    newInsight,
    ...analyticsData.insights.slice(0, 2),
  ];

  renderInsights();
  showToast("New AI insight generated");
};

const refreshAnalytics = () => {
  renderSummary();
  renderActivityChart();
  renderCareerReadiness();
  renderProjectProgress();
  renderConsistencyChart();
  renderInsights();

  showToast("Analytics refreshed");
};

const bindEvents = () => {
  elements.analyticsPeriod?.addEventListener(
    "change",
    () => {
      refreshAnalytics();
    }
  );

  elements.refreshAnalyticsBtn?.addEventListener(
    "click",
    refreshAnalytics
  );

  elements.generateInsightBtn?.addEventListener(
    "click",
    generateNewInsight
  );
};

const initializeAnalyticsPage = () => {
  renderSummary();
  renderActivityChart();
  renderCareerReadiness();
  renderProjectProgress();
  renderConsistencyChart();
  renderInsights();
  bindEvents();

  if (window.lucide) {
    window.lucide.createIcons();
  }
};

initializeAnalyticsPage();