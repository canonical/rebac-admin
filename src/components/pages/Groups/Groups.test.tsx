import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";

import {
  getGetGroupsMockHandler,
  getGetGroupsResponseMock,
} from "api/groups/groups.msw";
import { getGetGroupsErrorMockHandler } from "mocks/groups";
import { renderComponent } from "test/utils";

import Groups from "./Groups";
import { Label as GroupsLabel } from "./types";

const mockGroupsData = getGetGroupsResponseMock({
  data: ["global", "administrator", "viewer"],
});
const mockApiServer = setupServer(getGetGroupsMockHandler(mockGroupsData));

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
  renderComponent(<Groups />);
  expect(screen.getByText(GroupsLabel.FETCHING_GROUPS)).toBeInTheDocument();
});

test("should display correct group data after fetching groups", async () => {
  renderComponent(<Groups />);
  const columnHeaders = await screen.findAllByRole("columnheader");
  expect(columnHeaders).toHaveLength(1);
  const rows = screen.getAllByRole("row");
  // The first row contains the column header and the next 3 rows contain
  // group data.
  expect(rows).toHaveLength(4);
  expect(within(rows[1]).getAllByRole("cell")[0]).toHaveTextContent("global");
  expect(within(rows[2]).getAllByRole("cell")[0]).toHaveTextContent(
    "administrator",
  );
  expect(within(rows[3]).getAllByRole("cell")[0]).toHaveTextContent("viewer");
});

test("should display no groups data when no groups are available", async () => {
  mockApiServer.use(
    getGetGroupsMockHandler(getGetGroupsResponseMock({ data: [] })),
  );
  renderComponent(<Groups />);
  expect(await screen.findByText(GroupsLabel.NO_GROUPS)).toBeInTheDocument();
});

test("should display error notification and refetch data", async () => {
  mockApiServer.use(getGetGroupsErrorMockHandler());
  renderComponent(<Groups />);
  const groupsErrorNotification = await screen.findByText(
    GroupsLabel.FETCHING_GROUPS_ERROR,
    { exact: false },
  );
  expect(groupsErrorNotification.childElementCount).toBe(1);
  const refetchButton = groupsErrorNotification.children[0];
  mockApiServer.use(getGetGroupsMockHandler(mockGroupsData));
  expect(refetchButton).toHaveTextContent("refetch");
  await act(() => userEvent.click(refetchButton));
  expect(
    await screen.findByText(GroupsLabel.FETCHING_GROUPS),
  ).toBeInTheDocument();
  const rows = await screen.findAllByRole("row");
  expect(rows).toHaveLength(4);
});
