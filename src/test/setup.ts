import type { Window as HappyDOMWindow } from "happy-dom";

import "@testing-library/jest-dom/vitest";
import { logger } from "utils";

declare global {
  interface Window extends HappyDOMWindow {}
}

logger.setDefaultLevel(logger.levels.SILENT);
