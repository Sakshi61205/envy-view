/**
 * Shared sensor data types.
 * These types are the contract between the UI and the data layer.
 * When you connect the real IoT sensor API, keep these shapes the same
 * and the whole dashboard keeps working unchanged.
 */

export type SensorStatus = "low" | "normal" | "high";

export type ConnectionStatus = "connected" | "connecting" | "offline";

export interface SensorReading {
  /** ISO timestamp of the reading */
  timestamp: string;
  /** Temperature in degrees Celsius */
  temperature: number;
  /** Relative humidity in percent */
  humidity: number;
}

export interface SensorSnapshot {
  device: {
    id: string;
    name: string;
    location: string;
    firmware: string;
  };
  connection: ConnectionStatus;
  /** Last time the device reported, ISO string */
  lastSeen: string;
  current: SensorReading;
  /** Recent readings, oldest first */
  history: SensorReading[];
}

export interface Thresholds {
  temperature: { min: number; max: number };
  humidity: { min: number; max: number };
}
