import { cn } from "@/lib/utils";
import type { SensorStatus } from "@/lib/sensor/types";

const styles: Record<SensorStatus, string> = {
  normal: "bg-success/15 text-success border-success/30",
  high: "bg-danger/15 text-danger border-danger/30",
  low: "bg-info/15 text-info border-info/30",
};

const labels: Record<SensorStatus, string> = {
  normal: "Normal",
  high: "High",
  low: "Low",
};

export function StatusPill({ status, className }: { status: SensorStatus; className?: string | undefined }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide uppercase",
        styles[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}
