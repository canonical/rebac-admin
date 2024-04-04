import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";

import {
  getGetRolesMockHandler,
  getGetRolesResponseMock,
} from "api/roles/roles.msw";
import { getGetRolesErrorMockHandler } from "mocks/roles";
import { renderComponent } from "test/utils";

import Roles from "./Roles";
import { Label as RolesLabel } from "./types";

const mockRolesData = getGetRolesResponseMock({
  data: ["global", "administrator", "viewer"],
});
const mockApiServer = setupServer(getGetRolesMockHandler(mockRolesData));

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
  renderComponent(<Roles />);
  expect(screen.getByText(RolesLabel.FETCHING_ROLES)).toBeInTheDocument();
});

test("should display correct role data after fetching roles", async () => {
  renderComponent(<Roles />);
  const columnHeaders = await screen.findAllByRole("columnheader");
  expect(columnHeaders).toHaveLength(1);
  const rows = screen.getAllByRole("row");
  // The first row contains the column header and the next 3 rows contain
  // role data.
  expect(rows).toHaveLength(4);
  expect(within(rows[1]).getAllByRole("cell")[0]).toHaveTextContent("global");
  expect(within(rows[2]).getAllByRole("cell")[0]).toHaveTextContent(
    "administrator",
  );
  expect(within(rows[3]).getAllByRole("cell")[0]).toHaveTextContent("viewer");
});

test("should display no roles data when no roles are available", async () => {
  mockApiServer.use(
    getGetRolesMockHandler(getGetRolesResponseMock({ data: [] })),
  );
  renderComponent(<Roles />);
  expect(await screen.findByText(RolesLabel.NO_ROLES)).toBeInTheDocument();
});

test("should display error notification and refetch data", async () => {
  mockApiServer.use(getGetRolesErrorMockHandler());
  renderComponent(<Roles />);
  const rolesErrorNotification = await screen.findByText(
    RolesLabel.FETCHING_ROLES_ERROR,
    { exact: false },
  );
  expect(rolesErrorNotification.childElementCount).toBe(1);
  const refetchButton = rolesErrorNotification.children[0];
  mockApiServer.use(getGetRolesMockHandler(mockRolesData));
  expect(refetchButton).toHaveTextContent("refetch");
  await act(() => userEvent.click(refetchButton));
  expect(
    await screen.findByText(RolesLabel.FETCHING_ROLES),
  ).toBeInTheDocument();
  const rows = await screen.findAllByRole("row");
  expect(rows).toHaveLength(4);
});
