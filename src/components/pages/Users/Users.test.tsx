import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";

import {
  getGetIdentitiesItemResponseMock,
  getGetIdentitiesMockHandler,
  getGetIdentitiesResponseMock,
} from "api/identities/identities.msw";
import { Label as CheckCapabilityLabel } from "components/CheckCapability";
import { ReBACAdminContext } from "context/ReBACAdminContext";
import { getGetActualCapabilitiesMock } from "mocks/capabilities";
import { getGetIdentitiesErrorMockHandler } from "mocks/identities";
import { renderComponent } from "test/utils";
import urls from "urls";

import Users from "./Users";
import { Label, Label as UsersLabel } from "./types";

const mockUserData = getGetIdentitiesResponseMock({
  data: [
    getGetIdentitiesItemResponseMock({
      id: "user1",
      addedBy: "within",
      email: "pfft",
      firstName: "really",
      lastName: undefined,
      source: "noteworthy",
    }),
    ...Array.from({ length: 6 }, () => getGetIdentitiesItemResponseMock()),
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
  const columnHeaders = await screen.findAllByRole("columnheader");
  expect(columnHeaders).toHaveLength(7);
  const rows = screen.getAllByRole("row");
  // The first row contains the column headers and the next 7 rows contain
  // user data.
  expect(rows).toHaveLength(8);
  const firstUserCells = within(rows[1]).getAllByRole("cell");
  expect(firstUserCells).toHaveLength(7);
  expect(firstUserCells[1]).toHaveTextContent("really");
  expect(firstUserCells[2]).toHaveTextContent("Unknown");
  expect(firstUserCells[3]).toHaveTextContent("within");
  expect(firstUserCells[4]).toHaveTextContent("pfft");
  expect(firstUserCells[5]).toHaveTextContent("noteworthy");
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
  const panel = await screen.findByRole("complementary", {
    name: "Delete 1 user",
  });
  expect(panel).toBeInTheDocument();
});

test("links to user details", async () => {
  renderComponent(<Users />);
  expect(await screen.findByRole("link", { name: "really" })).toHaveAttribute(
    "href",
    urls.users.user.index({ id: "user1" }),
  );
});
