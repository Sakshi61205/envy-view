import type { ReactNode } from "react";
import { StatusPill } from "./StatusPill";
import type { SensorStatus } from "@/lib/sensor/types";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number | undefined;
  unit: string;
  status: SensorStatus;
  icon: ReactNode;
  range: { min: number; max: number };
  accent: "temp" | "hum";
  loading?: boolean;
}

export function MetricCard({
  label,
  value,
  unit,
  status,
  icon,
  range,
  accent,
  loading,
}: Props) {
  const pct =
    value === undefined
      ? 0
      : Math.min(100, Math.max(0, ((value - range.min) / (range.max - range.min)) * 100));

  return (
    <div className="glass-card relative overflow-hidden p-5 sm:p-6">
      <div
        className={cn(
          "pointer-events-none absolute -top-16 -right-16 size-44 rounded-full blur-3xl opacity-30",
          accent === "temp" ? "bg-info" : "bg-success",
        )}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid size-10 place-items-center rounded-xl",
              accent === "temp" ? "bg-info/15 text-info" : "bg-success/15 text-success",
            )}
          >
            {icon}
          </span>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-xs text-muted-foreground/70">
              Safe range {range.min}–{range.max}
              {unit}
            </p>
          </div>
        </div>
        <StatusPill status={status} />
      </div>

      <div className="relative mt-6 flex items-end gap-1">
        <span className="text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">
          {loading || value === undefined ? "--" : value.toFixed(1)}
        </span>
        <span className="mb-2 text-xl font-medium text-muted-foreground">{unit}</span>
      </div>

      <div className="relative mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            accent === "temp" ? "bg-gradient-temp" : "bg-gradient-hum",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
