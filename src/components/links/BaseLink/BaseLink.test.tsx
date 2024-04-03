import { screen } from "@testing-library/react";

import { renderComponent } from "test/utils";

import BaseLink from "./BaseLink";

test("handles base URLs with slashes", () => {
  renderComponent(<BaseLink baseURL="/permissions/" to="/users" />);
  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    `/permissions/users`,
  );
});

test("handles base URLs without slashes", () => {
  renderComponent(<BaseLink baseURL="permissions" to="/users" />);
  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    `/permissions/users`,
  );
});

test("displays an icon", () => {
  renderComponent(<BaseLink baseURL="permissions" to="/users" icon="users" />);
  expect(document.querySelector(".p-icon--users")).toBeInTheDocument();
});
