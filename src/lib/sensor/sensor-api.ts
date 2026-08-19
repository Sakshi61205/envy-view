import { generateHistory, getMockSnapshot } from "./mock-data";
import type { SensorReading, SensorSnapshot, SensorStatus, Thresholds } from "./types";

/**
 * SENSOR API LAYER
 * ----------------
 * Single place where the dashboard talks to "the sensor".
 * Today it returns dummy data. Tomorrow, swap the bodies of these
 * functions for real network calls — no UI component needs to change.
 *
 * FUTURE API INTEGRATION EXAMPLE:
 *
 *   export async function fetchSnapshot(): Promise<SensorSnapshot> {
 *     const res = await fetch(`${import.meta.env.VITE_IOT_API_URL}/readings/latest`);
 *     if (!res.ok) throw new Error("Sensor API unreachable");
 *     return res.json();
 *   }
 *
 * For live streaming you can instead open a WebSocket / MQTT-over-WS
 * connection here and push updates into the same shape.
 */

export const DEFAULT_THRESHOLDS: Thresholds = {
  temperature: { min: 18, max: 30 },
  humidity: { min: 40, max: 70 },
};

const NETWORK_DELAY_MS = 350;

/** Current reading + recent history for the dashboard. */
export async function fetchSnapshot(): Promise<SensorSnapshot> {
  // FUTURE API INTEGRATION: replace with GET /api/sensor/latest
  await new Promise((r) => setTimeout(r, NETWORK_DELAY_MS));
  return getMockSnapshot();
}

/** Historical readings for the History page. */
export async function fetchHistory(range: "24h" | "7d" | "30d"): Promise<SensorReading[]> {
  // FUTURE API INTEGRATION: replace with GET /api/sensor/history?range=...
  await new Promise((r) => setTimeout(r, NETWORK_DELAY_MS));
  if (range === "24h") return generateHistory(24, 60);
  if (range === "7d") return generateHistory(7 * 12, 60);
  return generateHistory(30 * 6, 240);
}

/** Persist user settings. FUTURE API INTEGRATION: PUT /api/sensor/settings */
export async function saveSettings(payload: {
  thresholds: Thresholds;
  pollIntervalSec: number;
  alertsEnabled: boolean;
}): Promise<{ ok: true }> {
  await new Promise((r) => setTimeout(r, NETWORK_DELAY_MS));
  console.info("[sensor-api] settings saved (mock)", payload);
  return { ok: true };
}

export function statusFor(value: number, range: { min: number; max: number }): SensorStatus {
  if (value < range.min) return "low";
  if (value > range.max) return "high";
  return "normal";
}
