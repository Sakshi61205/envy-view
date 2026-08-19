import { useEffect, useState } from "react";
import { Activity, Cpu, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConnectionStatus, SensorSnapshot } from "@/lib/sensor/types";

const connLabel: Record<ConnectionStatus, string> = {
  connected: "Sensor online",
  connecting: "Connecting…",
  offline: "Sensor offline",
};

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function ConnectionBar({
  snapshot,
  loading,
}: {
  snapshot?: SensorSnapshot | undefined;
  loading?: boolean | undefined;
}) {
  const now = useClock();
  const status: ConnectionStatus = loading ? "connecting" : (snapshot?.connection ?? "offline");

  return (
    <div className="glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="flex items-center gap-2 text-sm font-medium">
          <span className="relative flex size-2.5">
            <span
              className={cn(
                "absolute inline-flex size-full animate-ping rounded-full opacity-70",
                status === "connected" && "bg-success",
                status === "connecting" && "bg-warning",
                status === "offline" && "bg-danger",
              )}
            />
            <span
              className={cn(
                "relative inline-flex size-2.5 rounded-full",
                status === "connected" && "bg-success",
                status === "connecting" && "bg-warning",
                status === "offline" && "bg-danger",
              )}
            />
          </span>
          {connLabel[status]}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Cpu className="size-4" /> {snapshot?.device.name ?? "—"}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4" /> {snapshot?.device.location ?? "—"}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Activity className="size-4" />
          Last update{" "}
          {snapshot ? new Date(snapshot.lastSeen).toLocaleTimeString() : "—"}
        </span>
      </div>
      <div className="text-sm tabular-nums text-muted-foreground sm:text-right">
        <p className="font-medium text-foreground">
          {now ? now.toLocaleTimeString() : "--:--:--"}
        </p>
        <p>
          {now
            ? now.toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : ""}
        </p>
      </div>
    </div>
  );
}
