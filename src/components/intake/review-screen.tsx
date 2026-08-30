import type { IntakeForm } from "@/lib/intake";
import { createSubmissionPayload, PRODUCT_NAMES, PROCEDURE_NAMES } from "@/lib/intake";
import { Heading } from "./form-controls";

type Answer = { label: string; value: string; skipped?: boolean };

const optional = (label: string, value: string | string[] | null): Answer => {
  if (value === null || (Array.isArray(value) && value.length === 0)) return { label, value: "Skipped", skipped: true };
  return { label, value: Array.isArray(value) ? value.join(", ") : value };
};

function habitsSummary(form: IntakeForm) {
  const applies = [
    form.habits.smoking === "yes" && "smoking",
    form.habits.alcohol === "yes" && "alcohol",
    form.habits.hard_water === "yes" && "hard water at home",
    form.habits.heating_tools_styling_chemicals === "yes" && "heat styling or chemicals",
    form.habits.salon_treatments === "yes" && "salon treatments",
  ].filter(Boolean) as string[];
  const wash = form.habits.hair_wash_frequency ? ` Hair wash frequency: ${form.habits.hair_wash_frequency}.` : " Hair wash frequency not shared.";
  return `${applies.length ? `You mentioned ${applies.join(", ")}.` : "None of these apply to you."}${wash}`;
}

function treatmentSummary(name: string, details: string[]) {
  return details.length ? `${name}, ${details.join(" — ")}` : `${name} — details not shared`;
}

export function ReviewScreen({ form, onEdit, showFemaleOnlyFields }: { form: IntakeForm; onEdit: (screen: number) => void; showFemaleOnlyFields: boolean }) {
  const submitted = createSubmissionPayload(form);
  const products = PRODUCT_NAMES.filter((name) => form.products[name].used).map((name) => treatmentSummary(name, [form.products[name].duration && `used ${form.products[name].duration.replace("-", "–")}`, form.products[name].helped === "yes" && "helped", form.products[name].helped === "no" && "didn’t help", form.products[name].side_effects === "yes" && "side effects reported", form.products[name].side_effects === "no" && "no side effects reported"].filter(Boolean) as string[])).join(". ") || "None used.";
  const procedures = PROCEDURE_NAMES.filter((name) => form.procedures[name].done).map((name) => treatmentSummary(name, [form.procedures[name].sessions && `${form.procedures[name].sessions} sessions`, form.procedures[name].helped === "yes" && "helped", form.procedures[name].helped === "no" && "didn’t help"].filter(Boolean) as string[])).join(". ") || "None done.";
  const answers: Answer[] = [
    { label: "Hair loss began", value: `Age ${form.age_hair_loss_began}` },
    { label: "Duration", value: form.duration! },
    optional("Family history", submitted.family_history), optional("Pattern", submitted.pattern), optional("Diagnosed conditions", submitted.diagnosed_conditions), ...(showFemaleOnlyFields ? [optional("Menstrual cycle", submitted.menstrual_cycle), optional("Pregnancy-related", submitted.pregnancy_related)] : []), optional("Adult acne / oily skin", submitted.adult_acne_oily_skin), optional("Excess body / facial hair", submitted.excess_body_facial_hair), optional("Recent changes", submitted.past_6_months),
    { label: "Habits", value: habitsSummary(form) }, { label: "Products", value: products }, { label: "Procedures", value: procedures }, optional("Past treatment side effects", submitted.past_treatment_side_effects === "yes" ? submitted.describe ? `Yes — ${submitted.describe}` : "Yes" : submitted.past_treatment_side_effects), optional("Sample type", submitted.sample_type), { label: "Consent", value: form.consent! },
  ];
  const sections = [[1, "Your hair story"], [2, "What you’ve noticed"], [3, "Health context"], [4, "Recent changes"], [5, "Your habits"], [6, "Treatments"], [7, "Final details"]] as const;
  return <><Heading title="Check your answers" copy="Tap a section to edit it before submitting." /><div className="mt-6 divide-y divide-stone-100 rounded-2xl border border-stone-200 px-4">{answers.map(({ label, value, skipped }) => <div key={label} className="py-3"><p className="text-xs font-bold uppercase tracking-wider text-stone-500">{label}</p><p className={`mt-1 text-sm ${skipped ? "font-medium text-stone-400" : "font-medium text-stone-800"}`}>{value}</p></div>)}</div><div className="mt-6 grid gap-3">{sections.map(([screen, name]) => <button type="button" key={screen} onClick={() => onEdit(screen)} className="flex min-h-14 items-center justify-between rounded-2xl border border-stone-200 px-4 text-left font-bold hover:border-teal-400"><span>{name}</span><span className="text-teal-700">Edit →</span></button>)}</div></>;
}
