import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";

import {
  getGetUsersMockHandler,
  getGetUsersMockHandler404,
  getGetUsersResponseMock,
} from "api/users/users.msw";
import { renderComponent } from "test/utils";

import Users from "./Users";
import { Label as UsersLabel } from "./types";

const mockUserData = getGetUsersResponseMock({
  data: [
    {
      addedBy: "within",
      email: "pfft",
      firstName: "really",
      lastName: undefined,
      source: "noteworthy",
    },
  ],
});
const mockApiServer = setupServer(getGetUsersMockHandler(mockUserData));

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
  expect(screen.getByText(UsersLabel.FETCHING_USERS)).toBeInTheDocument();
});

test("should display correct user data after fetching users", async () => {
  renderComponent(<Users />);
  const columnHeaders = await screen.findAllByRole("columnheader");
  expect(columnHeaders).toHaveLength(5);
  const rows = screen.getAllByRole("row");
  // The first row contains the column headers and the next 7 rows contain
  // user data.
  expect(rows).toHaveLength(2);
  const firstUserCells = within(rows[1]).getAllByRole("cell");
  expect(firstUserCells).toHaveLength(5);
  expect(firstUserCells[0]).toHaveTextContent("really");
  expect(firstUserCells[1]).toHaveTextContent("Unknown");
  expect(firstUserCells[2]).toHaveTextContent("within");
  expect(firstUserCells[3]).toHaveTextContent("pfft");
  expect(firstUserCells[4]).toHaveTextContent("noteworthy");
});

test("should display no users data when no users are available", async () => {
  mockApiServer.use(
    getGetUsersMockHandler(getGetUsersResponseMock({ data: [] })),
  );
  renderComponent(<Users />);
  expect(await screen.findByText(UsersLabel.NO_USERS)).toBeInTheDocument();
});

test("should display error notification and refetch data", async () => {
  mockApiServer.use(getGetUsersMockHandler404());
  renderComponent(<Users />);
  const usersErrorNotification = await screen.findByText(
    UsersLabel.FETCHING_USERS_ERROR,
    { exact: false },
  );
  expect(usersErrorNotification.childElementCount).toBe(1);
  const refetchButton = usersErrorNotification.children[0];
  mockApiServer.use(getGetUsersMockHandler(mockUserData));
  expect(refetchButton).toHaveTextContent("refetch");
  await act(() => userEvent.click(refetchButton));
  expect(
    await screen.findByText(UsersLabel.FETCHING_USERS),
  ).toBeInTheDocument();
  const rows = await screen.findAllByRole("row");
  expect(rows).toHaveLength(2);
});
