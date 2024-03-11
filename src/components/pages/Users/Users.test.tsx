import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import type { GetIdentitiesResponse } from "api/api.schemas";
import { getGetIdentitiesMockHandler } from "api/identities/identities.msw";
import { renderComponent } from "test/utils";

import Users from "./Users";

const mockUserData: GetIdentitiesResponse = {
  _links: { next: { href: "shark" } },
  _meta: {
    page: 2315346499338240,
    pageToken: undefined,
    size: 8520311808983040,
    total: undefined,
  },
  message: "reassuringly",
  status: 186971152449536,
  data: [
    {
      addedBy: "within",
      certificate: undefined,
      email: "pfft",
      firstName: "really",
      groups: 573459845349376,
      id: "amidst",
      joined: "incidentally",
      lastLogin: "upbeat",
      lastName: undefined,
      permissions: undefined,
      roles: 40695496704000,
      source: "noteworthy",
    },
    {
      addedBy: "courageously",
      certificate: undefined,
      email: "at",
      firstName: "really",
      groups: 7091780241588224,
      id: "tambourine",
      joined: "frightfully",
      lastLogin: "wherever",
      lastName: "surprisingly",
      permissions: undefined,
      roles: 8481639678083072,
      source: "admit",
    },
    {
      addedBy: "dear",
      certificate: "where",
      email: "a",
      firstName: undefined,
      groups: undefined,
      id: "on",
      joined: undefined,
      lastLogin: undefined,
      lastName: "inasmuch",
      permissions: undefined,
      roles: undefined,
      source: "yearly",
    },
    {
      addedBy: "underneath",
      certificate: undefined,
      email: "boldly",
      firstName: "minister",
      groups: undefined,
      id: "droopy",
      joined: "nervously",
      lastLogin: "instructive",
      lastName: undefined,
      permissions: 2160749910687744,
      roles: 1976777245196288,
      source: "of",
    },
    {
      addedBy: "for",
      certificate: undefined,
      email: "meh",
      firstName: undefined,
      groups: undefined,
      id: undefined,
      joined: undefined,
      lastLogin: "gym",
      lastName: undefined,
      permissions: undefined,
      roles: 4732892714369024,
      source: "or",
    },
    {
      addedBy: "phew",
      certificate: undefined,
      email: "remaster",
      firstName: "clutch",
      groups: undefined,
      id: undefined,
      joined: "hm",
      lastLogin: "unto",
      lastName: "once",
      permissions: undefined,
      roles: 6147212289507328,
      source: "decisive",
    },
    {
      addedBy: "bookmark",
      certificate: undefined,
      email: "psst",
      firstName: "nervously",
      groups: undefined,
      id: "displace",
      joined: undefined,
      lastLogin: "aha",
      lastName: undefined,
      permissions: undefined,
      roles: undefined,
      source: "tingling",
    },
  ],
};
const mockApiServer = setupServer(getGetIdentitiesMockHandler(mockUserData));

beforeAll(() => {
  mockApiServer.listen();
  vi.useFakeTimers({
    shouldAdvanceTime: true,
  });
});

beforeEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("should display initial page before fetching users", () => {
  renderComponent(<Users />);
  expect(screen.getByText("No data to display!")).toBeInTheDocument();
  const fetchDataButton = screen.getByRole("button", { name: "Fetch data" });
  expect(fetchDataButton).toBeInTheDocument();
});

test("should display loading while fetching users", async () => {
  renderComponent(<Users />);
  const fetchDataButton = screen.getByRole("button", { name: "Fetch data" });
  await act(() => userEvent.click(fetchDataButton));
  expect(await screen.findByText("Fetching users data...")).toBeInTheDocument();
});

test("should display correct user data after fetching users", async () => {
  const consoleLog = console.log;
  console.log = vi.fn();
  renderComponent(<Users />);
  const fetchDataButton = screen.getByRole("button", { name: "Fetch data" });
  await act(() => userEvent.click(fetchDataButton));
  // getGetIdentitiesItemEntitlementsMockHandler is delayed by 1000ms.
  vi.advanceTimersByTime(1000);
  expect(
    await screen.findByRole("button", { name: "Refetch data" }),
  ).toBeInTheDocument();
  expect(console.log).toHaveBeenCalledTimes(1);
  const columnHeaders = await screen.findAllByRole("columnheader");
  expect(columnHeaders).toHaveLength(5);
  expect(columnHeaders[0]).toHaveTextContent("first name");
  expect(columnHeaders[1]).toHaveTextContent("last name");
  expect(columnHeaders[2]).toHaveTextContent("added by");
  expect(columnHeaders[3]).toHaveTextContent("email");
  expect(columnHeaders[4]).toHaveTextContent("source");
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
