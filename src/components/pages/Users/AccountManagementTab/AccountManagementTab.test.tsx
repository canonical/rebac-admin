import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import type { Location } from "react-router";

import { getDeleteIdentitiesItemMockHandler } from "api/identities/identities.msw";
import { renderComponent } from "test/utils";
import urls from "urls";

import AccountManagementTab from "./AccountManagementTab";
import { Label } from "./types";

const path = urls.users.user.accountManagement(null);
const url = urls.users.user.accountManagement({ id: "user1" });

const mockApiServer = setupServer(getDeleteIdentitiesItemMockHandler());

beforeAll(() => {
  mockApiServer.listen();
});

afterEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
});

test("displays the delete modal", async () => {
  renderComponent(<AccountManagementTab />, {
    path,
    url,
  });
  await userEvent.click(
    await screen.findByRole("button", {
      name: Label.DELETE,
    }),
  );
  expect(
    screen.getByRole("dialog", { name: "Delete 1 user" }),
  ).toBeInTheDocument();
});

test("redirects after deleting", async () => {
  let location: Location | null = null;
  renderComponent(<AccountManagementTab />, {
    path,
    url,
    setLocation: (newLocation) => {
      location = newLocation;
    },
  });
  expect((location as Location | null)?.pathname).toBe(url);
  await userEvent.click(
    await screen.findByRole("button", {
      name: Label.DELETE,
    }),
  );
  await userEvent.type(screen.getByRole("textbox"), "delete 1 user");
  await userEvent.click(
    within(screen.getByRole("dialog", { name: "Delete 1 user" })).getByRole(
      "button",
      {
        name: Label.DELETE,
      },
    ),
  );
  await waitFor(() => {
    expect(
      screen.queryByRole("dialog", { name: "Delete 1 user" }),
    ).not.toBeInTheDocument();
  });
  expect((location as Location | null)?.pathname).toBe(urls.users.index);
});
