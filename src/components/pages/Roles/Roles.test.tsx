import { screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, delay } from "msw";
import { setupServer } from "msw/node";

import { CapabilityMethodsItem } from "api/api.schemas";
import {
  getGetRolesItemEntitlementsMockHandler,
  getGetRolesItemMockHandler,
  getGetRolesMockHandler,
  getGetRolesMockHandler404,
  getGetRolesResponseMock,
} from "api/roles/roles.msw";
import { EntityTableLabel } from "components/EntityTable";
import { EntityTablePaginationLabel } from "components/EntityTable/EntityTablePagination";
import { TestId as NoEntityCardTestId } from "components/NoEntityCard";
import { ReBACAdminContext } from "context/ReBACAdminContext";
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { mockRole } from "test/mocks/roles";
import { customWithin } from "test/queries/within";
import { renderComponent } from "test/utils";
import { Endpoint } from "types/api";

import Roles from "./Roles";
import { Label, Label as RolesLabel } from "./types";

const mockRolesData = getGetRolesResponseMock({
  _meta: {
    page: 0,
    size: 10,
  },
  data: [
    { id: "role1", name: "global" },
    { id: "role2", name: "administrator" },
    { id: "role3", name: "viewer" },
    ...Array.from({ length: 8 }, mockRole),
  ],
});
const mockApiServer = setupServer(
  getGetRolesMockHandler(mockRolesData),
  getGetRolesItemMockHandler(),
  getGetRolesItemEntitlementsMockHandler(),
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

test("should display spinner on mount", async () => {
  mockApiServer.use(
    http.get(`*${Endpoint.ROLES}`, async () => {
      await delay(100);
    }),
  );
  renderComponent(<Roles />);
  expect(
    await screen.findByText(RolesLabel.FETCHING_ROLES),
  ).toBeInTheDocument();
});

test("should display correct role data after fetching roles", async () => {
  renderComponent(<Roles />);
  const row = await screen.findByRole("row", { name: /global/ });
  expect(
    customWithin(row).getCellByHeader(Label.HEADER_NAME),
  ).toHaveTextContent("global");
});

test("search roles", async () => {
  let getDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "GET" &&
      requestClone.url.endsWith("/roles?filter=role1&size=10&page=0")
    ) {
      getDone = true;
    }
  });
  renderComponent(<Roles />);
  await userEvent.type(screen.getByRole("searchbox"), "role1{enter}");
  await waitFor(() => expect(getDone).toBeTruthy());
});

test("paginates", async () => {
  let getDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "GET" &&
      requestClone.url.endsWith("/roles?size=10&page=1")
    ) {
      getDone = true;
    }
  });
  renderComponent(<Roles />);

  await userEvent.click(
    await screen.findByRole("button", {
      name: EntityTablePaginationLabel.NEXT_PAGE,
    }),
  );
  await waitFor(() => expect(getDone).toBeTruthy());
});

test("should display no roles data when no roles are available", async () => {
  mockApiServer.use(
    getGetRolesMockHandler(getGetRolesResponseMock({ data: [] })),
  );
  renderComponent(<Roles />);
  const noRolesCard = await screen.findByTestId(
    NoEntityCardTestId.NO_ENTITY_CARD,
  );
  expect(
    within(noRolesCard).getByText(RolesLabel.NO_ROLES),
  ).toBeInTheDocument();
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
  await userEvent.click(refetchButton);
  expect(
    await screen.findByText(RolesLabel.FETCHING_ROLES),
  ).toBeInTheDocument();
  const rows = await screen.findAllByRole("row");
  expect(rows).toHaveLength(12);
});

test("displays the add panel", async () => {
  mockApiServer.use(
    getGetRolesMockHandler(getGetRolesResponseMock({ data: [] })),
  );
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <aside id="aside-panel"></aside>
      <Roles />
    </ReBACAdminContext.Provider>,
  );
  await userEvent.click(
    await screen.findByRole("button", { name: RolesLabel.ADD }),
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
      name: EntityTableLabel.ACTION_MENU,
    })
  )[0];
  await userEvent.click(contextMenu);
  await userEvent.click(
    screen.getByRole("button", { name: EntityTableLabel.EDIT }),
  );
  const panel = await screen.findByRole("complementary", {
    name: "Edit role",
  });
  expect(panel).toBeInTheDocument();
});

test("displays the delete panel", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <aside id="aside-panel"></aside>
      <Roles />
    </ReBACAdminContext.Provider>,
  );
  const rows = await screen.findAllByRole("row");
  await userEvent.click(within(rows[1]).getByRole("checkbox"));
  await userEvent.click(screen.getByRole("button", { name: Label.DELETE }));
  const panel = await screen.findByRole("dialog", {
    name: "Delete 1 role",
  });
  expect(panel).toBeInTheDocument();
});

test("does not display the add button if there is no capability", async () => {
  mockApiServer.use(
    ...getGetActualCapabilitiesMock([
      {
        endpoint: Endpoint.ROLES,
        methods: [CapabilityMethodsItem.GET],
      },
    ]),
  );
  renderComponent(<Roles />);
  expect(
    screen.queryByRole("button", { name: RolesLabel.ADD }),
  ).not.toBeInTheDocument();
});

test("does not display the edit button if there is no capability", async () => {
  mockApiServer.use(
    ...getGetActualCapabilitiesMock([
      {
        endpoint: Endpoint.ROLES,
        methods: [CapabilityMethodsItem.GET],
      },
      {
        endpoint: Endpoint.ROLE,
        methods: [CapabilityMethodsItem.GET, CapabilityMethodsItem.DELETE],
      },
    ]),
  );
  renderComponent(<Roles />);
  const contextMenu = (
    await screen.findAllByRole("button", {
      name: EntityTableLabel.ACTION_MENU,
    })
  )[0];
  await userEvent.click(contextMenu);
  expect(
    screen.queryByRole("button", { name: EntityTableLabel.EDIT }),
  ).not.toBeInTheDocument();
});

test("does not display the delete button if there is no capability", async () => {
  mockApiServer.use(
    ...getGetActualCapabilitiesMock([
      {
        endpoint: Endpoint.ROLES,
        methods: [CapabilityMethodsItem.GET],
      },
      {
        endpoint: Endpoint.ROLE,
        methods: [CapabilityMethodsItem.GET, CapabilityMethodsItem.PUT],
      },
    ]),
  );
  renderComponent(<Roles />);
  const rows = await screen.findAllByRole("row");
  expect(within(rows[1]).getByRole("checkbox")).toBeDisabled();
  const contextMenu = (
    await screen.findAllByRole("button", {
      name: EntityTableLabel.ACTION_MENU,
    })
  )[0];
  await userEvent.click(contextMenu);
  expect(
    screen.queryByRole("button", { name: EntityTableLabel.DELETE }),
  ).not.toBeInTheDocument();
});
