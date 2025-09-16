import type { HttpHandler } from "msw";
import { HttpResponse, delay, http } from "msw";

import type { Capability } from "api/api.schemas";
import { CapabilityMethodsItem } from "api/api.schemas";
import {
  getCapabilitiesMock,
  getGetCapabilitiesMockHandler,
  getGetCapabilitiesResponseMock,
} from "api/capabilities/capabilities.msw";
import { Endpoint } from "types/api";

export const getGetActualCapabilitiesMock = (
  overrideGetCapabilitiesResponse?: Capability[],
): HttpHandler[] =>
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

export const getGetCapabilitiesErrorMockHandler = (
  status: number = 404,
): HttpHandler => {
  return http.get(`*${Endpoint.CAPABILITIES}`, async () => {
    await delay(Number(import.meta.env.VITE_MOCK_API_DELAY));
    return new HttpResponse(undefined, {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};
