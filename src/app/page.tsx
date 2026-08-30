"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FinalDetailsScreen, HairStoryScreen, HealthScreen, NoticeScreen, RecentChangesScreen, type Gate, WelcomeScreen } from "@/components/intake/basic-screens";
import { HabitsScreen } from "@/components/intake/habits-screen";
import { IntakeShell } from "@/components/intake/intake-shell";
import { ReviewScreen } from "@/components/intake/review-screen";
import { TreatmentsScreen } from "@/components/intake/treatments-screen";
import { createEmptyForm, createSubmissionPayload, type IntakeForm, STORAGE_KEY } from "@/lib/intake";

type Saved = { form: IntakeForm; screen: number; gate: Gate; editSessionActive?: boolean };

export default function Home() {
  const [form, setForm] = useState<IntakeForm>(createEmptyForm);
  const [screen, setScreen] = useState(0);
  const [editSessionActive, setEditSessionActive] = useState(false);
  const [gate, setGate] = useState<Gate>(null);
  const [submitted, setSubmitted] = useState(false);
  const [ageError, setAgeError] = useState("");
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [recording, setRecording] = useState(false);
  const hasRestored = useRef(false);
  const update = <K extends keyof IntakeForm>(key: K, value: IntakeForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const go = (nextScreen: number) => { if (nextScreen === 8) setEditSessionActive(false); setScreen(nextScreen); window.scrollTo({ top: 0, behavior: "smooth" }); };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const intake = JSON.parse(saved) as Saved;
          setForm(intake.form);
          setScreen(intake.screen);
          setGate(intake.gate);
          setEditSessionActive(Boolean(intake.editSessionActive) && intake.screen !== 8);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
      hasRestored.current = true;
      setVoiceAvailable(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasRestored.current) localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, screen, gate, editSessionActive }));
  }, [editSessionActive, form, gate, screen]);

  const validateAge = () => { const valid = Boolean(form.age_hair_loss_began && form.age_hair_loss_began > 0 && form.age_hair_loss_began < 121); setAgeError(valid ? "" : "Enter an age between 1 and 120."); return valid; };
  const startVoice = () => { const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition; if (!Recognition) return; const recognition = new Recognition(); recognition.lang = "en-IN"; recognition.interimResults = false; recognition.onstart = () => setRecording(true); recognition.onend = () => setRecording(false); recognition.onerror = () => setRecording(false); recognition.onresult = (event) => update("describe", [form.describe, event.results[0][0].transcript].filter(Boolean).join(" ")); recognition.start(); };
  const next = () => { if (screen === 1 && !validateAge()) return; if (screen === 8) { localStorage.removeItem(STORAGE_KEY); setSubmitted(true); return; } go(screen + 1); };
  const disabled = (screen === 1 && (!form.age_hair_loss_began || !form.duration)) || (screen === 7 && form.consent !== "yes");
  const content = [
    <WelcomeScreen key="welcome" />,
    <HairStoryScreen key="story" form={form} update={update} ageError={ageError} clearAgeError={() => setAgeError("")} />,
    <NoticeScreen key="notice" form={form} update={update} />,
    <HealthScreen key="health" form={form} update={update} gate={gate} setGate={setGate} />,
    <RecentChangesScreen key="changes" form={form} update={update} />,
    <HabitsScreen key="habits" form={form} setForm={setForm} />,
    <TreatmentsScreen key="treatments" form={form} setForm={setForm} />,
    <FinalDetailsScreen key="details" form={form} update={update} voiceAvailable={voiceAvailable} recording={recording} startVoice={startVoice} />,
    <ReviewScreen key="review" form={form} showFemaleOnlyFields={gate === "female"} onEdit={(target) => { setEditSessionActive(true); go(target); }} />,
  ];
  const json = useMemo(() => JSON.stringify(createSubmissionPayload(form), null, 2), [form]);
  if (submitted) return <main className="min-h-screen bg-stone-50 p-5 sm:p-10"><section className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-sm"><p className="text-sm font-bold uppercase tracking-widest text-teal-700">Intake submitted</p><h1 className="mt-2 text-3xl font-bold">You’re all set</h1><p className="mt-3 max-w-lg text-stone-600">Thanks for sharing this — your clinician will have it before you sit down together.</p><details className="mt-8 rounded-2xl border border-stone-200 p-4"><summary className="cursor-pointer text-sm font-bold text-teal-800">View what was submitted</summary><pre className="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-5 text-xs leading-5 text-teal-100">{json}</pre></details></section></main>;
  const label = screen === 8 ? "Submit intake" : screen === 0 ? "Start in 2 minutes" : "Next";
  const canReturnToReview = editSessionActive && screen !== 8;
  return <IntakeShell screen={screen} disabled={disabled} primaryLabel={label} onBack={() => go(screen - 1)} onNext={next} secondaryLabel={canReturnToReview ? "Save & Return to Review" : undefined} onSecondary={canReturnToReview ? () => { setEditSessionActive(false); go(8); } : undefined}>{content[screen]}</IntakeShell>;
}
