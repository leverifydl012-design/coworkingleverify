import { useEffect, useState } from "react";
import { Minimize2, Square, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type Density = "compact" | "cozy" | "spacious";

const STORAGE_KEY = "layout-density";

function applyDensity(d: Density) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-density", d);
}

export function useDensity(): [Density, (d: Density) => void] {
  const [density, setDensityState] = useState<Density>("spacious");

  useEffect(() => {
    setDensityState("spacious");
    applyDensity("spacious");
    try { localStorage.setItem(STORAGE_KEY, "spacious"); } catch {}
  }, []);

  const setDensity = (d: Density) => {
    setDensityState(d);
    localStorage.setItem(STORAGE_KEY, d);
    applyDensity(d);
  };

  return [density, setDensity];
}

const options: { value: Density; label: string; Icon: typeof Square }[] = [
  { value: "compact", label: "Compact", Icon: Minimize2 },
  { value: "cozy", label: "Cozy", Icon: Square },
  { value: "spacious", label: "Spacious", Icon: Maximize2 },
];

export function DensityToggle({ className }: { className?: string }) {
  const [density, setDensity] = useDensity();
  return (
    <div
      role="radiogroup"
      aria-label="Layout density"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5",
        className,
      )}
    >
      {options.map(({ value, label, Icon }) => {
        const active = density === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            title={label}
            onClick={() => setDensity(value)}
            className={cn(
              "inline-flex items-center justify-center size-8 rounded-full transition",
              active
                ? "bg-foreground text-background shadow-elegant"
                : "text-foreground/70 hover:text-foreground hover:bg-accent",
            )}
          >
            <Icon className="size-3.5" />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
