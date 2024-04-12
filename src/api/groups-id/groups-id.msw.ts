/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * Canonical OpenFGA Administration Product Compatibility API
 * The following specification outlines the API required for the FGA administration frontend to interact with an OpenFGA instance through a products API. This is an evolving specification as reflected in the version number.

#### Changelog
| Version | Notes |
|---|---|
| **0.0.8** | Implement response type as defined in [IAM Platform Admin UI HTTP Spec](https://docs.google.com/document/d/1ElV22e3mePGFPq8CaM3F3IkuyuOLNpjG7yYgtjvygf4/edit). |
| **0.0.7** | Added `/entitlements/raw` endpoint to split `/entitlements` responses. |
| **0.0.6** | Ensured compatibility with Orval Restful Client Generator. |
| **0.0.5** | Add filter parameter to top level collection `GET` requests. |
| **0.0.4** | Added pagination parameters to appropriate `GET` requests.<br />Changed a couple of `PUT`'s to `PATCH`'s to account for the possible subset returned from the paginated `GET`'s. |
| **0.0.3** | Added skeleton error responses for `400`, `401`, `404`, and `5XX` (`default`) |
| **0.0.2** | Added `GET /users/{id}/groups`<br />Added `GET /users/{id}roles`<br />Added `GET /users/{id}/entitlements`<br />Added `GET,PUT /groups/{id}/users`<br>Added `DELETE /groups/{id}/users/{userId}`<br />Added `GET /roles/{id}/entitlements`<br />Added `DELETE /roles/{id}/entitlements/{entitlementId}` |
| **0.0.1** | Initial dump |

 * OpenAPI spec version: 0.0.8
 */
import { faker } from "@faker-js/faker";
import { HttpResponse, delay, http } from "msw";

import type {
  BadRequestResponse,
  DefaultResponse,
  GetGroupsId200,
  GetGroupsIdUsers200,
  NotFoundResponse,
  UnauthorizedResponse,
} from "../api.schemas";

export const getGetGroupsIdResponseMock = (
  overrideResponse: any = {},
): GetGroupsId200 => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
  data: Array.from(
    { length: faker.number.int({ min: 1, max: 10 }) },
    (_, i) => i + 1,
  ).map(() => faker.word.sample()),
  ...overrideResponse,
});

export const getGetGroupsIdResponseMock200 = (
  overrideResponse: any = {},
): GetGroupsId200 => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
  data: Array.from(
    { length: faker.number.int({ min: 1, max: 10 }) },
    (_, i) => i + 1,
  ).map(() => faker.word.sample()),
  ...overrideResponse,
});

export const getGetGroupsIdResponseMock400 = (
  overrideResponse: any = {},
): BadRequestResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getGetGroupsIdResponseMock401 = (
  overrideResponse: any = {},
): UnauthorizedResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getGetGroupsIdResponseMock404 = (
  overrideResponse: any = {},
): NotFoundResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getGetGroupsIdResponseMockDefault = (
  overrideResponse: any = {},
): DefaultResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getPatchGroupsIdResponseMock400 = (
  overrideResponse: any = {},
): BadRequestResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getPatchGroupsIdResponseMock401 = (
  overrideResponse: any = {},
): UnauthorizedResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getPatchGroupsIdResponseMock404 = (
  overrideResponse: any = {},
): NotFoundResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getPatchGroupsIdResponseMockDefault = (
  overrideResponse: any = {},
): DefaultResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getDeleteGroupsIdResponseMock400 = (
  overrideResponse: any = {},
): BadRequestResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getDeleteGroupsIdResponseMock401 = (
  overrideResponse: any = {},
): UnauthorizedResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getDeleteGroupsIdResponseMock404 = (
  overrideResponse: any = {},
): NotFoundResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getDeleteGroupsIdResponseMockDefault = (
  overrideResponse: any = {},
): DefaultResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getGetGroupsIdUsersResponseMock = (
  overrideResponse: any = {},
): GetGroupsIdUsers200 => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
  data: Array.from(
    { length: faker.number.int({ min: 1, max: 10 }) },
    (_, i) => i + 1,
  ).map(() => ({
    addedBy: faker.word.sample(),
    certificate: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    email: faker.word.sample(),
    firstName: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    groups: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
    id: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    joined: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    lastLogin: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    lastName: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    permissions: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
    roles: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
    source: faker.word.sample(),
    ...overrideResponse,
  })),
  ...overrideResponse,
});

