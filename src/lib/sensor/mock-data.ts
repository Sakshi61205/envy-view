import type { SensorReading, SensorSnapshot } from "./types";

/**
 * DUMMY DATA LAYER
 * ----------------
 * Everything in this file is placeholder data that simulates an IoT sensor.
 * FUTURE API INTEGRATION: delete/replace this file and implement the same
 * functions in `sensor-api.ts` against your real endpoint.
 */

const DEVICE = {
  id: "DHT22-A17",
  name: "DHT22 Sensor Node",
  location: "Lab Room 2 · Rack A",
  firmware: "v1.4.2",
};

/** Deterministic-ish pseudo random so charts look natural */
function wave(i: number, base: number, amp: number, phase = 0) {
  return (
    base +
    Math.sin((i / 7) * Math.PI + phase) * amp +
    Math.cos((i / 3.3) * Math.PI + phase) * (amp * 0.35)
  );
}

export function generateHistory(points: number, stepMinutes: number): SensorReading[] {
  const now = Date.now();
  const readings: SensorReading[] = [];
  for (let i = points - 1; i >= 0; i--) {
    const t = new Date(now - i * stepMinutes * 60_000);
    readings.push({
      timestamp: t.toISOString(),
      temperature: Number(wave(points - i, 26.5, 2.6).toFixed(1)),
      humidity: Number(wave(points - i, 58, 8, 1.4).toFixed(1)),
    });
  }
  return readings;
}

export function getMockSnapshot(): SensorSnapshot {
  const history = generateHistory(24, 30);
  const current = history[history.length - 1]!;
  return {
    device: DEVICE,
    connection: "connected",
    lastSeen: current.timestamp,
    current,
    history,
  };
}
