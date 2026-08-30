import type { ReactNode } from "react";
import type { YesNo } from "@/lib/intake";

export function Heading({ title, copy }: { title: string; copy?: string }) {
  return (
    <>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
      {copy && <p className="mt-2 text-stone-600">{copy}</p>}
    </>
  );
}

export function Choice({
  active,
  children,
  onClick,
  className = "",
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${active ? "border-teal-700 bg-teal-50 text-teal-950 ring-1 ring-teal-700" : "border-stone-200 bg-white text-stone-700 hover:border-teal-300"} ${className}`}
    >
      {active && <span className="mr-2 text-teal-700">✓</span>}
      {children}
    </button>
  );
}

export function YesNo({
  value,
  onChange,
}: {
  value: YesNo;
  onChange: (value: YesNo) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Choice
        active={value === "yes"}
        onClick={() => onChange("yes")}
        className="text-center"
      >
        Yes
      </Choice>
      <Choice
        active={value === "no"}
        onClick={() => onChange("no")}
        className="text-center"
      >
        No
      </Choice>
    </div>
  );
}

export function ChoiceList<T extends string>({
  values,
  value,
  onChange,
  className = "mt-3",
}: {
  values: readonly T[];
  value: T | null;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={`${className} grid gap-2`}>
      {values.map((item) => (
        <Choice
          key={item}
          active={value === item}
          onClick={() => onChange(item)}
        >
          {item}
        </Choice>
      ))}
    </div>
  );
}