export const getGetGroupsIdUsersResponseMock200 = (
  overrideResponse: any = {},
): GetGroupsIdUsers200 => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
  data: Array.from(
    { length: faker.number.int({ min: 1, max: 10 }) },
    (_, i) => i + 1,
  ).map(() => ({
    addedBy: faker.word.sample(),
    certificate: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    email: faker.word.sample(),
    firstName: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    groups: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
    id: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    joined: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    lastLogin: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    lastName: faker.helpers.arrayElement([faker.word.sample(), undefined]),
    permissions: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
    roles: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
    source: faker.word.sample(),
    ...overrideResponse,
  })),
  ...overrideResponse,
});

export const getGetGroupsIdUsersResponseMock400 = (
  overrideResponse: any = {},
): BadRequestResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getGetGroupsIdUsersResponseMock401 = (
  overrideResponse: any = {},
): UnauthorizedResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getGetGroupsIdUsersResponseMock404 = (
  overrideResponse: any = {},
): NotFoundResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getGetGroupsIdUsersResponseMockDefault = (
  overrideResponse: any = {},
): DefaultResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getPatchGroupsIdUsersResponseMock400 = (
  overrideResponse: any = {},
): BadRequestResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getPatchGroupsIdUsersResponseMock401 = (
  overrideResponse: any = {},
): UnauthorizedResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getPatchGroupsIdUsersResponseMock404 = (
  overrideResponse: any = {},
): NotFoundResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getPatchGroupsIdUsersResponseMockDefault = (
  overrideResponse: any = {},
): DefaultResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getDeleteGroupsIdUsersUserIdResponseMock400 = (
  overrideResponse: any = {},
): BadRequestResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getDeleteGroupsIdUsersUserIdResponseMock401 = (
  overrideResponse: any = {},
): UnauthorizedResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getDeleteGroupsIdUsersUserIdResponseMock404 = (
  overrideResponse: any = {},
): NotFoundResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getDeleteGroupsIdUsersUserIdResponseMockDefault = (
  overrideResponse: any = {},
): DefaultResponse => ({
  _links: {
    next: { href: faker.word.sample(), ...overrideResponse },
    ...overrideResponse,
  },
  _meta: {
    page: faker.number.int({ min: undefined, max: undefined }),
    size: faker.number.int({ min: undefined, max: undefined }),
    total: faker.number.int({ min: undefined, max: undefined }),
    ...overrideResponse,
  },
  message: faker.word.sample(),
  status: faker.number.int({ min: undefined, max: undefined }),
  ...overrideResponse,
});

