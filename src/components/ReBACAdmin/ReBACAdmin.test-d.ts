import { assertType } from "vitest";

import type { Props } from "./ReBACAdmin";

test("apiURL must be absolute", () => {
  assertType<Props["apiURL"]>("/api");
  assertType<Props["apiURL"]>("http://example.com");
  assertType<Props["apiURL"]>("api");
});
