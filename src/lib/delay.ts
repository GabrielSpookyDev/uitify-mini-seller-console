export interface LatencyOptions {
  fixedDelayMs?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
  failureProbability?: number;
  randomFn?: () => number;
  errorFactory?: () => Error;
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simulates network latency and optional random failure.
 */
export async function simulateNetworkLatency(
  options: LatencyOptions = {}
): Promise<void> {
  const {
    fixedDelayMs,
    minDelayMs = 600,
    maxDelayMs = 900,
    failureProbability = 0,
    randomFn = Math.random,
    errorFactory = () => new Error("Simulated network error"),
  } = options;

  const delay =
    typeof fixedDelayMs === "number"
      ? Math.max(0, fixedDelayMs)
      : Math.max(
          0,
          Math.floor(minDelayMs + (maxDelayMs - minDelayMs) * randomFn())
        );

  await wait(delay);

  if (failureProbability > 0 && randomFn() < failureProbability) {
    throw errorFactory();
  }
}

/** Convenience wrapper that returns the value after simulated latency. */
export async function withSimulatedLatency<T>(
  result: T,
  options?: LatencyOptions
): Promise<T> {
  await simulateNetworkLatency(options);
  return result;
}
