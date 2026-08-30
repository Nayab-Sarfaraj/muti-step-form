import type { IntakeForm } from "@/lib/intake";
import { Choice, ChoiceList, Heading } from "./form-controls";

export function HabitsScreen({
  form,
  setForm,
}: {
  form: IntakeForm;
  setForm: React.Dispatch<React.SetStateAction<IntakeForm>>;
}) {
  const toggle = (
    key:
      | "smoking"
      | "alcohol"
      | "hard_water"
      | "heating_tools_styling_chemicals"
      | "salon_treatments",
  ) =>
    setForm((current) => ({
      ...current,
      habits: {
        ...current.habits,
        [key]: current.habits[key] === "yes" ? "no" : "yes",
      },
    }));
  return (
    <>
      <Heading
        title="A few everyday habits"
        copy="Select anything that applies. Untapped items stay marked as no."
      />
      <div className="mt-6 grid gap-2">
        {(
          [
            ["smoking", "Smoking"],
            ["alcohol", "Alcohol"],
            ["hard_water", "Hard water at home"],
            ["heating_tools_styling_chemicals", "Heat styling or chemicals"],
            ["salon_treatments", "Salon treatments"],
          ] as const
        ).map(([key, label]) => (
          <Choice
            key={key}
            active={form.habits[key] === "yes"}
            onClick={() => toggle(key)}
          >
            {label}
          </Choice>
        ))}
      </div>
      {form.habits.smoking === "yes" && (
        <div className="mt-4 rounded-2xl bg-teal-50 p-4">
          <p className="font-bold">How much do you smoke?</p>
          <ChoiceList
            values={
              ["Mild <5/day", "Moderate 5-10/day", "Severe >10/day"] as const
            }
            value={form.habits.smoking_severity}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                habits: { ...current.habits, smoking_severity: value },
              }))
            }
          />
        </div>
      )}
      <p className="mt-6 font-bold">How often do you wash your hair?</p>
      <ChoiceList
        values={["Daily", "Alternate Days", "Weekly"] as const}
        value={form.habits.hair_wash_frequency}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            habits: { ...current.habits, hair_wash_frequency: value },
          }))
        }
      />
      {form.habits.salon_treatments === "yes" && (
        <textarea
          className="mt-5 min-h-24 w-full rounded-2xl border border-stone-200 p-3"
          value={form.habits.salon_treatment_detail ?? ""}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              habits: {
                ...current.habits,
                salon_treatment_detail: event.target.value || null,
              },
            }))
          }
          placeholder="What salon treatments have you had?"
        />
      )}
    </>
  );
}
