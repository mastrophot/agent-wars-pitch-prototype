const CATEGORY_RULES = [
  {
    name: "security",
    keywords: ["security", "phishing", "hack", "wallet", "risk", "fraud", "alert"],
    interpretation:
      "A security-focused product that continuously surfaces risks, explains impact, and gives immediate mitigation steps.",
    baseFeatures: [
      "Risk scanner with severity labels",
      "Action checklist with step-by-step fixes",
      "Historical incident timeline",
      "Copy-ready security report",
    ],
    stack: ["HTML", "CSS", "Vanilla JavaScript"],
    risks: [
      "False positives may reduce trust if wording is too aggressive.",
      "Security guidance must stay precise and non-ambiguous.",
    ],
  },
  {
    name: "analytics",
    keywords: ["analytics", "dashboard", "metrics", "insights", "report", "monitor", "trend"],
    interpretation:
      "An analytics surface that converts raw activity into plain-language trends, outliers, and next actions.",
    baseFeatures: [
      "Live KPI panel",
      "Trend and anomaly summary",
      "Period-over-period comparison",
      "Export to JSON and Markdown",
    ],
    stack: ["HTML", "CSS", "Vanilla JavaScript", "Chart.js (optional)"],
    risks: [
      "Metric definitions can drift if assumptions are undocumented.",
      "Visual clutter can hide the most important signals.",
    ],
  },
  {
    name: "content",
    keywords: ["content", "thread", "post", "tweet", "marketing", "creator", "campaign"],
    interpretation:
      "A content workflow tool that transforms one idea into structured drafts for multiple channels.",
    baseFeatures: [
      "Multi-format draft generator",
      "Tone presets (educational, bold, concise)",
      "Call-to-action suggestions",
      "Revision history in local storage",
    ],
    stack: ["HTML", "CSS", "Vanilla JavaScript"],
    risks: [
      "Generated copy can become repetitive without variation rules.",
      "Tone may drift from brand voice if constraints are unclear.",
    ],
  },
  {
    name: "developer-tool",
    keywords: ["dev", "developer", "code", "sdk", "cli", "extension", "tool"],
    interpretation:
      "A developer utility that accelerates delivery by automating repetitive setup, validation, and output formatting.",
    baseFeatures: [
      "Input validator and auto-fixes",
      "Command preview with copy buttons",
      "Template output generator",
      "Run summary with next steps",
    ],
    stack: ["HTML", "CSS", "Vanilla JavaScript", "Node.js (optional CLI layer)"],
    risks: [
      "Over-automation can hide important edge cases.",
      "Command output can break across OS environments.",
    ],
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toKeywords(sentence) {
  return sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function inferCategory(sentence) {
  const words = toKeywords(sentence);
  let best = CATEGORY_RULES[0];
  let bestScore = -1;

  for (const category of CATEGORY_RULES) {
    let score = 0;
    for (const keyword of category.keywords) {
      if (words.includes(keyword)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      best = category;
      bestScore = score;
    }
  }

  if (bestScore <= 0) {
    return {
      name: "general-product",
      interpretation:
        "A practical productized workflow that turns a broad idea into a testable MVP with clear user value.",
      baseFeatures: [
        "Clear value proposition summary",
        "MVP scope with strict non-goals",
        "Execution checklist",
        "Exportable delivery brief",
      ],
      stack: ["HTML", "CSS", "Vanilla JavaScript"],
      risks: [
        "Scope can expand without clear non-goals.",
        "Ambiguous outcomes can block prioritization.",
      ],
    };
  }

  return best;
}

function inferAudience(sentence) {
  const words = toKeywords(sentence);
  if (words.includes("founder") || words.includes("startup") || words.includes("entrepreneur")) {
    return "Founders validating and shipping quickly";
  }
  if (words.includes("developer") || words.includes("engineer") || words.includes("builder")) {
    return "Developers who want faster implementation cycles";
  }
  if (words.includes("trader") || words.includes("investor") || words.includes("defi")) {
    return "On-chain users making time-sensitive decisions";
  }
  return "Builders and operators who need structured execution";
}

function buildFeatureList(sentence, category) {
  const words = toKeywords(sentence);
  const nearAware = words.includes("near") || words.includes("nearai") || words.includes("nearcon");
  const features = [...category.baseFeatures];

  if (nearAware) {
    features.push("NEAR-specific examples and terminology mapping");
  }
  if (words.includes("api") || words.includes("feed")) {
    features.push("External API health state indicator");
  }
  if (words.includes("mobile") || words.includes("telegram")) {
    features.push("Mobile-first output formatting");
  }

  return features.slice(0, 6);
}

function buildMilestones(featureCount) {
  const baseMinutes = 18;
  const total = clamp(baseMinutes + featureCount * 4, 24, 46);
  const checkpoints = [
    { name: "Skeleton UI + routing", minute: 8 },
    { name: "Core generation engine", minute: 16 },
    { name: "Export + persistence", minute: 24 },
    { name: "Polish + QA", minute: total },
  ];

  return {
    time_to_first_working_version: `${total} minutes`,
    checkpoints,
  };
}

function buildMvpScope(features) {
  return {
    in_scope: features.slice(0, 4),
    out_of_scope: [
      "Authentication and user accounts",
      "Backend database",
      "Paid third-party APIs",
      "Complex role permissions",
    ],
  };
}

export function generatePitchPlan(originalPrompt) {
  const prompt = String(originalPrompt || "").trim();
  if (!prompt) {
    throw new Error("Prompt is required.");
  }

  const category = inferCategory(prompt);
  const audience = inferAudience(prompt);
  const features = buildFeatureList(prompt, category);
  const milestones = buildMilestones(features.length);

  return {
    original_prompt: prompt,
    interpretation: category.interpretation,
    target_audience: audience,
    deliverable_type: "working web prototype",
    tech_stack: category.stack,
    features_implemented: features,
    mvp_scope: buildMvpScope(features),
    risks: category.risks,
    execution_plan: milestones.checkpoints,
    time_to_first_working_version: milestones.time_to_first_working_version,
  };
}

export function toMarkdown(plan) {
  const lines = [];
  lines.push(`# ${plan.original_prompt}`);
  lines.push("");
  lines.push(`**Interpretation:** ${plan.interpretation}`);
  lines.push(`**Target audience:** ${plan.target_audience}`);
  lines.push(`**Tech stack:** ${plan.tech_stack.join(", ")}`);
  lines.push(`**Time to first working version:** ${plan.time_to_first_working_version}`);
  lines.push("");
  lines.push("## Features Implemented");
  for (const feature of plan.features_implemented) {
    lines.push(`- ${feature}`);
  }
  lines.push("");
  lines.push("## MVP Scope (In)");
  for (const item of plan.mvp_scope.in_scope) {
    lines.push(`- ${item}`);
  }
  lines.push("");
  lines.push("## MVP Scope (Out)");
  for (const item of plan.mvp_scope.out_of_scope) {
    lines.push(`- ${item}`);
  }
  lines.push("");
  lines.push("## Risks");
  for (const risk of plan.risks) {
    lines.push(`- ${risk}`);
  }
  lines.push("");
  lines.push("## Execution Plan");
  for (const step of plan.execution_plan) {
    lines.push(`- ${step.minute}m: ${step.name}`);
  }
  return lines.join("\n");
}
