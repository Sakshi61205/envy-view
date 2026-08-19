import { createFileRoute } from "@tanstack/react-router";
import { Droplets, Thermometer, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { ConnectionBar } from "@/components/dashboard/ConnectionBar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ReadingsChart } from "@/components/dashboard/ReadingsChart";
import { useSnapshot } from "@/hooks/use-sensor";
import { DEFAULT_THRESHOLDS, statusFor } from "@/lib/sensor/sensor-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClimaSense IoT — Live Temperature & Humidity Dashboard" },
      {
        name: "description",
        content:
          "Monitor live temperature and humidity from your IoT sensor with status indicators, charts and connection health.",
      },
      { property: "og:title", content: "ClimaSense IoT — Live Sensor Dashboard" },
      {
        property: "og:description",
        content: "Real-time temperature and humidity monitoring dashboard for IoT sensors.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  // FUTURE API INTEGRATION: this hook is the only data source for the page.
  const { data, isLoading } = useSnapshot();
  const t = DEFAULT_THRESHOLDS;
  const history = data?.history ?? [];

  const avgTemp = history.length
    ? history.reduce((s, r) => s + r.temperature, 0) / history.length
    : 0;
  const avgHum = history.length
    ? history.reduce((s, r) => s + r.humidity, 0) / history.length
    : 0;

  return (
    <AppShell>
      <h1 className="sr-only">Temperature and humidity monitoring dashboard</h1>

      <div className="space-y-6">
        <ConnectionBar snapshot={data} loading={isLoading} />

        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard
            label="Temperature"
            value={data?.current.temperature}
            unit="°C"
            accent="temp"
            range={t.temperature}
            status={statusFor(data?.current.temperature ?? t.temperature.min, t.temperature)}
            icon={<Thermometer className="size-5" />}
            loading={isLoading}
          />
          <MetricCard
            label="Humidity"
            value={data?.current.humidity}
            unit="%"
            accent="hum"
            range={t.humidity}
            status={statusFor(data?.current.humidity ?? t.humidity.min, t.humidity)}
            icon={<Droplets className="size-5" />}
            loading={isLoading}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Avg temperature (12h)", value: `${avgTemp.toFixed(1)} °C` },
            { label: "Avg humidity (12h)", value: `${avgHum.toFixed(1)} %` },
            { label: "Readings collected", value: `${history.length}` },
          ].map((s) => (
            <div key={s.label} className="glass-card flex items-center gap-3 p-4">
              <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                <TrendingUp className="size-4" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-semibold tabular-nums">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ReadingsChart data={history} metric="temperature" title="Temperature" unit="°C" />
          <ReadingsChart data={history} metric="humidity" title="Humidity" unit="%" />
        </div>
      </div>
    </AppShell>
  );
}
