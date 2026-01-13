/**
 * Test utilities for @whisk/steakhouse
 * @module
 */

import { vi } from "vitest"
import type { SteakhouseClient } from "./client.js"

/** Create a mock SteakhouseClient that returns the given response */
export function createMockClient(mockResponse: unknown): SteakhouseClient {
  return {
    query: vi.fn().mockResolvedValue(mockResponse),
  } as unknown as SteakhouseClient
}
