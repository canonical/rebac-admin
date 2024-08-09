import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, delay } from "msw";
import { setupServer } from "msw/node";

import {
  getGetIdentitiesItemMockHandler,
  getGetIdentitiesItemMockHandler400,
  getGetIdentitiesItemResponseMock,
} from "api/identities/identities.msw";
import { getGetActualCapabilitiesMock } from "mocks/capabilities";
import { renderComponent } from "test/utils";
import { Endpoint } from "types/api";
import urls from "urls";

import User from "./User";
import { Label, Label as UserLabel } from "./types";

const mockUserData = getGetIdentitiesItemResponseMock({
  id: "user1",
  addedBy: "within",
  email: "pfft",
  firstName: "really",
  lastName: undefined,
  source: "noteworthy",
});
const mockApiServer = setupServer(
  getGetIdentitiesItemMockHandler(mockUserData),
  ...getGetActualCapabilitiesMock(),
);

const path = urls.users.user.index(null);
const url = urls.users.user.index({ id: "user1" });

beforeAll(() => {
  mockApiServer.listen();
});

afterEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
});

test("displays loading state", async () => {
  mockApiServer.use(
    http.get(`*${Endpoint.IDENTITIES}/*`, async () => {
      await delay(100);
    }),
  );
  renderComponent(<User />, { path, url });
  expect(await screen.findByText(Label.FETCHING_USER)).toBeInTheDocument();
});

test("displays content", async () => {
  const content = "Child content";
  renderComponent(<User />, {
    routeChildren: [
      {
        path: urls.users.user.groups(null),
        element: <>{content}</>,
      },
    ],
    path,
    url: urls.users.user.groups({ id: "user1" }),
  });
  expect(await screen.findByText(content)).toBeInTheDocument();
});

test("should display error notification and refetch data", async () => {
  mockApiServer.use(getGetIdentitiesItemMockHandler400());
  renderComponent(<User />, { path, url });
  expect(
    await screen.findByText(UserLabel.FETCHING_USER_ERROR, { exact: false }),
  ).toBeInTheDocument();
  mockApiServer.use(getGetIdentitiesItemMockHandler(mockUserData));
  await userEvent.click(screen.getByRole("button", { name: "refetching" }));
  expect(await screen.findByText(UserLabel.FETCHING_USER)).toBeInTheDocument();
});

test("sets the active tab", async () => {
  renderComponent(<User />, {
    routeChildren: [
      {
        path: urls.users.user.groups(null),
        element: <>Groups</>,
      },
    ],
    path,
    url: urls.users.user.groups({ id: "user1" }),
  });
  expect(await screen.findByRole("link", { name: "Groups" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
