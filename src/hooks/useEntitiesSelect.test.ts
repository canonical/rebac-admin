import { act, renderHook } from "@testing-library/react";

import { useEntitiesSelect } from "./useEntitiesSelect";

test("should add an entity to selected entities", async () => {
  const { result } = renderHook(() =>
    useEntitiesSelect(["entity1", "entity2", "entity3"]),
  );
  expect(result.current.selectedEntities).toEqual([]);
  act(() => {
    result.current.handleSelectEntity("entity1");
  });
  act(() => {
    result.current.handleSelectEntity("entity2");
  });
  expect(result.current.selectedEntities).toEqual(["entity1", "entity2"]);
  expect(result.current.areAllEntitiesSelected).toBe(false);
});

test("should remove an entity from selected entities", async () => {
  const { result } = renderHook(() =>
    useEntitiesSelect(["entity1", "entity2", "entity3"]),
  );
  expect(result.current.selectedEntities).toEqual([]);
  act(() => {
    result.current.handleSelectEntity("entity1");
  });
  act(() => {
    result.current.handleSelectEntity("entity2");
  });
  act(() => {
    result.current.handleSelectEntity("entity1");
  });
  expect(result.current.selectedEntities).toEqual(["entity2"]);
  expect(result.current.areAllEntitiesSelected).toBe(false);
});

test("should add all entities to selected entities", async () => {
  const { result } = renderHook(() =>
    useEntitiesSelect(["entity1", "entity2", "entity3"]),
  );
  expect(result.current.selectedEntities).toEqual([]);
  act(() => {
    result.current.handleSelectAllEntities();
  });
  expect(result.current.selectedEntities).toEqual([
    "entity1",
    "entity2",
    "entity3",
  ]);
  expect(result.current.areAllEntitiesSelected).toBe(true);
});

test("should remove all entities from selected entities", async () => {
  const { result } = renderHook(() =>
    useEntitiesSelect(["entity1", "entity2", "entity3"]),
  );
  expect(result.current.selectedEntities).toEqual([]);
  act(() => {
    result.current.handleSelectAllEntities();
  });
  act(() => {
    result.current.handleSelectAllEntities();
  });
  expect(result.current.selectedEntities).toEqual([]);
  expect(result.current.areAllEntitiesSelected).toBe(false);
});

test("should remove entities that are no longer present in the entities list", async () => {
  const { result, rerender } = renderHook(
    (entities) => useEntitiesSelect(entities),
    {
      initialProps: ["entity1", "entity2", "entity3"],
    },
  );
  expect(result.current.selectedEntities).toEqual([]);
  act(() => {
    result.current.handleSelectEntity("entity1");
  });
  act(() => {
    result.current.handleSelectEntity("entity2");
  });
  expect(result.current.selectedEntities).toEqual(["entity1", "entity2"]);
  expect(result.current.areAllEntitiesSelected).toBe(false);
  rerender(["entity1", "entity3"]);
  expect(result.current.selectedEntities).toEqual(["entity1"]);
  expect(result.current.areAllEntitiesSelected).toBe(false);
});
