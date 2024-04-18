import { configure } from "@testing-library/react";
import type { Window as HappyDOMWindow } from "happy-dom";
import "@testing-library/jest-dom/vitest";

declare global {
  interface Window extends HappyDOMWindow {}
}

configure({
  // Needs to be long enough to handle multiple requests that have the 10ms
  // delay set in the Orval mocks.
  asyncUtilTimeout: 2000,
});
