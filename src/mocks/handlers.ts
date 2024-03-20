import type { Capability } from "api/api.schemas";
import { CapabilityMethodsItem } from "api/api.schemas";
import { getAuthenticationMock } from "api/authentication/authentication.msw";
import {
  getCapabilitiesMock,
  getGetCapabilitiesMockHandler,
  getGetCapabilitiesResponseMock,
} from "api/capabilities/capabilities.msw";
import { getEntitlementsMock } from "api/entitlements/entitlements.msw";
import { getGroupsMock } from "api/groups/groups.msw";
import { getIdentitiesMock } from "api/identities/identities.msw";
import { getMetaMock } from "api/meta/meta.msw";
import { getResourcesMock } from "api/resources/resources.msw";
import { getRolesMock } from "api/roles/roles.msw";
import { Endpoint } from "types/api";

export const getActualCapabilitiesMock = (
  overrideGetCapabilitiesResponse?: Capability[],
) =>
  getCapabilitiesMock().map((handler) => {
    // When fetching the capabilities, the actual endpoints and request method
    // types should be returned instead of randomized mocked data. This is
    // required, as we verify the availability of the respective capability when
    // accessing various parts of the application.
    if (
      handler.info.path === `*${Endpoint.CAPABILITIES}` &&
      handler.info.method === CapabilityMethodsItem.GET
    ) {
      return getGetCapabilitiesMockHandler(
        getGetCapabilitiesResponseMock({
          data: overrideGetCapabilitiesResponse
            ? overrideGetCapabilitiesResponse
            : Object.values<string>(Endpoint).map((endpoint) => ({
                endpoint,
                methods: Object.values<string>(CapabilityMethodsItem),
              })),
        }),
      );
    }
    return handler;
  });

export const handlers = [
  ...getAuthenticationMock(),
  ...getActualCapabilitiesMock(),
  ...getEntitlementsMock(),
  ...getGroupsMock(),
  ...getIdentitiesMock(),
  ...getMetaMock(),
  ...getResourcesMock(),
  ...getRolesMock(),
];
