import { screen, waitFor, within } from "@testing-library/react";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getGetIdentitiesItemResponseMock,
  getGetIdentitiesMockHandler,
  getGetIdentitiesResponseMock,
} from "api/identities/identities.msw";
import { getActualCapabilitiesMock } from "mocks/handlers";
import { renderComponent } from "test/utils";

import Users from "./Users";

const mockUserData = getGetIdentitiesResponseMock({
  data: [
    getGetIdentitiesItemResponseMock({
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
  ...getActualCapabilitiesMock(),
);

beforeAll(() => {
  mockApiServer.listen();
});

beforeEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
});

test("should display correct user data after fetching users", async () => {
  const consoleLog = console.log;
  console.log = vi.fn();

  renderComponent(<Users />);
  expect(screen.getByTestId("loading")).toBeInTheDocument();
  expect(await screen.findByText("Fetching users data...")).toBeInTheDocument();
  await waitFor(() => expect(console.log).toHaveBeenCalledTimes(1));
  const columnHeaders = await screen.findAllByRole("columnheader");
  expect(columnHeaders).toHaveLength(5);
  const rows = screen.getAllByRole("row");
  // The first row contains the column headers and the next 7 rows contain
  // user data.
  expect(rows).toHaveLength(8);
  const firstUserCells = within(rows[1]).getAllByRole("cell");
  expect(firstUserCells).toHaveLength(5);
  expect(firstUserCells[0]).toHaveTextContent("really");
  expect(firstUserCells[1]).toHaveTextContent("Unknown");
  expect(firstUserCells[2]).toHaveTextContent("within");
  expect(firstUserCells[3]).toHaveTextContent("pfft");
  expect(firstUserCells[4]).toHaveTextContent("noteworthy");

  console.log = consoleLog;
});
