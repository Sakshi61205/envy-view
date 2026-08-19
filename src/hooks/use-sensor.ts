import { useQuery } from "@tanstack/react-query";
import { fetchHistory, fetchSnapshot } from "@/lib/sensor/sensor-api";

/**
 * Data hooks — the only bridge between UI and the sensor API layer.
 * FUTURE API INTEGRATION: when the real endpoint is live, tune
 * refetchInterval (or replace polling with a WebSocket subscription).
 */

export function useSnapshot(pollIntervalSec = 10) {
  return useQuery({
    queryKey: ["sensor", "snapshot"],
    queryFn: fetchSnapshot,
    refetchInterval: pollIntervalSec * 1000,
  });
}

export function useHistory(range: "24h" | "7d" | "30d") {
  return useQuery({
    queryKey: ["sensor", "history", range],
    queryFn: () => fetchHistory(range),
  });
}
