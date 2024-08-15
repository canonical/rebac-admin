import { faker } from "@faker-js/faker";

import type { Entity, Resource } from "api/api.schemas";

export const mockEntity = (overrides?: Partial<Entity>): Entity => ({
  id: faker.word.sample(),
  name: faker.word.sample(),
  type: faker.word.sample(),
  ...overrides,
});

export const mockResource = (overrides?: Partial<Resource>): Resource => ({
  entity: mockEntity(),
  ...overrides,
});
