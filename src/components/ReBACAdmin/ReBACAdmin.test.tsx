import { screen } from "@testing-library/react";
import axios from "axios";

import { renderComponent } from "test/utils";

import ReBACAdmin from "./ReBACAdmin";

test("renders the component", () => {
  renderComponent(<ReBACAdmin apiURL="/api" />);
  expect(screen.getByText("Canonical ReBAC Admin")).toBeInTheDocument();
});

test("the api URL can be configured", () => {
  const apiURL = "http://example.com/api";
  renderComponent(<ReBACAdmin apiURL={apiURL} />);
  expect(axios.defaults.baseURL).toBe(apiURL);
});

test("the index is displayed", async () => {
  renderComponent(<ReBACAdmin apiURL="/api" />, {
    url: "/settings/permissions",
    path: "/settings/permissions/*",
  });
  expect(screen.getByText("Index")).toBeInTheDocument();
});
