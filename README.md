# GenoRoot Hair & Scalp Intake

A mobile-first, patient-facing 16-question hair and scalp clinic intake. It has no backend, login, or tracking: answers remain in the browser until the user submits the review screen.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use a phone-sized viewport for the intended experience.

## Key decisions

- **Autosave and resume:** every answer and screen transition is saved under the versioned `genoroot-intake-v1` localStorage key. Reloading restores the patient to their exact saved screen. The key is removed after a successful submission.
- **Clear, mobile-native questions:** long tables are collapsed into tap-friendly chips; follow-up details appear only when a product, procedure, or habit applies.
- **Privacy and transparency:** an explicit sex gate controls Q6/Q7 visibility but is never included in the submitted JSON. Q6/Q7 are represented as `null` when not applicable.
- **Voice as an enhancement:** Q14 uses the browser-native Web Speech API when available and always keeps a text field as the reliable fallback. No paid services or API keys are used.

## Data and verification

The final JSON has all 16 schema keys from `../intake-schema.json`; optional skipped answers use `null`, and untouched product/procedure rows use `false` with null follow-ups. Skipped questions keep their key with value `null` in the output, representing an explicit decline rather than a missing field. This avoids forcing disclosure on sensitive items (e.g. pregnancy status, facial hair, treatment side effects) while ensuring all 16 questions are structurally accounted for in every submission. The review screen presents the same answers in patient-readable language before submission.

Verified with `npm run lint` and a production build. For final delivery, run three complete manual personas: (1) male, confirming Q6/Q7 submit as null; (2) female, confirming both save; and (3) every Q11–Q13 follow-up plus the Q14 typed/voice path. Compare each output to the schema.

## With one more week

I would add automated browser tests for those three personas, accessibility testing with a screen reader, translated patient copy, and an optional secure clinician handoff.
