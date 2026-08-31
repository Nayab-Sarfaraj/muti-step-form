import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  screen: number;
  disabled: boolean;
  primaryLabel: string;
  onBack: () => void;
  onNext: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  children: ReactNode;
};

export function IntakeShell({
  screen,
  disabled,
  primaryLabel,
  onBack,
  onNext,
  secondaryLabel,
  onSecondary,
  children,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    contentRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [screen]);

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#f8f7f2] px-3 py-3 text-stone-900 sm:px-4 sm:py-6">
      <section className="mx-auto flex h-full max-w-xl flex-col overflow-hidden rounded-[2rem] bg-white px-5 py-5 shadow-[0_12px_40px_rgba(41,37,36,.08)] sm:px-8 sm:py-6">
        {screen > 0 && (
          <header className="shrink-0">
            <div className="mb-3 flex justify-between text-xs font-bold uppercase tracking-widest text-stone-500">
              <span>GenoRoot</span>
              <span>{screen} of 8</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-teal-700"
                style={{ width: `${(screen / 8) * 100}%` }}
              />
            </div>
          </header>
        )}
        <div
          ref={contentRef}
          className="min-h-0 flex-1 overflow-y-auto py-6 pr-1 sm:py-8"
        >
          {children}
        </div>
        <footer className="flex shrink-0 flex-wrap gap-3 border-t border-stone-100 bg-white pt-4 pb-[max(env(safe-area-inset-bottom),0px)]">
          {screen > 0 && (
            <Button
              variant="outline"
              size="lg"
              className="h-12 flex-1 rounded-2xl"
              onClick={onBack}
            >
              Back
            </Button>
          )}
          <Button
            size="lg"
            className="h-12 min-w-0 flex-1 rounded-2xl bg-teal-700 hover:bg-teal-800"
            disabled={disabled}
            onClick={onNext}
          >
            {primaryLabel}
          </Button>
          {secondaryLabel && onSecondary && (
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-2xl border-teal-700 text-teal-800 hover:bg-teal-50"
              onClick={onSecondary}
            >
              {secondaryLabel}
            </Button>
          )}
        </footer>
      </section>
    </main>
  );
}
