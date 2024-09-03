import { faker } from "@faker-js/faker";

import type { EntityEntitlement } from "api/api.schemas";

export const mockEntityEntitlement = (
  overrides?: Partial<EntityEntitlement>,
): EntityEntitlement => ({
  entitlement: faker.word.sample(),
  entity_id: faker.word.sample(),
  entity_type: faker.word.sample(),
  ...overrides,
});
