import { screen } from "@testing-library/react";
import axios from "axios";
import { setupServer } from "msw/node";

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
});

afterAll(() => {
  mockApiServer.close();
});

test("renders the component", () => {
  renderComponent(<ReBACAdmin apiURL="/api" />);
  expect(screen.getByText("Canonical ReBAC Admin")).toBeInTheDocument();
});

test("the api URL can be configured", () => {
  const apiURL = "http://example.com/api";
  renderComponent(<ReBACAdmin apiURL={apiURL} />);
  expect(axios.defaults.baseURL).toBe(apiURL);
});

test("the auth token can be configured", () => {
  renderComponent(
    <ReBACAdmin apiURL="http://example.com/api" authToken="U3VwZXIgc2VjcmV0" />,
  );
  expect(axios.defaults.headers.common["X-Authorization"]).toBe(
    "U3VwZXIgc2VjcmV0",
  );
});

test("the header is not set if there is no auth token", () => {
  renderComponent(<ReBACAdmin apiURL="http://example.com/api" />);
  expect(axios.defaults.headers.common["X-Authorization"]).toBeUndefined();
});

test("the header is removed if the auth token is unset", () => {
  const { result } = renderComponent(
    <ReBACAdmin apiURL="http://example.com/api" authToken="U3VwZXIgc2VjcmV0" />,
  );
  expect(axios.defaults.headers.common["X-Authorization"]).toBe(
    "U3VwZXIgc2VjcmV0",
  );
  result.rerender(<ReBACAdmin apiURL="http://example.com/api" />);
  expect(axios.defaults.headers.common["X-Authorization"]).toBeUndefined();
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
