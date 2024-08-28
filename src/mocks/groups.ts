import { faker } from "@faker-js/faker";

import type { Group } from "api/api.schemas";

export const mockGroup = (overrides?: Partial<Group>): Group => ({
  name: faker.word.sample(),
  ...overrides,
});
