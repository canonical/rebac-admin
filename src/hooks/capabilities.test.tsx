import { waitFor } from "@testing-library/react";
import axios from "axios";
import { setupServer } from "msw/node";

import { CapabilityMethodsItem } from "api/api.schemas";
import {
  getGetActualCapabilitiesMock,
  getGetCapabilitiesErrorMockHandler,
} from "mocks/capabilities";
import { renderWrappedHook } from "test/utils";
import { Endpoint } from "types/api";

import {
  CapabilityAction,
  useCheckCapability,
  useGetCapabilityActions,
} from "./capabilities";

const mockApiServer = setupServer(
  ...getGetActualCapabilitiesMock([
    { endpoint: Endpoint.META, methods: [CapabilityMethodsItem.GET] },
  ]),
);

beforeAll(() => {
  mockApiServer.listen();
});

afterEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
});

describe("useGetCapabilityActions", () => {
  test("should return correct data while fetching capabilities", async () => {
    const { result } = renderWrappedHook(() =>
      useGetCapabilityActions(Endpoint.META),
    );
    const { actions, isFetching } = result.current;
    expect(actions).toStrictEqual([]);
    expect(isFetching).toBe(true);
  });

  test("should return correct actions after succesfully fetching capabilities", async () => {
    const { result } = renderWrappedHook(() =>
      useGetCapabilityActions(Endpoint.META),
    );
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    const { actions, isFetching } = result.current;
    expect(actions).toStrictEqual([CapabilityMethodsItem.GET]);
    expect(isFetching).toBe(false);
  });

  test("should return error", async () => {
    mockApiServer.use(getGetCapabilitiesErrorMockHandler());
    const { result } = renderWrappedHook(() =>
      useGetCapabilityActions(Endpoint.META),
    );
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    const { isError, error } = result.current;
    expect(isError).toBe(true);
    expect(error).toStrictEqual(
      new axios.AxiosError("Request failed with status code 404"),
    );
  });
});

describe("useCheckCapability", () => {
  test("should return correct data while fetching capability", async () => {
    const { result } = renderWrappedHook(() =>
      useCheckCapability(Endpoint.META, CapabilityAction.READ),
    );
    const { hasCapability, isFetching } = result.current;
    expect(hasCapability).toBe(false);
    expect(isFetching).toBe(true);
  });

  test("should return true if capability is available", async () => {
    const { result } = renderWrappedHook(() =>
      useCheckCapability(Endpoint.META, CapabilityAction.READ),
    );
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    const { hasCapability, isFetching } = result.current;
    expect(hasCapability).toBe(true);
    expect(isFetching).toBe(false);
  });

  test("should return false if capability is not available", async () => {
    const { result } = renderWrappedHook(() =>
      useCheckCapability(Endpoint.META, CapabilityAction.UPDATE),
    );
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    const { hasCapability, isFetching } = result.current;
    expect(hasCapability).toBe(false);
    expect(isFetching).toBe(false);
  });

  test("should return error", async () => {
    mockApiServer.use(getGetCapabilitiesErrorMockHandler());
    const { result } = renderWrappedHook(() =>
      useCheckCapability(Endpoint.META, CapabilityAction.READ),
    );
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    const { isError, error } = result.current;
    expect(isError).toBe(true);
    expect(error).toStrictEqual(
      new axios.AxiosError("Request failed with status code 404"),
    );
  });
});
