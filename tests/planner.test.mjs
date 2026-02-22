import test from "node:test";
import assert from "node:assert/strict";

import { generatePitchPlan, toMarkdown } from "../src/planner.mjs";

test("generatePitchPlan requires non-empty prompt", () => {
  assert.throws(() => generatePitchPlan("   "));
});

test("generatePitchPlan returns required challenge fields", () => {
  const plan = generatePitchPlan(
    "Build a NEAR analytics dashboard for founders to track weekly growth and risks."
  );

  assert.equal(typeof plan.original_prompt, "string");
  assert.equal(typeof plan.interpretation, "string");
  assert.ok(Array.isArray(plan.tech_stack));
  assert.ok(Array.isArray(plan.features_implemented));
  assert.equal(typeof plan.time_to_first_working_version, "string");
  assert.ok(plan.features_implemented.length >= 4);
});

test("NEAR-specific prompts inject NEAR context feature", () => {
  const plan = generatePitchPlan("Create a NEAR content workflow for ecosystem updates.");
  assert.ok(plan.features_implemented.some((item) => item.includes("NEAR-specific")));
});

test("toMarkdown includes essential sections", () => {
  const plan = generatePitchPlan("Create a developer tool for shipping faster.");
  const md = toMarkdown(plan);

  assert.ok(md.includes("## Features Implemented"));
  assert.ok(md.includes("## MVP Scope (In)"));
  assert.ok(md.includes("## Execution Plan"));
});
