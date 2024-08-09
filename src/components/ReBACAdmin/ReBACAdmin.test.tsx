import { screen } from "@testing-library/react";
import axios from "axios";
import { setupServer } from "msw/node";

import {
  createInstance,
  axiosInstance,
} from "api-utils/mutator/custom-instance";
import { renderComponent } from "test/utils";

import ReBACAdmin from "./ReBACAdmin";

const mockApiServer = setupServer();

beforeAll(() => {
  mockApiServer.listen({
    // Ignore unhandled requests in these tests as we're testing the entire app
    // and don't need to provide mocks for each page that we render.
    onUnhandledRequest: "bypass",
  });
});

afterEach(() => {
  mockApiServer.resetHandlers();
  // Reset the instance for other test files
  createInstance("/api");
});

afterAll(() => {
  mockApiServer.close();
});

test("renders the component", () => {
  renderComponent(<ReBACAdmin apiURL="/api" />);
  expect(screen.getByText("Canonical ReBAC Admin")).toBeInTheDocument();
});

test("the api URL can be configured when not using a custom axios instance", () => {
  const apiURL = "http://example.com/api";
  renderComponent(<ReBACAdmin apiURL={apiURL} />);
  expect(axiosInstance.defaults.baseURL).toBe(apiURL);
});

test("a custom axios instance can be passed", () => {
  const instance = axios.create();
  renderComponent(<ReBACAdmin axiosInstance={instance} />);
  expect(axiosInstance).toStrictEqual(instance);
});

test("the index is displayed", async () => {
  renderComponent(<ReBACAdmin apiURL="/api" />, {
    url: "/settings/permissions",
    path: "/settings/permissions/*",
  });
  expect(
    screen.getByRole("heading", { name: "Canonical ReBAC Admin" }),
  ).toBeInTheDocument();
});

test("the users page is displayed", async () => {
  renderComponent(<ReBACAdmin apiURL="/api" />, {
    url: "/settings/permissions/users",
    path: "/settings/permissions/*",
  });
  expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
});
