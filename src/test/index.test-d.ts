import { expectTypeOf } from "vitest";

test("types work properly", () => {
  const param = "test";
  expectTypeOf(param).toMatchTypeOf<string>();
});
