import { faker } from "@faker-js/faker";

import type { Role } from "api/api.schemas";

export const mockRole = (overrides?: Partial<Role>): Role => ({
  name: faker.word.sample(),
  ...overrides,
});
