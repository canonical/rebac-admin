import { getIds } from "./getIds";

test("can handle a URL parameter", () => {
  expect(
    getIds([{ id: "entity1" }, { name: "entity2" }, { id: "entity3" }]),
  ).toStrictEqual(["entity1", "entity3"]);
});
