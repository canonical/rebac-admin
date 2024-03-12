import { configure } from "@testing-library/react";
import type { Window as HappyDOMWindow } from "happy-dom";
import "@testing-library/jest-dom/vitest";

declare global {
  interface Window extends HappyDOMWindow {}
}

configure({
  // Needs to be longer than the 1000 delay that Orval adds to the MSW mocks.
  asyncUtilTimeout: 1100,
});
