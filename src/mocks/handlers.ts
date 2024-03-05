import { getAuthenticationMock } from "api/authentication/authentication.msw";
import { getCapabilitiesMock } from "api/capabilities/capabilities.msw";
import { getEntitlementsMock } from "api/entitlements/entitlements.msw";
import { getGroupsMock } from "api/groups/groups.msw";
import { getIdentitiesMock } from "api/identities/identities.msw";
import { getMetaMock } from "api/meta/meta.msw";
import { getResourcesMock } from "api/resources/resources.msw";
import { getRolesMock } from "api/roles/roles.msw";

export const handlers = [
  ...getAuthenticationMock(),
  ...getCapabilitiesMock(),
  ...getEntitlementsMock(),
  ...getGroupsMock(),
  ...getIdentitiesMock(),
  ...getMetaMock(),
  ...getResourcesMock(),
  ...getRolesMock(),
];
