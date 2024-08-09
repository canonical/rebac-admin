import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/react";
import type { Window as HappyDOMWindow } from "happy-dom";

import { createInstance } from "api-utils/mutator/custom-instance";
import { logger } from "utils";

declare global {
  interface Window extends HappyDOMWindow {}
}

logger.setDefaultLevel(logger.levels.SILENT);

configure({
  // Needs to be long enough to handle multiple requests that have the 10ms
  // delay set in the Orval mocks.
  asyncUtilTimeout: 2000,
});

// Initialise the Axios instance otherwise the API calls in tests won't have an
// instance to use.
createInstance("/api");
