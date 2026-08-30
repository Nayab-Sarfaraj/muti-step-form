import fs from "node:fs";
import ts from "typescript";

const source = fs.readFileSync(new URL("../src/lib/intake.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const compiledModule = { exports: {} };
new Function("exports", "module", compiled)(
  compiledModule.exports,
  compiledModule,
);

const { createEmptyForm, createSubmissionPayload } = compiledModule.exports;
const form = createEmptyForm();
Object.assign(form, {
  age_hair_loss_began: 30,
  duration: "Over a year",
  family_history: ["No known family history"],
  pattern: ["Not sure / skip this"], // Confirms migration of older saved answers too.
  diagnosed_conditions: ["None"],
  menstrual_cycle: "Not applicable",
  pregnancy_related: "Not applicable",
  past_6_months: ["None of these"],
  consent: "yes",
});

const payload = createSubmissionPayload(form);
const schema = JSON.parse(
  fs.readFileSync(new URL("../../intake-schema.json", import.meta.url), "utf8"),
);
const questionKeys = schema.sections.flatMap((section) =>
  section.questions.map((question) => question.key),
);
const expectedKeys = [...questionKeys, "describe"].sort();

if (JSON.stringify(Object.keys(payload).sort()) !== JSON.stringify(expectedKeys)) {
  throw new Error("Submission keys do not match the schema questions and Q14 follow-up.");
}

for (const key of ["family_history", "pattern", "diagnosed_conditions", "menstrual_cycle", "pregnancy_related", "past_6_months"]) {
  if (payload[key] !== null) throw new Error(`${key} was not normalized to null.`);
}

if (payload.habits.smoking_severity !== null || payload.products["Topical Minoxidil"].duration !== null || payload.procedures["PRP/GFC/iPRF"].sessions !== null) {
  throw new Error("Untouched table follow-up fields must remain null.");
}

console.log("Verified all 16 question keys, Q14 follow-up, and null skipped values.");
