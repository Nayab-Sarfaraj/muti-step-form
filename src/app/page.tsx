"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FinalDetailsScreen, HairStoryScreen, HealthScreen, NoticeScreen, RecentChangesScreen, type Gate, WelcomeScreen } from "@/components/intake/basic-screens";
import { HabitsScreen } from "@/components/intake/habits-screen";
import { IntakeShell } from "@/components/intake/intake-shell";
import { ReviewScreen } from "@/components/intake/review-screen";
import { TreatmentsScreen } from "@/components/intake/treatments-screen";
import { createEmptyForm, type IntakeForm, STORAGE_KEY } from "@/lib/intake";

type Saved = { form: IntakeForm; screen: number; gate: Gate; editSessionActive?: boolean };

export default function Home() {
  const [form, setForm] = useState<IntakeForm>(createEmptyForm);
  const [screen, setScreen] = useState(0);
  const [editSessionActive, setEditSessionActive] = useState(false);
  const [gate, setGate] = useState<Gate>(null);
  const [restoring, setRestoring] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [ageError, setAgeError] = useState("");
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [recording, setRecording] = useState(false);
  const hasRestored = useRef(false);
  const update = <K extends keyof IntakeForm>(key: K, value: IntakeForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const go = (nextScreen: number) => { setScreen(nextScreen); window.scrollTo({ top: 0, behavior: "smooth" }); };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) try { const intake = JSON.parse(saved) as Saved; setForm(intake.form); setScreen(intake.screen); setGate(intake.gate); setEditSessionActive(Boolean(intake.editSessionActive)); } catch { localStorage.removeItem(STORAGE_KEY); }
      hasRestored.current = true;
      setRestoring(false);
      setVoiceAvailable(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasRestored.current) localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, screen, gate, editSessionActive }));
  }, [editSessionActive, form, gate, screen]);

  const validateAge = () => { const valid = Boolean(form.age_hair_loss_began && form.age_hair_loss_began > 0 && form.age_hair_loss_began < 121); setAgeError(valid ? "" : "Enter an age between 1 and 120."); return valid; };
  const startVoice = () => { const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition; if (!Recognition) return; const recognition = new Recognition(); recognition.lang = "en-IN"; recognition.interimResults = false; recognition.onstart = () => setRecording(true); recognition.onend = () => setRecording(false); recognition.onerror = () => setRecording(false); recognition.onresult = (event) => update("describe", [form.describe, event.results[0][0].transcript].filter(Boolean).join(" ")); recognition.start(); };
  const next = () => { if (screen === 1 && !validateAge()) return; if (screen === 8) { localStorage.removeItem(STORAGE_KEY); setSubmitted(true); return; } if (editSessionActive) { setEditSessionActive(false); go(8); return; } go(screen + 1); };
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
    <ReviewScreen key="review" form={form} onEdit={(target) => { setEditSessionActive(true); go(target); }} />,
  ];
  const json = useMemo(() => JSON.stringify(form, null, 2), [form]);
  if (restoring) return <main className="grid min-h-screen place-items-center bg-[#f8f7f2] p-6 text-center text-stone-600"><p className="text-sm font-semibold">Restoring your saved intake…</p></main>;
  if (submitted) return <main className="min-h-screen bg-stone-50 p-5 sm:p-10"><section className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-sm"><p className="text-sm font-bold uppercase tracking-widest text-teal-700">Intake submitted</p><h1 className="mt-2 text-3xl font-bold">Thank you for sharing.</h1><pre className="mt-6 overflow-x-auto rounded-2xl bg-stone-950 p-5 text-xs leading-5 text-teal-100">{json}</pre></section></main>;
  const label = screen === 8 ? "Submit intake" : editSessionActive ? "Save & Return to Review" : screen === 0 ? "Start in 2 minutes" : "Next";
  return <IntakeShell screen={screen} disabled={disabled} primaryLabel={label} onBack={() => go(screen - 1)} onNext={next}>{content[screen]}</IntakeShell>;
}
