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

import type { GetRolesId200, GetRolesIdEntitlements200 } from "../api.schemas";

export const getGetRolesIdResponseMock = (
  overrideResponse: any = {},
): GetRolesId200 => ({
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

export const getGetRolesIdEntitlementsResponseMock = (
  overrideResponse: any = {},
): GetRolesIdEntitlements200 => ({
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

export const getGetRolesIdMockHandler = (overrideResponse?: GetRolesId200) => {
  return http.get("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getGetRolesIdResponseMock(),
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

export const getGetRolesIdMockHandler200 = (
  overrideResponse?: GetRolesId200,
) => {
  return http.get("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getGetRolesIdResponseMock200(),
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

export const getGetRolesIdMockHandler400 = (
  overrideResponse?: BadRequestResponse,
) => {
  return http.get("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getGetRolesIdResponseMock400(),
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

export const getGetRolesIdMockHandler401 = (
  overrideResponse?: UnauthorizedResponse,
) => {
  return http.get("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getGetRolesIdResponseMock401(),
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

export const getGetRolesIdMockHandler404 = (
  overrideResponse?: NotFoundResponse,
) => {
  return http.get("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getGetRolesIdResponseMock404(),
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

export const getGetRolesIdMockHandlerDefault = (
  overrideResponse?: DefaultResponse,
) => {
  return http.get("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getGetRolesIdResponseMockDefault(),
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

export const getPatchRolesIdMockHandler = () => {
  return http.patch("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export const getPatchRolesIdMockHandler200 = () => {
  return http.patch("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export const getPatchRolesIdMockHandler400 = (
  overrideResponse?: BadRequestResponse,
) => {
  return http.patch("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getPatchRolesIdResponseMock400(),
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

export const getPatchRolesIdMockHandler401 = (
  overrideResponse?: UnauthorizedResponse,
) => {
  return http.patch("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getPatchRolesIdResponseMock401(),
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

export const getPatchRolesIdMockHandler404 = (
  overrideResponse?: NotFoundResponse,
) => {
  return http.patch("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getPatchRolesIdResponseMock404(),
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

export const getPatchRolesIdMockHandlerDefault = (
  overrideResponse?: DefaultResponse,
) => {
  return http.patch("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getPatchRolesIdResponseMockDefault(),
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

export const getDeleteRolesIdMockHandler = (overrideResponse?: Response) => {
  return http.delete("*/roles/:id", async () => {
    await delay(900);
    return new HttpResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export const getDeleteRolesIdMockHandler400 = (
  overrideResponse?: BadRequestResponse,
) => {
  return http.delete("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getDeleteRolesIdResponseMock400(),
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

export const getDeleteRolesIdMockHandler401 = (
  overrideResponse?: UnauthorizedResponse,
) => {
  return http.delete("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getDeleteRolesIdResponseMock401(),
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

export const getDeleteRolesIdMockHandler404 = (
  overrideResponse?: NotFoundResponse,
) => {
  return http.delete("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse ? overrideResponse : getDeleteRolesIdResponseMock404(),
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

export const getDeleteRolesIdMockHandlerDefault = (
  overrideResponse?: DefaultResponse,
) => {
  return http.delete("*/roles/:id", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getDeleteRolesIdResponseMockDefault(),
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

export const getGetRolesIdEntitlementsMockHandler = (
  overrideResponse?: GetRolesIdEntitlements200,
) => {
  return http.get("*/roles/:id/entitlements", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getGetRolesIdEntitlementsResponseMock(),
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

export const getGetRolesIdEntitlementsMockHandler200 = (
  overrideResponse?: GetRolesIdEntitlements200,
) => {
  return http.get("*/roles/:id/entitlements", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getGetRolesIdEntitlementsResponseMock200(),
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

export const getGetRolesIdEntitlementsMockHandler400 = (
  overrideResponse?: BadRequestResponse,
) => {
  return http.get("*/roles/:id/entitlements", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getGetRolesIdEntitlementsResponseMock400(),
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

export const getGetRolesIdEntitlementsMockHandler401 = (
  overrideResponse?: UnauthorizedResponse,
) => {
  return http.get("*/roles/:id/entitlements", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getGetRolesIdEntitlementsResponseMock401(),
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

export const getGetRolesIdEntitlementsMockHandler404 = (
  overrideResponse?: NotFoundResponse,
) => {
  return http.get("*/roles/:id/entitlements", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getGetRolesIdEntitlementsResponseMock404(),
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

export const getGetRolesIdEntitlementsMockHandlerDefault = (
  overrideResponse?: DefaultResponse,
) => {
  return http.get("*/roles/:id/entitlements", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getGetRolesIdEntitlementsResponseMockDefault(),
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

export const getPatchRolesIdEntitlementsMockHandler = (
  overrideResponse?: Response,
) => {
  return http.patch("*/roles/:id/entitlements", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getPatchRolesIdEntitlementsResponseMock(),
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

export const getPatchRolesIdEntitlementsMockHandler201 = (
  overrideResponse?: Response,
) => {
  return http.patch("*/roles/:id/entitlements", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getPatchRolesIdEntitlementsResponseMock201(),
      ),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

export const getPatchRolesIdEntitlementsMockHandler400 = (
  overrideResponse?: BadRequestResponse,
) => {
  return http.patch("*/roles/:id/entitlements", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getPatchRolesIdEntitlementsResponseMock400(),
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

export const getPatchRolesIdEntitlementsMockHandler401 = (
  overrideResponse?: UnauthorizedResponse,
) => {
  return http.patch("*/roles/:id/entitlements", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getPatchRolesIdEntitlementsResponseMock401(),
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

export const getPatchRolesIdEntitlementsMockHandler404 = (
  overrideResponse?: NotFoundResponse,
) => {
  return http.patch("*/roles/:id/entitlements", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getPatchRolesIdEntitlementsResponseMock404(),
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

export const getPatchRolesIdEntitlementsMockHandlerDefault = (
  overrideResponse?: DefaultResponse,
) => {
  return http.patch("*/roles/:id/entitlements", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getPatchRolesIdEntitlementsResponseMockDefault(),
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

export const getPatchRolesIdEntitlementsMockHandler = (
  overrideResponse?: Response,
) => {
  return http.patch("*/roles/:id/entitlements", async () => {
    await delay(900);
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getPatchRolesIdEntitlementsResponseMock(),
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

export const getDeleteRolesIdEntitlementsEntitlementIdMockHandler = (
  overrideResponse?: Response,
) => {
  return http.delete("*/roles/:id/entitlements/:entitlementId", async () => {
    await delay(900);
    return new HttpResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export const getDeleteRolesIdEntitlementsEntitlementIdMockHandler400 = (
  overrideResponse?: BadRequestResponse,
) => {
  return http.delete("*/roles/:id/entitlements/:entitlementId", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getDeleteRolesIdEntitlementsEntitlementIdResponseMock400(),
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

export const getDeleteRolesIdEntitlementsEntitlementIdMockHandler401 = (
  overrideResponse?: UnauthorizedResponse,
) => {
  return http.delete("*/roles/:id/entitlements/:entitlementId", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getDeleteRolesIdEntitlementsEntitlementIdResponseMock401(),
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

export const getDeleteRolesIdEntitlementsEntitlementIdMockHandler404 = (
  overrideResponse?: NotFoundResponse,
) => {
  return http.delete("*/roles/:id/entitlements/:entitlementId", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getDeleteRolesIdEntitlementsEntitlementIdResponseMock404(),
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

export const getDeleteRolesIdEntitlementsEntitlementIdMockHandlerDefault = (
  overrideResponse?: DefaultResponse,
) => {
  return http.delete("*/roles/:id/entitlements/:entitlementId", async () => {
    await delay((() => (process.env.NODE_ENV === "development" ? 1e3 : 10))());
    return new HttpResponse(
      JSON.stringify(
        overrideResponse
          ? overrideResponse
          : getDeleteRolesIdEntitlementsEntitlementIdResponseMockDefault(),
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
export const getRolesIdMock = () => [
  getGetRolesIdMockHandler(),
  getPatchRolesIdMockHandler(),
  getDeleteRolesIdMockHandler(),
  getGetRolesIdEntitlementsMockHandler(),
  getPatchRolesIdEntitlementsMockHandler(),
  getDeleteRolesIdEntitlementsEntitlementIdMockHandler(),
  getGetRolesIdGroupsMockHandler(),
];
