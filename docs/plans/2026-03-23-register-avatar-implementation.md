# Register Avatar Upload Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Add a required registration avatar flow that uses a single tappable avatar trigger for WeChat avatar selection and album/camera upload, while preserving a clean upload adapter boundary for a future backend service.

**Architecture:** Extend the shared student profile model with avatar fields, keep the register page thin, add a dedicated avatar field component for UI, and route all Mini Program media selection/upload logic through a single composable. Use TDD so submit-gating and state-model changes are proven before template and platform wiring are added.

**Tech Stack:** `uni-app`, Vue 3 SFCs with `<script setup lang="ts">`, WeChat Mini Program open capability and media APIs, Vitest, Vue Test Utils

### Task 1: Extend the student profile model for avatars

**Files:**
- Modify: `src/types/student.ts`
- Modify: `src/domain/student/state.ts`
- Test: `src/tests/accessFlow.spec.ts`

**Step 1: Write the failing test**

Add assertions that the initial student profile includes empty avatar fields and that completing a profile preserves the submitted avatar metadata.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/tests/accessFlow.spec.ts`

Expected: FAIL because `StudentProfile` and the empty profile state do not include avatar fields yet.

**Step 3: Write minimal implementation**

Add `avatarUrl` and `avatarSource` to the profile type and empty-state initializer, then let `completeStudentProfile` carry the values through unchanged.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/tests/accessFlow.spec.ts`

Expected: PASS with avatar fields present in initial and completed profile state.

### Task 2: Add registration-form submit gating for avatar state

**Files:**
- Modify: `src/components/access/RegistrationForm.vue`
- Test: `src/tests/registrationForm.spec.ts`

**Step 1: Write the failing test**

Add component tests that fill the existing registration inputs and prove submit is blocked when avatar upload is missing or uploading.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/tests/registrationForm.spec.ts`

Expected: FAIL because the current form can submit without any avatar state.

**Step 3: Write minimal implementation**

Introduce avatar state into the registration payload, require successful avatar upload in `canSubmit`, and keep upload state separate from the rest of the form.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/tests/registrationForm.spec.ts`

Expected: PASS with submit blocked until avatar upload succeeds.

### Task 3: Add the avatar field component and upload composable

**Files:**
- Create: `src/components/access/RegistrationAvatarField.vue`
- Create: `src/uni-app/composables/useRegistrationAvatar.ts`
- Modify: `src/components/access/RegistrationForm.vue`
- Test: `src/tests/registrationForm.spec.ts`

**Step 1: Write the failing test**

Add a passing-path component test that expects the form to emit a payload containing `avatarUrl` and `avatarSource` after avatar state is marked successful.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/tests/registrationForm.spec.ts`

Expected: FAIL because the form cannot yet render or merge avatar state into submission.

**Step 3: Write minimal implementation**

Create the avatar field UI around a single avatar trigger, wire it to a dedicated avatar composable, and emit complete registration payloads with avatar fields included.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/tests/registrationForm.spec.ts`

Expected: PASS with avatar data included in the emitted payload.

### Task 4: Wire WeChat avatar, image selection, and upload adapter

**Files:**
- Modify: `src/components/access/RegistrationAvatarField.vue`
- Modify: `src/uni-app/composables/useRegistrationAvatar.ts`
- Test: `src/tests/uiReviewFixes.spec.ts`

**Step 1: Write the failing test**

Add static regression assertions that the avatar field exposes WeChat avatar wiring and the composable uses `uni.chooseImage` and `uni.uploadFile`.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/tests/uiReviewFixes.spec.ts`

Expected: FAIL because the register flow does not yet contain the required Mini Program avatar wiring.

**Step 3: Write minimal implementation**

Use a single avatar trigger that opens a lightweight picker panel, keep the Mini Program `button` with `open-type="chooseAvatar"` inside that panel, read `detail.avatarUrl`, call `uni.chooseImage` for album/camera flows, and centralize upload behavior in `uploadAvatar(filePath)`.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/tests/uiReviewFixes.spec.ts`

Expected: PASS with explicit avatar platform hooks present in source.

### Task 5: Update register-page integration and document placeholder upload behavior

**Files:**
- Modify: `src/uni-app/pages/access/register.vue`
- Modify: `docs/plans/2026-03-23-register-avatar-design.md`
- Test: `src/tests/accessFlow.spec.ts`
- Test: `src/tests/registrationForm.spec.ts`
- Test: `src/tests/uiReviewFixes.spec.ts`

**Step 1: Write the failing test**

Add or extend a test that verifies the register flow still transitions to the baseline questionnaire after a completed profile submission with avatar data.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/tests/accessFlow.spec.ts src/tests/registrationForm.spec.ts src/tests/uiReviewFixes.spec.ts`

Expected: FAIL because the register page and docs do not yet reflect the completed avatar-backed contract.

**Step 3: Write minimal implementation**

Keep the register page thin, ensure avatar-backed registration payloads are accepted without changing the post-submit navigation flow, and document the temporary placeholder upload branch clearly.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/tests/accessFlow.spec.ts src/tests/registrationForm.spec.ts src/tests/uiReviewFixes.spec.ts`

Expected: PASS with navigation intact and docs updated.
