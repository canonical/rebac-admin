import { configure } from "@testing-library/react";
import type { Window as HappyDOMWindow } from "happy-dom";

import "@testing-library/jest-dom/vitest";
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
