import { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { HttpResponse, delay, http } from "msw";
import { setupServer } from "msw/node";

import { CapabilityMethodsItem } from "api/api.schemas";
import { getActualCapabilitiesMock } from "mocks/handlers";
import ComponentProviders from "test/ComponentProviders";
import { Endpoint } from "types/api";

import { useGetCapabilityActions } from "./capabilities";

const mockApiServer = setupServer(
  ...getActualCapabilitiesMock([
    { endpoint: Endpoint.META, methods: [CapabilityMethodsItem.GET] },
  ]),
);

beforeAll(() => {
  mockApiServer.listen();
});

beforeEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
});

describe("useGetCapabilityAction", () => {
  test("should return correct data while fetching capabilities", async () => {
    const { result } = renderHook(
      () => useGetCapabilityActions(Endpoint.META),
      {
        wrapper: (props) => (
          <ComponentProviders
            {...props}
            path={"*"}
            queryClient={new QueryClient()}
          />
        ),
      },
    );
    const { actions, isFetching, isPending, isError, error } = result.current;
    expect(actions).toStrictEqual([]);
    expect(isFetching).toBe(true);
    expect(isPending).toBe(true);
    expect(isError).toBe(false);
    expect(error).toStrictEqual(null);
  });

  test("should return correct actions after succesfully fetching capabilities", async () => {
    const { result } = renderHook(
      () => useGetCapabilityActions(Endpoint.META),
      {
        wrapper: (props) => (
          <ComponentProviders
            {...props}
            path={"*"}
            queryClient={new QueryClient()}
          />
        ),
      },
    );
    await waitFor(() => {
      expect(result.current.actions).toStrictEqual([CapabilityMethodsItem.GET]);
    });
    const { actions, isFetching, isPending, isError, error } = result.current;
    expect(actions).toStrictEqual([CapabilityMethodsItem.GET]);
    expect(isFetching).toBe(false);
    expect(isPending).toBe(false);
    expect(isError).toBe(false);
    expect(error).toStrictEqual(null);
  });

  test("should return error", async () => {
    mockApiServer.use(
      http.get(`*${Endpoint.CAPABILITIES}`, async () => {
        await delay(900);
        return new HttpResponse(null, { status: 404 });
      }),
    );
    const { result } = renderHook(
      () => useGetCapabilityActions(Endpoint.META),
      {
        wrapper: (props) => (
          <ComponentProviders
            {...props}
            path={"*"}
            queryClient={new QueryClient()}
          />
        ),
      },
    );
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    const { actions, isFetching, isPending, isError, error } = result.current;
    expect(actions).toStrictEqual([]);
    expect(isFetching).toBe(false);
    expect(isPending).toBe(false);
    expect(isError).toBe(true);
    expect(error).toStrictEqual(
      new axios.AxiosError("Request failed with status code 404"),
    );
  });
});
