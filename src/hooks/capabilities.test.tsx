import { waitFor } from "@testing-library/react";
import axios from "axios";
import { setupServer } from "msw/node";

import { CapabilityMethodsItem } from "api/api.schemas";
import {
  getGetActualCapabilitiesMock,
  getGetCapabilitiesErrorMockHandler,
} from "test/mocks/capabilities";
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
    expect(error instanceof axios.AxiosError).toBe(true);
    expect(error?.message).toBe("Request failed with status code 404");
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

  test("has capability when multiple actions are all required", async () => {
    mockApiServer.use(
      ...getGetActualCapabilitiesMock([
        {
          endpoint: Endpoint.META,
          methods: [CapabilityMethodsItem.GET, CapabilityMethodsItem.POST],
        },
      ]),
    );
    const { result } = renderWrappedHook(() =>
      useCheckCapability(
        Endpoint.META,
        [CapabilityAction.READ, CapabilityAction.CREATE],
        true,
      ),
    );
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    expect(result.current.hasCapability).toBe(true);
  });

  test("handles no capability when multiple actions are all required", async () => {
    const { result } = renderWrappedHook(() =>
      useCheckCapability(
        Endpoint.META,
        [CapabilityAction.READ, CapabilityAction.CREATE],
        true,
      ),
    );
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    expect(result.current.hasCapability).toBe(false);
  });

  test("has capability when multiple actions and some required", async () => {
    const { result } = renderWrappedHook(() =>
      useCheckCapability(
        Endpoint.META,
        [CapabilityAction.READ, CapabilityAction.CREATE],
        false,
      ),
    );
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    expect(result.current.hasCapability).toBe(true);
  });

  test("handles no capability when multiple actions and some required", async () => {
    mockApiServer.use(
      ...getGetActualCapabilitiesMock([
        { endpoint: Endpoint.META, methods: [] },
      ]),
    );
    const { result } = renderWrappedHook(() =>
      useCheckCapability(
        Endpoint.META,
        [CapabilityAction.READ, CapabilityAction.CREATE],
        false,
      ),
    );
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    expect(result.current.hasCapability).toBe(false);
  });

  test("should return error", async () => {
    vi.clearAllMocks();
    mockApiServer.use(getGetCapabilitiesErrorMockHandler());
    const { result } = renderWrappedHook(() =>
      useCheckCapability(Endpoint.META, CapabilityAction.READ),
    );
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    const { isError, error } = result.current;
    expect(isError).toBe(true);
    expect(error instanceof axios.AxiosError).toBe(true);
    expect(error?.message).toBe("Request failed with status code 404");
  });
});
