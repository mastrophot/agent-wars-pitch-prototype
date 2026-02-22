import { generatePitchPlan, toMarkdown } from "./src/planner.mjs";

const STORAGE_KEY = "agent_wars_pitch_history_v1";

const ideaEl = document.getElementById("idea");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resultEl = document.getElementById("result");
const metaGridEl = document.getElementById("metaGrid");
const featuresListEl = document.getElementById("featuresList");
const inScopeListEl = document.getElementById("inScopeList");
const outScopeListEl = document.getElementById("outScopeList");
const planListEl = document.getElementById("planList");
const riskListEl = document.getElementById("riskList");
const historyListEl = document.getElementById("historyList");

let currentPlan = null;

function getHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(prompt) {
  const now = new Date().toISOString();
  const existing = getHistory().filter((item) => item.prompt !== prompt);
  const updated = [{ prompt, created_at: now }, ...existing].slice(0, 8);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  renderHistory();
}

function clearChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function appendList(el, values) {
  clearChildren(el);
  for (const value of values) {
    const li = document.createElement("li");
    li.textContent = value;
    el.appendChild(li);
  }
}

function addMeta(label, value) {
  const card = document.createElement("div");
  card.className = "meta-card";
  const strong = document.createElement("strong");
  strong.textContent = label;
  const p = document.createElement("p");
  p.textContent = value;
  card.appendChild(strong);
  card.appendChild(p);
  metaGridEl.appendChild(card);
}

function renderPlan(plan) {
  currentPlan = plan;
  clearChildren(metaGridEl);
  addMeta("Original Prompt", plan.original_prompt);
  addMeta("Interpretation", plan.interpretation);
  addMeta("Target Audience", plan.target_audience);
  addMeta("Tech Stack", plan.tech_stack.join(", "));
  addMeta("Time", plan.time_to_first_working_version);

  appendList(featuresListEl, plan.features_implemented);
  appendList(inScopeListEl, plan.mvp_scope.in_scope);
  appendList(outScopeListEl, plan.mvp_scope.out_of_scope);
  appendList(
    planListEl,
    plan.execution_plan.map((step) => `${step.minute}m: ${step.name}`)
  );
  appendList(riskListEl, plan.risks);

  resultEl.classList.remove("hidden");
  copyBtn.disabled = false;
  downloadBtn.disabled = false;
}

function renderHistory() {
  clearChildren(historyListEl);
  const history = getHistory();
  if (!history.length) {
    const li = document.createElement("li");
    li.textContent = "No history yet.";
    historyListEl.appendChild(li);
    return;
  }

  for (const item of history) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    const shortPrompt = item.prompt.length > 120 ? `${item.prompt.slice(0, 117)}...` : item.prompt;
    btn.textContent = `${shortPrompt} (${new Date(item.created_at).toLocaleString()})`;
    btn.addEventListener("click", () => {
      ideaEl.value = item.prompt;
      generateFromInput();
    });
    li.appendChild(btn);
    historyListEl.appendChild(li);
  }
}

function generateFromInput() {
  const prompt = ideaEl.value.trim();
  if (!prompt) {
    alert("Please provide one sentence idea.");
    return;
  }
  try {
    const plan = generatePitchPlan(prompt);
    renderPlan(plan);
    saveHistory(prompt);
  } catch (err) {
    alert(`Generation failed: ${err.message}`);
  }
}

function downloadCurrentPlan() {
  if (!currentPlan) {
    return;
  }
  const blob = new Blob([JSON.stringify(currentPlan, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pitch_plan.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function copyMarkdown() {
  if (!currentPlan) {
    return;
  }
  const markdown = toMarkdown(currentPlan);
  await navigator.clipboard.writeText(markdown);
  copyBtn.textContent = "Copied";
  setTimeout(() => {
    copyBtn.textContent = "Copy Markdown";
  }, 1400);
}

generateBtn.addEventListener("click", generateFromInput);
downloadBtn.addEventListener("click", downloadCurrentPlan);
copyBtn.addEventListener("click", () => {
  copyMarkdown().catch(() => alert("Unable to copy. Browser denied clipboard access."));
});

renderHistory();
ideaEl.value =
  "Build a lightweight NEAR launch co-pilot that turns one product idea into MVP scope, execution plan, and risk checklist.";
