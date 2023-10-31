import { render, screen } from "@testing-library/react";
import axios from "axios";

import ReBACAdmin from "./ReBACAdmin";

test("renders the component", () => {
  render(<ReBACAdmin apiURL="/api" />);
  expect(screen.getByText("Canonical ReBAC Admin")).toBeInTheDocument();
});

test("the api URL can be configured", () => {
  const apiURL = "http://example.com/api";
  render(<ReBACAdmin apiURL={apiURL} />);
  expect(axios.defaults.baseURL).toBe(apiURL);
});
