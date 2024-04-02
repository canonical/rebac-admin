import { getAuthenticationMock } from "api/authentication/authentication.msw";
import { getAuthenticationIdMock } from "api/authentication-id/authentication-id.msw";
import { getEntitlementsMock } from "api/entitlements/entitlements.msw";
import { getGroupsMock } from "api/groups/groups.msw";
import { getGroupsIdMock } from "api/groups-id/groups-id.msw";
import { getResourcesMock } from "api/resources/resources.msw";
import { getRolesMock } from "api/roles/roles.msw";
import { getRolesIdMock } from "api/roles-id/roles-id.msw";
import { getUsersMock } from "api/users/users.msw";
import { getUsersIdMock } from "api/users-id/users-id.msw";

export const handlers = [
  ...getAuthenticationMock(),
  ...getAuthenticationIdMock(),
  ...getEntitlementsMock(),
  ...getGroupsMock(),
  ...getGroupsIdMock(),
  ...getResourcesMock(),
  ...getRolesMock(),
  ...getRolesIdMock(),
  ...getUsersMock(),
  ...getUsersIdMock(),
];
