/**
 * Generated by orval v6.19.1 🍺
 * Do not edit manually.
 * Canonical OpenFGA Administration Product Compatibility API
 * The following specification outlines the API required for the FGA administration frontend to interact with an OpenFGA instance through a products API. This is an evolving specification as reflected in the version number.

#### Changelog
| Version | Notes |
|---|---|
| **0.0.7** | Added `/entitlements/raw` endpoint to split `/entitlements` responses. |
| **0.0.6** | Ensured compatibility with Orval Restful Client Generator. |
| **0.0.5** | Add filter parameter to top level collection `GET` requests. |
| **0.0.4** | Added pagination parameters to appropriate `GET` requests.<br />Changed a couple of `PUT`'s to `PATCH`'s to account for the possible subset returned from the paginated `GET`'s. |
| **0.0.3** | Added skeleton error responses for `400`, `401`, `404`, and `5XX` (`default`) |
| **0.0.2** | Added `GET /users/{id}/groups`<br />Added `GET /users/{id}roles`<br />Added `GET /users/{id}/entitlements`<br />Added `GET,PUT /groups/{id}/users`<br>Added `DELETE /groups/{id}/users/{userId}`<br />Added `GET /roles/{id}/entitlements`<br />Added `DELETE /roles/{id}/entitlements/{entitlementId}` |
| **0.0.1** | Initial dump |

 * OpenAPI spec version: 0.0.7
 */
import { faker } from "@faker-js/faker";
import { rest } from "msw";

export const getGetEntitlementsMock = () =>
  Array.from(
    { length: faker.datatype.number({ min: 1, max: 10 }) },
    (_, i) => i + 1,
  ).map(() => ({
    entitlement: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    entity: faker.helpers.arrayElement([faker.word.sample(), undefined]),
  }));

export const getGetEntitlementsRawMock = () => faker.random.word();

export const getPutEntitlementsRawMock = () => faker.random.word();

export const getEntitlementsMSW = () => [
  rest.get("*/entitlements", (_req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200, "Mocked status"),
      ctx.json(getGetEntitlementsMock()),
    );
  }),
  rest.get("*/entitlements/raw", (_req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200, "Mocked status"),
      ctx.text(getGetEntitlementsRawMock()),
    );
  }),
  rest.put("*/entitlements/raw", (_req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200, "Mocked status"),
      ctx.text(getPutEntitlementsRawMock()),
    );
  }),
];
