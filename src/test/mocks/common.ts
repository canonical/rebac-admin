import { faker } from "@faker-js/faker";

import type { Response } from "api/api.schemas";

export const mockResponse = (overrides?: Partial<Response>): Response => ({
  _links: {
    next: {
      href: "",
    },
  },
  _meta: {
    size: faker.number.int(),
  },
  message: faker.word.sample(),
  status: faker.number.int(),
  ...overrides,
});
