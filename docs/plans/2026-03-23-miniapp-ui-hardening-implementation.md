# Miniapp UI Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the highest-risk web-style UI patterns from the WeChat mini-program surfaces and replace them with safer miniapp-friendly interaction and layout patterns.

**Architecture:** Keep the existing shared Vue component structure, but harden the critical UI surfaces identified in the research report. Focus on three layers: interaction semantics, layout stability, and page-shell decoration. Lock the behavior with targeted regression tests before implementation.

**Tech Stack:** Vue 3, uni-app, TypeScript, Vitest, Vue Test Utils, UnoCSS

### Task 1: Lock the critical UI risks with tests

**Files:**
- Modify: `src/tests/uiReviewFixes.spec.ts`

**Steps:**
1. Add assertions that critical miniapp CTA surfaces no longer use `role="button"`, `tabindex`, or `@keydown` keyboard handlers.
2. Add assertions that the miniapp home page uses `navigator` instead of faux button `view` actions.
3. Add assertions that `GrowthSummaryCards`, `AdherenceHeatmap`, and `DailyProgressCard` no longer rely on grid layout in the shared miniapp-critical surfaces.
4. Add assertions that `AccessPageShell` no longer uses fixed decorative blobs.
5. Run the targeted test file and verify it fails for the expected reasons.

### Task 2: Replace the web-style interaction semantics

**Files:**
- Modify: `src/components/training/TrainingModeCard.vue`
- Modify: `src/components/access/QuestionnaireResultCard.vue`
- Modify: `src/uni-app/pages/training/home.vue`

**Steps:**
1. Remove the keyboard-only web affordances from shared clickable cards.
2. Keep event-driven shared card behavior explicit through props/emits and touch/click handling only.
3. Replace miniapp home navigation actions with `navigator` components and preserve styling.
4. Re-run the targeted tests and verify the interaction assertions pass.

### Task 3: Replace unstable layout and shell patterns

**Files:**
- Modify: `src/components/growth/GrowthSummaryCards.vue`
- Modify: `src/components/growth/AdherenceHeatmap.vue`
- Modify: `src/components/training/DailyProgressCard.vue`
- Modify: `src/components/access/AccessPageShell.vue`
- Modify: `uno.config.ts`

**Steps:**
1. Replace grid-based shared layouts on the identified critical surfaces with safer flex-based layouts.
2. Remove fixed decorative shell blobs from the access shell.
3. Narrow broad transition shortcuts so shared miniapp components stop defaulting to `transition-all`.
4. Run the targeted tests again and verify the layout assertions pass.

### Task 4: Verify the final behavior

**Files:**
- Modify: `src/tests/uiReviewFixes.spec.ts` if minor expectation cleanup is needed

**Steps:**
1. Run `pnpm vitest run src/tests/uiReviewFixes.spec.ts`.
2. Run `pnpm vitest run` if the targeted test file passes.
3. Review the diff for the touched files only and ensure no unrelated changes were reverted.
