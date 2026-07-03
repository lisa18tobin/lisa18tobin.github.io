const form = document.querySelector("#topicForm");
const topicName = document.querySelector("#topicName");
const topicCategory = document.querySelector("#topicCategory");
const topicStatus = document.querySelector("#topicStatus");
const topicConfidence = document.querySelector("#topicConfidence");
const topicHours = document.querySelector("#topicHours");
const topicResource = document.querySelector("#topicResource");
const topicNextStep = document.querySelector("#topicNextStep");
const confidenceValue = document.querySelector("#confidenceValue");
const statusFilter = document.querySelector("#statusFilter");
const topicList = document.querySelector("#topicList");
const emptyState = document.querySelector("#emptyState");
const totalTopics = document.querySelector("#totalTopics");
const completedTopics = document.querySelector("#completedTopics");
const totalHours = document.querySelector("#totalHours");
const averageConfidence = document.querySelector("#averageConfidence");

const storageKey = "lisa-learning-tracker-topics";

const starterTopics = [
  {
    id: crypto.randomUUID(),
    name: "HTML semantic structure",
    category: "HTML",
    status: "Practising",
    confidence: 4,
    hours: 2,
    resource: "MDN Web Docs",
    nextStep: "Build one page using header, main, section, article, and footer."
  },
  {
    id: crypto.randomUUID(),
    name: "JavaScript local storage",
    category: "JavaScript",
    status: "Learning",
    confidence: 3,
    hours: 1.5,
    resource: "JavaScript.info",
    nextStep: "Save and reload a small list of objects from the browser."
  }
];

let topics = loadTopics();

function loadTopics() {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    return starterTopics;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return starterTopics;
  }
}

function saveTopics() {
  localStorage.setItem(storageKey, JSON.stringify(topics));
}

function renderTopics() {
  const filter = statusFilter.value;
  const visibleTopics = filter === "All"
    ? topics
    : topics.filter((topic) => topic.status === filter);

  topicList.innerHTML = "";
  emptyState.hidden = visibleTopics.length > 0;

  visibleTopics.forEach((topic) => {
    const card = document.createElement("article");
    card.className = "topic-card";
    card.innerHTML = `
      <header>
        <div>
          <h3>${escapeHtml(topic.name)}</h3>
          <p>${escapeHtml(topic.category)}</p>
        </div>
        <span class="status-pill">${escapeHtml(topic.status)}</span>
      </header>
      <ul class="topic-meta">
        <li>Confidence ${topic.confidence}/5</li>
        <li>${formatHours(topic.hours)} hours</li>
        <li>${escapeHtml(topic.resource || "No resource yet")}</li>
      </ul>
      <p>${escapeHtml(topic.nextStep || "No next step added yet.")}</p>
      <div class="topic-actions">
        <button type="button" data-complete="${topic.id}">Mark completed</button>
        <button class="delete-button" type="button" data-delete="${topic.id}">Delete</button>
      </div>
    `;

    topicList.append(card);
  });

  updateDashboard();
}

function updateDashboard() {
  const completed = topics.filter((topic) => topic.status === "Completed").length;
  const hours = topics.reduce((sum, topic) => sum + Number(topic.hours || 0), 0);
  const confidence = topics.length
    ? topics.reduce((sum, topic) => sum + Number(topic.confidence || 0), 0) / topics.length
    : 0;

  totalTopics.textContent = topics.length;
  completedTopics.textContent = completed;
  totalHours.textContent = formatHours(hours);
  averageConfidence.textContent = confidence.toFixed(1);
}

function formatHours(hours) {
  return Number(hours).toLocaleString("en-GB", {
    maximumFractionDigits: 1
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

topicConfidence.addEventListener("input", () => {
  confidenceValue.textContent = topicConfidence.value;
});

statusFilter.addEventListener("change", renderTopics);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  topics.unshift({
    id: crypto.randomUUID(),
    name: topicName.value.trim(),
    category: topicCategory.value,
    status: topicStatus.value,
    confidence: Number(topicConfidence.value),
    hours: Number(topicHours.value),
    resource: topicResource.value.trim(),
    nextStep: topicNextStep.value.trim()
  });

  saveTopics();
  form.reset();
  topicConfidence.value = 3;
  confidenceValue.textContent = "3";
  renderTopics();
});

topicList.addEventListener("click", (event) => {
  const completeId = event.target.dataset.complete;
  const deleteId = event.target.dataset.delete;

  if (completeId) {
    topics = topics.map((topic) => (
      topic.id === completeId ? { ...topic, status: "Completed" } : topic
    ));
  }

  if (deleteId) {
    topics = topics.filter((topic) => topic.id !== deleteId);
  }

  saveTopics();
  renderTopics();
});

renderTopics();
