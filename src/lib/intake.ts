export type YesNo = "yes" | "no" | null;
export type ProductUse = { used: boolean; duration: "<3mo" | "3-6mo" | ">6mo" | null; helped: YesNo; side_effects: YesNo };
export type ProcedureUse = { done: boolean; sessions: "1-3" | "4-6" | ">6" | null; helped: YesNo };

// These 16 keys mirror intake-schema.json. Null means an optional question was skipped.
export type IntakeForm = {
  age_hair_loss_began: number | null; duration: "Less than 6 months" | "6-12 months" | "Over a year" | null; family_history: string[] | null; pattern: string[] | null;
  diagnosed_conditions: string[] | null; menstrual_cycle: "Regular" | "Irregular" | "Menopausal" | "Not applicable" | null; pregnancy_related: "Currently pregnant" | "Postpartum <1 year" | "Not applicable" | null;
  adult_acne_oily_skin: YesNo; excess_body_facial_hair: YesNo; past_6_months: string[] | null;
  habits: { smoking: YesNo; smoking_severity: "Mild <5/day" | "Moderate 5-10/day" | "Severe >10/day" | null; alcohol: YesNo; hard_water: YesNo; hair_wash_frequency: "Daily" | "Alternate Days" | "Weekly" | null; heating_tools_styling_chemicals: YesNo; salon_treatments: YesNo; salon_treatment_detail: string | null };
  products: Record<string, ProductUse>; procedures: Record<string, ProcedureUse>; past_treatment_side_effects: YesNo; describe: string | null; sample_type: "Saliva" | "Blood" | "Either" | null; consent: YesNo;
};

export const PRODUCT_NAMES = ["OTC/Medicated Shampoos", "Hair Oils/Serums", "Topical Minoxidil", "Oral Minoxidil", "Supplements"] as const;
export const PROCEDURE_NAMES = ["PRP/GFC/iPRF", "Stem Cells/Exosomes", "Hair Transplant", "Other"] as const;
export const createEmptyForm = (): IntakeForm => ({
  age_hair_loss_began: null, duration: null, family_history: null, pattern: null, diagnosed_conditions: null, menstrual_cycle: null, pregnancy_related: null, adult_acne_oily_skin: null, excess_body_facial_hair: null, past_6_months: null,
  habits: { smoking: "no", smoking_severity: null, alcohol: "no", hard_water: "no", hair_wash_frequency: null, heating_tools_styling_chemicals: "no", salon_treatments: "no", salon_treatment_detail: null },
  products: Object.fromEntries(PRODUCT_NAMES.map((name) => [name, { used: false, duration: null, helped: null, side_effects: null }])),
  procedures: Object.fromEntries(PROCEDURE_NAMES.map((name) => [name, { done: false, sessions: null, helped: null }])),
  past_treatment_side_effects: null, describe: null, sample_type: null, consent: null,
});
export const STORAGE_KEY = "genoroot-intake-v1";
