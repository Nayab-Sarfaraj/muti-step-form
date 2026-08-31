import type { Dispatch, SetStateAction } from "react";
import type { IntakeForm, YesNo } from "@/lib/intake";
import {
  Choice,
  ChoiceList,
  Heading,
  YesNo as YesNoChoices,
} from "./form-controls";

export type Gate = "male" | "female" | "prefer-not-to-say" | null;
type Update = <K extends keyof IntakeForm>(
  key: K,
  value: IntakeForm[K],
) => void;
type MultiKey =
  | "family_history"
  | "pattern"
  | "diagnosed_conditions"
  | "past_6_months";
const family = [
  "Father had hair loss",
  "Mother had hair loss",
  "Siblings with thinning or baldness",
  "No known family history",
];
const patterns = [
  "Receding hairline",
  "Thinning at crown",
  "Widening part line",
  "Diffuse thinning",
  "Patchy loss",
  "Sudden excessive shedding",
];
const conditions = [
  "PCOS/PCOD",
  "Thyroid disorder",
  "Diabetes",
  "Autoimmune disease",
  "Anemia",
  "None",
];
const triggers = [
  "Crash dieting or major weight loss",
  "High stress or emotional trauma",
  "Fever with illness (COVID, Dengue, Typhoid)",
  "Recent surgery",
  "Change in location/water/air quality",
];
const healthContextOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const;

function MultiChoices({
  form,
  update,
  field,
  values,
  exclusive,
  skipLabel,
}: {
  form: IntakeForm;
  update: Update;
  field: MultiKey;
  values: string[];
  exclusive?: string;
  skipLabel?: string;
}) {
  const toggle = (value: string) => {
    const selected = form[field] ?? [];
    const next =
      value === exclusive
        ? selected.includes(value)
          ? []
          : [value]
        : selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected.filter((item) => item !== exclusive), value];
    update(field, next);
  };
  return (
    <div className="mt-4 grid gap-2">
      {values.map((value) => (
        <Choice
          key={value}
          active={(form[field] ?? []).includes(value)}
          onClick={() => toggle(value)}
        >
          {value}
        </Choice>
      ))}
      {skipLabel && (
        <button
          type="button"
          onClick={() => update(field, null)}
          className="min-h-12 rounded-2xl border border-dashed border-stone-300 px-4 py-3 text-left text-sm font-semibold text-stone-600 hover:border-teal-300"
        >
          {skipLabel}
        </button>
      )}
    </div>
  );
}

export function WelcomeScreen() {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="mb-8 grid size-16 place-items-center rounded-3xl bg-teal-100 text-3xl">
        ✦
      </div>
      <h1 className="max-w-sm text-4xl font-bold tracking-tight">
        A calmer start to your hair-care visit.
      </h1>
      <p className="mt-5 max-w-sm text-lg leading-8 text-stone-600">
        A few quick questions, mostly tapping. Your clinician will have a
        clearer picture before you meet.
      </p>
      <p className="mt-8 text-sm font-semibold text-teal-700">
        About 2 minutes · saved as you go
      </p>
    </div>
  );
}

