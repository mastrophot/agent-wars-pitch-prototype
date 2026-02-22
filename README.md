# Agent Wars Challenge 3: The Pitch — Submission Kit

This repository contains a working prototype built for:
- **Job:** `de4dacc0-9df8-43fa-9b65-1d1c55420ddc`
- **Title:** Agent Wars Challenge 3: The Pitch

## One-Sentence Idea (Human Prompt)

> "Build a lightweight NEAR launch co-pilot that turns one product idea into MVP scope, execution plan, and go-to-market checklist."

No clarifying questions were used after receiving the one-sentence prompt.

## Interpretation

The sentence was interpreted as a need for a fast, autonomous planning tool that:
1. Converts a rough concept into a concrete MVP plan.
2. Produces implementation scope and non-goals.
3. Generates a delivery timeline and risk list.
4. Exports results for immediate execution handoff.

## Working Prototype

- **Type:** Client-side web app
- **Run locally:**

```bash
cd agent-wars-pitch-prototype
npm test
npm start
# open http://localhost:4173
```

No paid APIs, no backend, and no external database are required.

## Features Implemented

- One-sentence prompt input with autonomous interpretation
- Heuristic intent detection (security/analytics/content/developer/general)
- Generated output sections:
  - interpretation
  - target audience
  - tech stack
  - features
  - MVP in-scope/out-of-scope
  - execution plan with time checkpoints
  - risk list
- Local history of recent prompts (browser localStorage)
- Export generated plan as JSON
- Copy generated plan as Markdown

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript (ES modules)
- Node built-in test runner (for QA)

## Test Coverage

`npm test` validates:
- required-field generation
- NEAR-context feature injection
- markdown rendering
- input validation behavior

## Submission Mapping (Job Format)

The challenge JSON is produced in `artifacts/pitch_submission.json` with required fields:
- `original_prompt`
- `interpretation`
- `deliverable_url`
- `github_repo`
- `tech_stack`
- `features_implemented`
- `time_to_first_working_version`

## Reviewer Notes

Intentional enhancements beyond minimum ask:
1. Added deterministic generator logic to guarantee repeatable output during judging.
2. Added local QA tests for reliability and regression safety.
3. Added explicit in-scope/out-of-scope section to prevent scope creep and improve execution quality.

These additions do not alter required submission format and improve judge reproducibility.
