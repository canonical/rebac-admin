/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * Canonical OpenFGA Administration Product Compatibility API
 * The following specification outlines the API required for the FGA administration frontend to interact with an OpenFGA instance through a products API. This is an evolving specification as reflected in the version number.

 * OpenAPI spec version: 0.0.10
 */
import { faker } from "@faker-js/faker";
import { HttpResponse, delay, http } from "msw";

import type { GetResourcesResponse } from "../api.schemas";

export const getGetResourcesResponseMock = (
  overrideResponse: any = {},
): GetResourcesResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
    pageToken: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
  data: Array.from(
    { length: faker.number.int({ min: 1, max: 10 }) },
    (_, i) => i + 1,
  ).map(() => ({
    entity: {},
    id: faker.word.sample(),
    name: faker.word.sample(),
    ...overrideResponse,
  })),
  ...overrideResponse,
});

export const getGetResourcesMockHandler = (
  overrideResponse?: GetResourcesResponse,
) => {
  return http.get("*/resources", async () => {
    await delay(1000);
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getGetResourcesResponseMock(),
      ),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};
export const getResourcesMock = () => [getGetResourcesMockHandler()];