export function HairStoryScreen({
  form,
  update,
  ageError,
  clearAgeError,
}: {
  form: IntakeForm;
  update: Update;
  ageError: string;
  clearAgeError: () => void;
}) {
  return (
    <>
      {<Heading title="When did you first notice hair loss?" />}
      <div className="mt-7 rounded-3xl bg-stone-50 p-5">
        <label className="text-sm font-bold">Your age at the time</label>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-stone-200 text-xl"
            onClick={() =>
              update(
                "age_hair_loss_began",
                form.age_hair_loss_began === null
                  ? 20
                  : Math.max(1, form.age_hair_loss_began - 1),
              )
            }
          >
            −
          </button>
          <input
            inputMode="numeric"
            aria-label="Age hair loss began"
            className="h-12 w-20 rounded-xl border border-stone-200 bg-white text-center text-xl font-bold"
            value={form.age_hair_loss_began ?? ""}
            onBlur={clearAgeError}
            onChange={(e) =>
              update(
                "age_hair_loss_began",
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-stone-200 text-xl"
            onClick={() =>
              update(
                "age_hair_loss_began",
                form.age_hair_loss_began === null
                  ? 20
                  : form.age_hair_loss_began + 1,
              )
            }
          >
            +
          </button>
        </div>
        {ageError && <p className="mt-2 text-sm text-red-600">{ageError}</p>}
      </div>
      <h2 className="mt-7 text-lg font-bold">How long has it been going on?</h2>
      <ChoiceList
        values={["Less than 6 months", "6-12 months", "Over a year"] as const}
        value={form.duration}
        onChange={(value) => update("duration", value)}
      />
    </>
  );
}

export function NoticeScreen({
  form,
  update,
}: {
  form: IntakeForm;
  update: Update;
}) {
  return (
    <>
      <Heading title="What runs in the family?" copy="Choose all that apply." />
      <MultiChoices
        form={form}
        update={update}
        field="family_history"
        values={family}
        exclusive="No known family history"
      />
      <h2 className="mt-8 text-lg font-bold">What pattern are you noticing?</h2>
      <MultiChoices
        form={form}
        update={update}
        field="pattern"
        values={patterns}
        skipLabel="Skip this question"
      />
    </>
  );
}

export function HealthScreen({
  form,
  update,
  gate,
  setGate,
}: {
  form: IntakeForm;
  update: Update;
  gate: Gate;
  setGate: Dispatch<SetStateAction<Gate>>;
}) {
  const setGateAndClear = (value: Gate) => {
    setGate(value);
    if (value !== "female") {
      update("menstrual_cycle", null);
      update("pregnancy_related", null);
    }
  };
  return (
    <>
      <Heading
        title="A little health context"
        copy="This helps us skip questions that don’t apply to you."
      />
      <div
        className="mt-6 grid gap-3"
        role="radiogroup"
        aria-label="Health context"
      >
        {healthContextOptions.map(({ value, label }) => (
          <Choice
            key={value}
            active={gate === value}
            onClick={() => setGateAndClear(value)}
          >
            <span>{label}</span>
          </Choice>
        ))}
      </div>
      {gate === "female" && (
        <div className="mt-7 rounded-3xl bg-teal-50 p-5">
          <p className="font-bold">Menstrual cycle</p>
          <ChoiceList
            values={
              ["Regular", "Irregular", "Menopausal", "Not applicable"] as const
            }
            value={form.menstrual_cycle}
            onChange={(value) => update("menstrual_cycle", value)}
          />
          <p className="mt-6 font-bold">Pregnancy-related</p>
          <ChoiceList
            values={
              [
                "Currently pregnant",
                "Postpartum <1 year",
                "Not applicable",
              ] as const
            }
            value={form.pregnancy_related}
            onChange={(value) => update("pregnancy_related", value)}
          />
        </div>
      )}
      <h2 className="mt-8 text-lg font-bold">
        Have you been diagnosed with any of these?
      </h2>
      <MultiChoices
        form={form}
        update={update}
        field="diagnosed_conditions"
        values={conditions}
        exclusive="None"
      />
    </>
  );
}

export function RecentChangesScreen({
  form,
  update,
}: {
  form: IntakeForm;
  update: Update;
}) {
  return (
    <>
      <Heading
        title="Any recent changes?"
        copy="These can sometimes affect the hair-growth cycle."
      />
      <h2 className="mt-7 font-bold">Adult acne or oily skin?</h2>
      <div className="mt-3">
        <YesNoChoices
          value={form.adult_acne_oily_skin}
          onChange={(value) => update("adult_acne_oily_skin", value)}
        />
      </div>
      <h2 className="mt-7 font-bold">Excess body or facial hair?</h2>
      <div className="mt-3">
        <YesNoChoices
          value={form.excess_body_facial_hair}
          onChange={(value) => update("excess_body_facial_hair", value)}
        />
      </div>
      <h2 className="mt-7 font-bold">In the past 6 months</h2>
      <MultiChoices
        form={form}
        update={update}
        field="past_6_months"
        values={triggers}
        skipLabel="Skip this question"
      />
    </>
  );
}

export function FinalDetailsScreen({
  form,
  update,
  voiceAvailable,
  recording,
  startVoice,
}: {
  form: IntakeForm;
  update: Update;
  voiceAvailable: boolean;
  recording: boolean;
  startVoice: () => void;
}) {
  return (
    <>
      <Heading
        title="Almost done"
        copy="Your answers help us prepare for your consultation."
      />
      <h2 className="mt-7 font-bold">Any side effects from past treatments?</h2>
      <div className="mt-3">
        <YesNoChoices
          value={form.past_treatment_side_effects}
          onChange={(value: YesNo) =>
            update("past_treatment_side_effects", value)
          }
        />
      </div>
      {form.past_treatment_side_effects === "yes" && (
        <div className="mt-4">
          <label className="text-sm font-bold">
            Please describe what happened
          </label>
          <textarea
            className="mt-2 min-h-28 w-full rounded-2xl border border-stone-200 p-3"
            value={form.describe ?? ""}
            onChange={(e) => update("describe", e.target.value || null)}
            placeholder="Type your answer here"
          />
          {voiceAvailable ? (
            <button
              type="button"
              onClick={startVoice}
              className="mt-3 min-h-11 rounded-xl border border-teal-700 px-4 text-sm font-bold text-teal-800"
            >
              {recording ? "Listening… tap when finished" : "🎙 Dictate answer"}
            </button>
          ) : (
            <p className="mt-2 text-sm text-stone-500">
              Voice typing isn’t supported in this browser. You can type your
              answer above.
            </p>
          )}
        </div>
      )}
      <h2 className="mt-7 font-bold">Preferred sample type</h2>
      <ChoiceList
        values={["Saliva", "Blood", "Either"] as const}
        value={form.sample_type}
        onChange={(value) => update("sample_type", value)}
      />
      <div className="mt-7 rounded-3xl bg-teal-50 p-5">
        <p className="font-bold">
          Do you consent to this intake being used for your consultation?
        </p>
        <div className="mt-3">
          <YesNoChoices
            value={form.consent}
            onChange={(value) => update("consent", value)}
          />
        </div>
        {form.consent !== "yes" && (
          <p className="mt-2 text-sm text-stone-600">
            Consent is required to submit.
          </p>
        )}
      </div>
    </>
  );
}