export const getGetGroupsIdMockHandler = (
  overrideResponse?: GetGroupsId200,
) => {
  return http.get("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getGetGroupsIdResponseMock(),
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

export const getGetGroupsIdMockHandler200 = (
  overrideResponse?: GetGroupsId200,
) => {
  return http.get("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getGetGroupsIdResponseMock200(),
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

export const getGetGroupsIdMockHandler400 = (
  overrideResponse?: BadRequestResponse,
) => {
  return http.get("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getGetGroupsIdResponseMock400(),
      ),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getGetGroupsIdMockHandler401 = (
  overrideResponse?: UnauthorizedResponse,
) => {
  return http.get("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getGetGroupsIdResponseMock401(),
      ),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getGetGroupsIdMockHandler404 = (
  overrideResponse?: NotFoundResponse,
) => {
  return http.get("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getGetGroupsIdResponseMock404(),
      ),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getGetGroupsIdMockHandlerDefault = (
  overrideResponse?: DefaultResponse,
) => {
  return http.get("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getGetGroupsIdResponseMockDefault(),
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

export const getPatchGroupsIdMockHandler = () => {
  return http.patch("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export const getPatchGroupsIdMockHandler200 = () => {
  return http.patch("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export const getPatchGroupsIdMockHandler400 = (
  overrideResponse?: BadRequestResponse,
) => {
  return http.patch("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getPatchGroupsIdResponseMock400(),
      ),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getPatchGroupsIdMockHandler401 = (
  overrideResponse?: UnauthorizedResponse,
) => {
  return http.patch("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getPatchGroupsIdResponseMock401(),
      ),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getPatchGroupsIdMockHandler404 = (
  overrideResponse?: NotFoundResponse,
) => {
  return http.patch("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getPatchGroupsIdResponseMock404(),
      ),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getPatchGroupsIdMockHandlerDefault = (
  overrideResponse?: DefaultResponse,
) => {
  return http.patch("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getPatchGroupsIdResponseMockDefault(),
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

export const getDeleteGroupsIdMockHandler = () => {
  return http.delete("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export const getDeleteGroupsIdMockHandler200 = () => {
  return http.delete("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export const getDeleteGroupsIdMockHandler400 = (
  overrideResponse?: BadRequestResponse,
) => {
  return http.delete("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getDeleteGroupsIdResponseMock400(),
      ),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getDeleteGroupsIdMockHandler401 = (
  overrideResponse?: UnauthorizedResponse,
) => {
  return http.delete("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getDeleteGroupsIdResponseMock401(),
      ),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getDeleteGroupsIdMockHandler404 = (
  overrideResponse?: NotFoundResponse,
) => {
  return http.delete("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getDeleteGroupsIdResponseMock404(),
      ),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getDeleteGroupsIdMockHandlerDefault = (
  overrideResponse?: DefaultResponse,
) => {
  return http.delete("*/groups/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getDeleteGroupsIdResponseMockDefault(),
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

export const getGetGroupsIdUsersMockHandler = (
  overrideResponse?: GetGroupsIdUsers200,
) => {
  return http.get("*/groups/:id/users", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getGetGroupsIdUsersResponseMock(),
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

export const getGetGroupsIdUsersMockHandler200 = (
  overrideResponse?: GetGroupsIdUsers200,
) => {
  return http.get("*/groups/:id/users", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getGetGroupsIdUsersResponseMock200(),
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

export const getGetGroupsIdUsersMockHandler400 = (
  overrideResponse?: BadRequestResponse,
) => {
  return http.get("*/groups/:id/users", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getGetGroupsIdUsersResponseMock400(),
      ),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getGetGroupsIdUsersMockHandler401 = (
  overrideResponse?: UnauthorizedResponse,
) => {
  return http.get("*/groups/:id/users", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getGetGroupsIdUsersResponseMock401(),
      ),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getGetGroupsIdUsersMockHandler404 = (
  overrideResponse?: NotFoundResponse,
) => {
  return http.get("*/groups/:id/users", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getGetGroupsIdUsersResponseMock404(),
      ),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getGetGroupsIdUsersMockHandlerDefault = (
  overrideResponse?: DefaultResponse,
) => {
  return http.get("*/groups/:id/users", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getGetGroupsIdUsersResponseMockDefault(),
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

export const getPatchGroupsIdUsersMockHandler = () => {
  return http.patch("*/groups/:id/users", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export const getPatchGroupsIdUsersMockHandler200 = () => {
  return http.patch("*/groups/:id/users", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export const getPatchGroupsIdUsersMockHandler400 = (
  overrideResponse?: BadRequestResponse,
) => {
  return http.patch("*/groups/:id/users", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getPatchGroupsIdUsersResponseMock400(),
      ),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getPatchGroupsIdUsersMockHandler401 = (
  overrideResponse?: UnauthorizedResponse,
) => {
  return http.patch("*/groups/:id/users", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getPatchGroupsIdUsersResponseMock401(),
      ),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getPatchGroupsIdUsersMockHandler404 = (
  overrideResponse?: NotFoundResponse,
) => {
  return http.patch("*/groups/:id/users", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getPatchGroupsIdUsersResponseMock404(),
      ),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getPatchGroupsIdUsersMockHandlerDefault = (
  overrideResponse?: DefaultResponse,
) => {
  return http.patch("*/groups/:id/users", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getPatchGroupsIdUsersResponseMockDefault(),
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

export const getDeleteGroupsIdUsersUserIdMockHandler = () => {
  return http.delete("*/groups/:id/users/:userId", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export const getDeleteGroupsIdUsersUserIdMockHandler200 = () => {
  return http.delete("*/groups/:id/users/:userId", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export const getDeleteGroupsIdUsersUserIdMockHandler400 = (
  overrideResponse?: BadRequestResponse,
) => {
  return http.delete("*/groups/:id/users/:userId", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getDeleteGroupsIdUsersUserIdResponseMock400(),
      ),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getDeleteGroupsIdUsersUserIdMockHandler401 = (
  overrideResponse?: UnauthorizedResponse,
) => {
  return http.delete("*/groups/:id/users/:userId", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getDeleteGroupsIdUsersUserIdResponseMock401(),
      ),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getDeleteGroupsIdUsersUserIdMockHandler404 = (
  overrideResponse?: NotFoundResponse,
) => {
  return http.delete("*/groups/:id/users/:userId", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getDeleteGroupsIdUsersUserIdResponseMock404(),
      ),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getDeleteGroupsIdUsersUserIdMockHandlerDefault = (
  overrideResponse?: DefaultResponse,
) => {
  return http.delete("*/groups/:id/users/:userId", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getDeleteGroupsIdUsersUserIdResponseMockDefault(),
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
export const getGroupsIdMock = () => [
  getGetGroupsIdMockHandler(),
  getPatchGroupsIdMockHandler(),
  getDeleteGroupsIdMockHandler(),
  getGetGroupsIdUsersMockHandler(),
  getPatchGroupsIdUsersMockHandler(),
  getDeleteGroupsIdUsersUserIdMockHandler(),
];
