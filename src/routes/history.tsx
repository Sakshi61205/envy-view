import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { ReadingsChart } from "@/components/dashboard/ReadingsChart";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { useHistory } from "@/hooks/use-sensor";
import { DEFAULT_THRESHOLDS, statusFor } from "@/lib/sensor/sensor-api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Reading History — ClimaSense IoT" },
      {
        name: "description",
        content:
          "Browse historical temperature and humidity readings from your IoT sensor across 24 hours, 7 days or 30 days.",
      },
      { property: "og:title", content: "Reading History — ClimaSense IoT" },
      {
        property: "og:description",
        content: "Historical temperature and humidity trends from your IoT sensor.",
      },
    ],
  }),
  component: HistoryPage,
});

const ranges = ["24h", "7d", "30d"] as const;

function HistoryPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>("24h");
  // FUTURE API INTEGRATION: swap fetchHistory() in sensor-api.ts for the real endpoint.
  const { data, isLoading } = useHistory(range);
  const rows = (data ?? []).slice().reverse().slice(0, 40);
  const t = DEFAULT_THRESHOLDS;

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reading history</h1>
          <p className="text-sm text-muted-foreground">Recorded sensor values over time</p>
        </div>
        <div className="flex rounded-xl border border-border bg-card p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ReadingsChart data={data ?? []} metric="temperature" title="Temperature" unit="°C" />
        <ReadingsChart data={data ?? []} metric="humidity" title="Humidity" unit="%" />
      </div>

      <div className="glass-card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Temp (°C)</th>
                <th className="px-4 py-3 font-medium">Humidity (%)</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={4}>
                    Loading readings…
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.timestamp} className="border-t border-border/70">
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium tabular-nums">{r.temperature.toFixed(1)}</td>
                  <td className="px-4 py-3 font-medium tabular-nums">{r.humidity.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={statusFor(r.temperature, t.temperature)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
