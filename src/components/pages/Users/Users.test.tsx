import { screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";

import {
  getGetIdentitiesItemResponseMock,
  getGetIdentitiesMockHandler,
  getGetIdentitiesResponseMock,
} from "api/identities/identities.msw";
import { Label as CheckCapabilityLabel } from "components/CheckCapability";
import { EntityTablePaginationLabel } from "components/EntityTable/EntityTablePagination";
import { ReBACAdminContext } from "context/ReBACAdminContext";
import { getGetActualCapabilitiesMock } from "mocks/capabilities";
import { getGetIdentitiesErrorMockHandler } from "mocks/identities";
import { customWithin } from "test/queries/within";
import { renderComponent } from "test/utils";
import urls from "urls";

import Users from "./Users";
import { Label, Label as UsersLabel } from "./types";

const mockUserData = getGetIdentitiesResponseMock({
  _meta: {
    page: 0,
    size: 10,
  },
  data: [
    getGetIdentitiesItemResponseMock({
      id: "user1",
      addedBy: "within",
      email: "pfft@example.com",
      firstName: "really",
      lastName: "good",
      source: "noteworthy",
    }),
    ...Array.from({ length: 10 }, () => getGetIdentitiesItemResponseMock()),
  ],
});
const mockApiServer = setupServer(
  getGetIdentitiesMockHandler(mockUserData),
  ...getGetActualCapabilitiesMock(),
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

test("should display spinner on mount", () => {
  renderComponent(<Users />);
  expect(screen.getByTestId(CheckCapabilityLabel.LOADING)).toBeInTheDocument();
});

test("should display correct user data after fetching users", async () => {
  renderComponent(<Users />);
  const row = await screen.findByRole("row", { name: /pfft@example.com/ });
  expect(
    customWithin(row).getCellByHeader(Label.HEADER_EMAIL),
  ).toHaveTextContent("pfft@example.com");
  expect(
    customWithin(row).getCellByHeader(Label.HEADER_FULL_NAME),
  ).toHaveTextContent("really good");
  expect(
    customWithin(row).getCellByHeader(Label.HEADER_SOURCE),
  ).toHaveTextContent("noteworthy");
  expect(
    customWithin(row).getCellByHeader(Label.HEADER_ADDED_BY),
  ).toHaveTextContent("within");
});

test("search users", async () => {
  let getDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "GET" &&
      requestClone.url.endsWith("/identities?filter=joe&size=10&page=0")
    ) {
      getDone = true;
    }
  });
  renderComponent(<Users />);
  await userEvent.type(screen.getByRole("searchbox"), "joe{enter}");
  await waitFor(() => expect(getDone).toBeTruthy());
});

test("paginates", async () => {
  let getDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "GET" &&
      requestClone.url.endsWith("/identities?size=10&page=1")
    ) {
      getDone = true;
    }
  });
  renderComponent(<Users />);
  await userEvent.click(
    await screen.findByRole("button", {
      name: EntityTablePaginationLabel.NEXT_PAGE,
    }),
  );
  await waitFor(() => expect(getDone).toBeTruthy());
});

test("should display no users data when no users are available", async () => {
  mockApiServer.use(
    getGetIdentitiesMockHandler(getGetIdentitiesResponseMock({ data: [] })),
  );
  renderComponent(<Users />);
  expect(await screen.findByText(UsersLabel.NO_USERS)).toBeInTheDocument();
});

test("should display error notification and refetch data", async () => {
  mockApiServer.use(getGetIdentitiesErrorMockHandler());
  renderComponent(<Users />);
  const usersErrorNotification = await screen.findByText(
    UsersLabel.FETCHING_USERS_ERROR,
    { exact: false },
  );
  expect(usersErrorNotification.childElementCount).toBe(1);
  const refetchButton = usersErrorNotification.children[0];
  mockApiServer.use(
    getGetIdentitiesMockHandler(
      getGetIdentitiesResponseMock({
        data: Array.from({ length: 6 }, () =>
          getGetIdentitiesItemResponseMock(),
        ),
      }),
    ),
  );
  expect(refetchButton).toHaveTextContent("refetch");
  await userEvent.click(refetchButton);
  expect(
    await screen.findByText(UsersLabel.FETCHING_USERS),
  ).toBeInTheDocument();
  const rows = await screen.findAllByRole("row");
  expect(rows).toHaveLength(7);
});

test("should display the add panel", async () => {
  mockApiServer.use(
    getGetIdentitiesMockHandler(getGetIdentitiesResponseMock({ data: [] })),
  );
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <aside id="aside-panel"></aside>
      <Users />
    </ReBACAdminContext.Provider>,
  );
  await userEvent.click(screen.getByRole("button", { name: UsersLabel.ADD }));
  const panel = await screen.findByRole("complementary", {
    name: "Create local user",
  });
  expect(panel).toBeInTheDocument();
});

test("displays the delete panel", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <aside id="aside-panel"></aside>
      <Users />
    </ReBACAdminContext.Provider>,
  );
  const rows = await screen.findAllByRole("row");
  await userEvent.click(within(rows[1]).getByRole("checkbox"));
  await userEvent.click(screen.getByRole("button", { name: Label.DELETE }));
  const panel = await screen.findByRole("dialog", {
    name: "Delete 1 user",
  });
  expect(panel).toBeInTheDocument();
});

test("links to user details", async () => {
  renderComponent(<Users />);
  expect(
    await screen.findByRole("link", { name: "pfft@example.com" }),
  ).toHaveAttribute("href", urls.users.user.index({ id: "user1" }));
});
