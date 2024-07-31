import { pluralize } from "./pluralize";

test("should handle singular", () => {
  expect(pluralize("entity", 1)).toBe("entity");
});

test("should handle plural without additional argument", () => {
  expect(pluralize("user")).toBe("users");
});

test("should handle plural with additional argument", () => {
  expect(pluralize("user", 2)).toBe("users");
});

test("should handle special cases", () => {
  expect(pluralize("entity")).toBe("entities");
  expect(pluralize("identity")).toBe("identities");
});
