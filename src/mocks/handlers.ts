import { getAuthenticationMock } from "api/authentication/authentication.msw";
import { getEntitlementsMock } from "api/entitlements/entitlements.msw";
import { getGroupsMock } from "api/groups/groups.msw";
import { getIdentitiesMock } from "api/identities/identities.msw";
import { getMetaMock } from "api/meta/meta.msw";
import { getResourcesMock } from "api/resources/resources.msw";
import { getRolesMock } from "api/roles/roles.msw";

import { getGetActualCapabilitiesMock } from "./capabilities";

export const handlers = [
  ...getAuthenticationMock(),
  ...getGetActualCapabilitiesMock(),
  ...getEntitlementsMock(),
  ...getGroupsMock(),
  ...getIdentitiesMock(),
  ...getMetaMock(),
  ...getResourcesMock(),
  ...getRolesMock(),
];
