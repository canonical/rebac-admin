import { generateTitle } from "./utils";

test("can generate an add title", async () => {
  expect(generateTitle("role")).toBe("Add roles");
});

test("can generate an edit title", async () => {
  expect(generateTitle("role", true)).toBe("Edit roles");
});
