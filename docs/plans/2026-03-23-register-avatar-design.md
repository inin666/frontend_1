# Register Avatar Upload Design

**Date:** 2026-03-23

**Goal:** Replace the registration form's emoji-style identity cue with a real avatar upload flow that supports WeChat avatar selection and album/camera image upload in the Mini Program, while keeping the upload boundary ready for a future backend API.

## Context

The current registration flow in `/src/uni-app/pages/access/register.vue` delegates profile capture to `/src/components/access/RegistrationForm.vue`. The form currently captures only text and numeric profile data and emits it directly into the student store. There is no avatar field in `StudentProfile`, no upload adapter, and no persistence contract for media.

The team wants to support two avatar acquisition paths during registration:

- Use a WeChat avatar via Mini Program open capability.
- Upload an image from album or camera.

The backend upload API does not exist yet, but the frontend should be structured so that a real upload endpoint can be dropped in later without rewriting the form.

## Chosen Approach

Use a split presentation/logic design:

- Keep `/src/uni-app/pages/access/register.vue` thin.
- Keep `/src/components/access/RegistrationForm.vue` as the feature container for registration state and submission.
- Add `/src/components/access/RegistrationAvatarField.vue` as the focused avatar UI section.
- Add `/src/uni-app/composables/useRegistrationAvatar.ts` as the platform and upload orchestration layer.

This keeps the form readable, makes the avatar workflow testable, and limits the future backend swap to one adapter boundary.

## Data Model Changes

Add the following fields to `StudentProfile`:

- `avatarUrl: string`
- `avatarSource: '' | 'wechat' | 'album' | 'camera'`

These fields will also flow through the registration payload and the initial empty profile state.

## Interaction Model

The registration form gains a required avatar section ahead of the existing profile fields.

The avatar section shows:

- A single tappable preview circle area with either the current avatar or a placeholder.
- A lightweight picker panel that appears after tapping the avatar area.
- WeChat avatar, album, and camera choices inside that temporary panel.
- Uploading and error states.

Flow:

1. The user taps the avatar area and chooses WeChat avatar, album, or camera from the temporary picker panel.
2. The form immediately uploads the selected local path through `uploadAvatar(filePath)`.
3. On success, the form stores the returned `avatarUrl` and `avatarSource`.
4. On failure, the form blocks submission and shows a retryable error.
5. The registration submit button stays disabled until avatar upload succeeds and the rest of the form is valid.

## Platform API Contract

Official WeChat documentation confirms the Mini Program avatar flow uses a `button` with `open-type="chooseAvatar"` and the `bindchooseavatar` callback exposes a temporary avatar path. The same documentation notes that from base library `2.24.4`, unsafe images do not trigger the callback.

Official image and upload documentation confirms:

- `wx.chooseImage` returns `tempFilePaths` local temporary paths and accepts `sourceType` values `album` and `camera`.
- `wx.uploadFile` uploads a local `filePath` to a developer server and requires a multipart field `name`.

Based on that, the frontend upload boundary will be:

```ts
type UploadAvatarResult = {
  avatarUrl: string
}

async function uploadAvatar(filePath: string): Promise<UploadAvatarResult>
```

Initial implementation:

- If a configured upload endpoint exists, call `uni.uploadFile`.
- If no endpoint exists yet, return the local file path as a placeholder `avatarUrl` so the UI works end-to-end during development.

This placeholder mode is intentionally temporary and does not provide durable cross-device storage.

## Component Boundaries

### `/src/components/access/RegistrationForm.vue`

Responsibilities:

- Own registration form state.
- Own avatar upload state via `useRegistrationAvatar`.
- Merge avatar data into the emitted registration payload.
- Block submission while avatar is missing, uploading, or failed.

### `/src/components/access/RegistrationAvatarField.vue`

Responsibilities:

- Render the single avatar trigger, helper text, temporary picker panel, loading state, and error state.
- Emit user intent upward.
- Stay free of upload and store logic.

### `/src/uni-app/composables/useRegistrationAvatar.ts`

Responsibilities:

- Detect whether WeChat avatar capability should be shown.
- Accept avatar selection events and temporary file paths.
- Choose local images from album/camera.
- Upload selected files through the adapter.
- Expose stable reactive state to the form.

## Error Handling

The avatar flow uses explicit status values:

- `idle`
- `uploading`
- `success`
- `error`

Error cases that must block submission:

- User has not selected an avatar.
- Upload failed.
- Upload is still in progress.
- Upload returned an invalid response without `avatarUrl`.

## Testing Strategy

### Domain tests

Update state-model tests so avatar fields are present in the initial profile shape and preserved when the student profile is completed.

### Component tests

Add registration-form behavior tests that prove:

- the form does not emit submit without an avatar
- the form does not emit submit while avatar upload is in progress
- the form emits submit once avatar upload has succeeded and all other fields are valid

### Static regression tests

Update file-content assertions to keep the Mini Program wiring visible:

- WeChat avatar button uses `open-type="chooseAvatar"`
- the avatar callback reads `detail.avatarUrl`
- image selection uses `uni.chooseImage`
- the upload adapter uses `uni.uploadFile` or the placeholder endpoint branch

## Follow-Up For Backend Integration

When the backend API is ready, only the upload adapter should need behavior changes:

1. Set the upload endpoint configuration.
2. Adjust request headers and `formData` if the backend requires auth or metadata.
3. Parse the server response shape into `{ avatarUrl }`.
4. Optionally replace the placeholder branch with a hard failure when the endpoint is missing.
