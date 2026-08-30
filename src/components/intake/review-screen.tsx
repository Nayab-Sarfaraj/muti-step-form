import type { IntakeForm } from "@/lib/intake";
import { PRODUCT_NAMES, PROCEDURE_NAMES } from "@/lib/intake";
import { Heading } from "./form-controls";

export function ReviewScreen({
  form,
  onEdit,
}: {
  form: IntakeForm;
  onEdit: (screen: number) => void;
}) {
  const products =
    PRODUCT_NAMES.filter((name) => form.products[name].used)
      .map(
        (name) =>
          `${name} (${form.products[name].duration ?? "duration not answered"}; helped: ${form.products[name].helped ?? "not answered"}; side effects: ${form.products[name].side_effects ?? "not answered"})`,
      )
      .join("; ") || "Not used";
  const procedures =
    PROCEDURE_NAMES.filter((name) => form.procedures[name].done)
      .map(
        (name) =>
          `${name} (${form.procedures[name].sessions ?? "sessions not answered"}; helped: ${form.procedures[name].helped ?? "not answered"})`,
      )
      .join("; ") || "Not done";
  const answers = [
    [
      "Hair loss began",
      form.age_hair_loss_began
        ? `Age ${form.age_hair_loss_began}`
        : "Not answered",
    ],
    ["Duration", form.duration ?? "Not answered"],
    ["Family history", form.family_history?.join(", ") || "Not answered"],
    ["Pattern", form.pattern?.join(", ") || "Not answered"],
    [
      "Diagnosed conditions",
      form.diagnosed_conditions?.join(", ") || "Not answered",
    ],
    ["Menstrual cycle", form.menstrual_cycle ?? "Not applicable"],
    ["Pregnancy-related", form.pregnancy_related ?? "Not applicable"],
    ["Adult acne / oily skin", form.adult_acne_oily_skin ?? "Not answered"],
    [
      "Excess body / facial hair",
      form.excess_body_facial_hair ?? "Not answered",
    ],
    ["Recent changes", form.past_6_months?.join(", ") || "Not answered"],
    [
      "Habits",
      `Smoking: ${form.habits.smoking}${form.habits.smoking_severity ? ` (${form.habits.smoking_severity})` : ""}; Alcohol: ${form.habits.alcohol}; Hard water: ${form.habits.hard_water}; Hair wash: ${form.habits.hair_wash_frequency ?? "Not answered"}; Styling/chemicals: ${form.habits.heating_tools_styling_chemicals}; Salon: ${form.habits.salon_treatments}${form.habits.salon_treatment_detail ? ` (${form.habits.salon_treatment_detail})` : ""}`,
    ],
    ["Products", products],
    ["Procedures", procedures],
    [
      "Past treatment side effects",
      `${form.past_treatment_side_effects ?? "Not answered"}${form.describe ? ` — ${form.describe}` : ""}`,
    ],
    ["Sample type", form.sample_type ?? "Not answered"],
    ["Consent", form.consent ?? "Not answered"],
  ];
  const sections = [
    [1, "Your hair story"],
    [2, "What you’ve noticed"],
    [3, "Health context"],
    [4, "Recent changes"],
    [5, "Your habits"],
    [6, "Treatments"],
    [7, "Final details"],
  ] as const;
  return (
    <>
      <Heading
        title="Check your answers"
        copy="Tap a section to edit it before submitting."
      />
      <div className="mt-6 divide-y divide-stone-100 rounded-2xl border border-stone-200 px-4">
        {answers.map(([label, value]) => (
          <div key={label} className="py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {label}
            </p>
            <p className="mt-1 text-sm font-medium">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3">
        {sections.map(([screen, name]) => (
          <button
            type="button"
            key={screen}
            onClick={() => onEdit(screen)}
            className="flex min-h-14 items-center justify-between rounded-2xl border border-stone-200 px-4 text-left font-bold hover:border-teal-400"
          >
            <span>{name}</span>
            <span className="text-teal-700">Edit →</span>
          </button>
        ))}
      </div>
    </>
  );
}
