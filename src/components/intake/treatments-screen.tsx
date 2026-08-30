import type { IntakeForm } from "@/lib/intake";
import { PRODUCT_NAMES, PROCEDURE_NAMES } from "@/lib/intake";
import { Choice, YesNo, Heading } from "./form-controls";

export function TreatmentsScreen({
  form,
  setForm,
}: {
  form: IntakeForm;
  setForm: React.Dispatch<React.SetStateAction<IntakeForm>>;
}) {
  const toggleProduct = (name: string) =>
    setForm((current) => ({
      ...current,
      products: {
        ...current.products,
        [name]: {
          ...current.products[name],
          used: !current.products[name].used,
        },
      },
    }));
  const toggleProcedure = (name: string) =>
    setForm((current) => ({
      ...current,
      procedures: {
        ...current.procedures,
        [name]: {
          ...current.procedures[name],
          done: !current.procedures[name].done,
        },
      },
    }));
  return (
    <>
      <Heading
        title="What have you already tried?"
        copy="Only expand the details for treatments you’ve used."
      />
      <h2 className="mt-7 font-bold">Products</h2>
      <div className="mt-3 grid gap-3">
        {PRODUCT_NAMES.map((name) => (
          <div key={name}>
            <Choice
              active={form.products[name].used}
              onClick={() => toggleProduct(name)}
              className="w-full"
            >
              {name}
            </Choice>
            {form.products[name].used && (
              <div className="mt-2 rounded-2xl bg-stone-50 p-4">
                <p className="text-sm font-bold">Duration</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(["<3mo", "3-6mo", ">6mo"] as const).map((value) => (
                    <Choice
                      key={value}
                      active={form.products[name].duration === value}
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          products: {
                            ...current.products,
                            [name]: {
                              ...current.products[name],
                              duration: value,
                            },
                          },
                        }))
                      }
                      className="text-center text-xs"
                    >
                      {value}
                    </Choice>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="mb-1 font-semibold">Helped?</p>
                    <YesNo
                      value={form.products[name].helped}
                      onChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          products: {
                            ...current.products,
                            [name]: {
                              ...current.products[name],
                              helped: value,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <p className="mb-1 font-semibold">Side effects?</p>
                    <YesNo
                      value={form.products[name].side_effects}
                      onChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          products: {
                            ...current.products,
                            [name]: {
                              ...current.products[name],
                              side_effects: value,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <h2 className="mt-8 font-bold">Procedures</h2>
      <div className="mt-3 grid gap-3">
        {PROCEDURE_NAMES.map((name) => (
          <div key={name}>
            <Choice
              active={form.procedures[name].done}
              onClick={() => toggleProcedure(name)}
              className="w-full"
            >
              {name}
            </Choice>
            {form.procedures[name].done && (
              <div className="mt-2 rounded-2xl bg-stone-50 p-4">
                <div className="grid grid-cols-3 gap-2">
                  {(["1-3", "4-6", ">6"] as const).map((value) => (
                    <Choice
                      key={value}
                      active={form.procedures[name].sessions === value}
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          procedures: {
                            ...current.procedures,
                            [name]: {
                              ...current.procedures[name],
                              sessions: value,
                            },
                          },
                        }))
                      }
                      className="text-center text-xs"
                    >
                      {value} sessions
                    </Choice>
                  ))}
                </div>
                <p className="mb-1 mt-3 text-sm font-semibold">Did it help?</p>
                <YesNo
                  value={form.procedures[name].helped}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      procedures: {
                        ...current.procedures,
                        [name]: { ...current.procedures[name], helped: value },
                      },
                    }))
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
