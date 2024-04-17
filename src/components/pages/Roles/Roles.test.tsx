import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";

import {
  getGetRolesMockHandler,
  getGetRolesMockHandler404,
  getGetRolesResponseMock,
} from "api/roles/roles.msw";
import { getGetRolesIdEntitlementsMockHandler } from "api/roles-id/roles-id.msw";
import { ReBACAdminContext } from "context/ReBACAdminContext";
import { renderComponent } from "test/utils";

import Roles from "./Roles";
import { Label, Label as RolesLabel } from "./types";

const mockRolesData = getGetRolesResponseMock({
  data: ["global", "administrator", "viewer"],
});
const mockApiServer = setupServer(
  getGetRolesMockHandler(mockRolesData),
  getGetRolesIdEntitlementsMockHandler(),
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
  renderComponent(<Roles />);
  expect(screen.getByText(RolesLabel.FETCHING_ROLES)).toBeInTheDocument();
});

test("should display correct role data after fetching roles", async () => {
  renderComponent(<Roles />);
  const rows = await screen.findAllByRole("row");
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
  mockApiServer.use(getGetRolesMockHandler404());
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

test("displays the add panel", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <aside id="aside-panel"></aside>
      <Roles />
    </ReBACAdminContext.Provider>,
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Create role" }),
      ),
  );
  const panel = await screen.findByRole("complementary", {
    name: "Create role",
  });
  expect(panel).toBeInTheDocument();
});

test("displays the edit panel", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <aside id="aside-panel"></aside>
      <Roles />
    </ReBACAdminContext.Provider>,
  );
  const contextMenu = (
    await screen.findAllByRole("button", {
      name: Label.ACTION_MENU,
    })
  )[0];
  await act(async () => await userEvent.click(contextMenu));
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: Label.EDIT })),
  );
  const panel = await screen.findByRole("complementary", {
    name: "Edit role",
  });
  expect(panel).toBeInTheDocument();
});
