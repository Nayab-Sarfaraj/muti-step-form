# GenoRoot Hair & Scalp Intake

A patient-facing intake form for a hair and scalp clinic — built for the Haiku
Studio founding engineer take-home. Gets a patient through 16 questions in a
guided, mobile-first flow and outputs their answers as structured JSON
matching the provided schema.

**Live:** https://muti-step-form-inky.vercel.app

---

## How to run it

```bash
git clone https://github.com/Nayab-Sarfaraj/muti-step-form.git
cd muti-step-form
npm install
npm run dev
```

Open `http://localhost:3000`. No environment variables or API keys are
required — everything runs client-side with no backend or database.

---

## My choices

**Stack:** Next.js (App Router, TypeScript), Tailwind CSS, shadcn/ui. No
backend, no database — the whole flow runs in the browser, with progress
saved to `localStorage` and automatically restored if the patient closes
the tab and comes back.

**Voice input:** used the browser's native Web Speech API for the one
free-text question (side-effect description), instead of a paid
transcription service. It's free, needs no setup, and is good enough for a
short spoken note — reaching for Deepgram/Whisper here would have been
solving a problem that didn't exist. Since Speech Recognition support is
inconsistent on iOS Safari and unsupported on iOS Chrome, a plain text
field is always available as a fallback — voice is an enhancement, never
the only way to answer.

**Bought vs. built:** nothing paid was used anywhere. Every dependency is
free/open-source (Next.js, Tailwind, shadcn/ui, the browser's own Speech
Recognition API).

**Key design decisions:**

- *An explicit, transparent sex-gate screen instead of a checkbox.*
  Questions 6 and 7 only make sense for female patients, and the brief
  left it open how to handle that. A quiet checkbox is easy to miss and
  has no honest "unset" state — someone could skip past it and get
  silently mis-routed. A dedicated screen with three options (Male /
  Female / Prefer not to say), framed as "this helps us skip questions
  that don't apply to you," makes it a deliberate choice instead of an
  accident, at the cost of one extra screen.

- *Tables become tap-to-expand, not literal tables.* Questions 11–13 are
  structured as tables in the schema (rows × columns), which is a bad fit
  for a phone screen. Instead, each row is a chip — tap it to mark "used/
  done," which expands an inline follow-up card for just that item's
  details. Untouched rows stay collapsed and submit as "not used," so a
  patient with no treatment history skips this section in seconds instead
  of scrolling through a table.

- *Skipped answers are `null`, not missing.* Every one of the 16 question
  keys — plus the Q14 follow-up `describe` field — is always present in
  the final JSON. If a question has a schema-native
  "None"/"Not applicable" option, that's the skip. Where no such option
  exists, the patient can decline and the field is written as `null` —
  present, but explicitly unanswered — rather than forcing a guess on
  sensitive questions (pregnancy status, facial hair, side effects). Only
  age, duration, and consent are hard-required to submit.

- *Autosave, every step.* Progress writes to `localStorage` after every
  screen. Reloading or closing the tab mid-form automatically restores
  where the patient left off, rather than starting over — directly
  answering the brief's own framing that people abandon long forms.

---

## How I tested the fill
 
I manually ran through the flow as three personas in a real browser and
diffed the final JSON against the schema each time:
 
1. **Male patient** — confirmed questions 6 and 7 (menstrual cycle,
   pregnancy) never appear anywhere in the flow *or* on the review screen,
   and their keys still exist in the output JSON as `null`.
2. **Female patient** — confirmed questions 6 and 7 appear and their
   answers persist correctly to the final output.
3. **Full-coverage run** — hit every "yes" branch on the table questions
   (products, procedures, habits) to confirm each follow-up field maps to
   the right key, and tested the voice input on Q14 both with and without
   microphone permission to confirm the text fallback works when speech
   recognition isn't available.
Automated checks (lint, production build, and a `verify:intake` script)
pass as well.
 
This testing surfaced and fixed a few real bugs before submission:
progress wasn't saving on the review screen, editing an earlier answer
sent the patient through the entire rest of the form instead of back to
review, and — most notably — the review screen was showing menstrual
cycle/pregnancy fields even for male patients (the summary view wasn't
applying the same sex-based filter the question flow used). All three are
fixed and verified.

---

## What I'd improve with one more week

- A proper accessibility pass — screen reader labels on every custom
  control, full keyboard navigation, and testing with an actual screen
  reader rather than assuming shadcn's defaults cover it.
- Smoother transitions between screens (a small slide/fade) so the wizard
  feels less like a series of hard page swaps.
- Voice input on more than just the one free-text question — for a
  patient who prefers speaking over tapping throughout.
- Basic anonymous analytics on where patients pause or abandon, so the
  clinic could see which questions cause friction in practice, not just
  in my own testing.
