import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/dashboard/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_THRESHOLDS, saveSettings } from "@/lib/sensor/sensor-api";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Sensor Settings — ClimaSense IoT" },
      {
        name: "description",
        content:
          "Configure temperature and humidity alert thresholds, polling interval and device endpoint for your IoT sensor.",
      },
      { property: "og:title", content: "Sensor Settings — ClimaSense IoT" },
      {
        property: "og:description",
        content: "Set alert thresholds and connection options for your IoT sensor node.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const [poll, setPoll] = useState(10);
  const [alerts, setAlerts] = useState(true);
  const [saving, setSaving] = useState(false);

  async function onSave() {
    setSaving(true);
    // FUTURE API INTEGRATION: saveSettings() currently mocks a PUT request.
    await saveSettings({ thresholds, pollIntervalSec: poll, alertsEnabled: alerts });
    setSaving(false);
    toast.success("Settings saved (stored locally until the sensor API is connected)");
  }

  const num = (v: string) => Number(v || 0);

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="text-sm text-muted-foreground">Thresholds and device connection options</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="glass-card space-y-4 p-5">
          <h2 className="text-sm font-semibold">Temperature thresholds (°C)</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tmin">Minimum</Label>
              <Input
                id="tmin"
                type="number"
                value={thresholds.temperature.min}
                onChange={(e) =>
                  setThresholds((s) => ({
                    ...s,
                    temperature: { ...s.temperature, min: num(e.target.value) },
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tmax">Maximum</Label>
              <Input
                id="tmax"
                type="number"
                value={thresholds.temperature.max}
                onChange={(e) =>
                  setThresholds((s) => ({
                    ...s,
                    temperature: { ...s.temperature, max: num(e.target.value) },
                  }))
                }
              />
            </div>
          </div>
        </section>

        <section className="glass-card space-y-4 p-5">
          <h2 className="text-sm font-semibold">Humidity thresholds (%)</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="hmin">Minimum</Label>
              <Input
                id="hmin"
                type="number"
                value={thresholds.humidity.min}
                onChange={(e) =>
                  setThresholds((s) => ({
                    ...s,
                    humidity: { ...s.humidity, min: num(e.target.value) },
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hmax">Maximum</Label>
              <Input
                id="hmax"
                type="number"
                value={thresholds.humidity.max}
                onChange={(e) =>
                  setThresholds((s) => ({
                    ...s,
                    humidity: { ...s.humidity, max: num(e.target.value) },
                  }))
                }
              />
            </div>
          </div>
        </section>

        <section className="glass-card space-y-4 p-5">
          <h2 className="text-sm font-semibold">Device connection</h2>
          <div className="space-y-1.5">
            <Label htmlFor="endpoint">Sensor API endpoint</Label>
            {/* FUTURE API INTEGRATION: this value will point at your IoT backend URL. */}
            <Input id="endpoint" placeholder="https://your-iot-api.example.com/readings" disabled />
            <p className="text-xs text-muted-foreground">
              Disabled until the IoT backend is connected.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="poll">Refresh interval (seconds)</Label>
            <Input
              id="poll"
              type="number"
              min={1}
              value={poll}
              onChange={(e) => setPoll(num(e.target.value))}
            />
          </div>
        </section>

        <section className="glass-card space-y-4 p-5">
          <h2 className="text-sm font-semibold">Alerts</h2>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div>
              <p className="text-sm font-medium">Threshold alerts</p>
              <p className="text-xs text-muted-foreground">
                Notify when readings leave the safe range
              </p>
            </div>
            <Switch checked={alerts} onCheckedChange={setAlerts} />
          </div>
          <Button onClick={onSave} disabled={saving} className="w-full">
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </section>
      </div>
    </AppShell>
  );
}
