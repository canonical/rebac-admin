import { screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, delay } from "msw";
import { setupServer } from "msw/node";

import { CapabilityMethodsItem } from "api/api.schemas";
import {
  getGetGroupsItemEntitlementsMockHandler,
  getGetGroupsItemIdentitiesMockHandler,
  getGetGroupsItemMockHandler,
  getGetGroupsItemRolesMockHandler,
  getGetGroupsMockHandler,
  getGetGroupsMockHandler404,
  getGetGroupsResponseMock,
} from "api/groups/groups.msw";
import { EntityTableLabel } from "components/EntityTable";
import { EntityTablePaginationLabel } from "components/EntityTable/EntityTablePagination";
import { TestId as NoEntityCardTestId } from "components/NoEntityCard";
import { ReBACAdminContext } from "context/ReBACAdminContext";
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { mockGroup } from "test/mocks/groups";
import { customWithin } from "test/queries/within";
import { renderComponent } from "test/utils";
import { Endpoint } from "types/api";

import Groups from "./Groups";
import { Label as GroupsLabel, Label } from "./types";

const mockGroupsData = getGetGroupsResponseMock({
  _meta: {
    page: 0,
    size: 10,
  },
  data: [
    mockGroup({ id: "group1", name: "global" }),
    mockGroup({ id: "group2", name: "administrator" }),
    mockGroup({ id: "group3", name: "viewer" }),
    ...Array.from({ length: 8 }, mockGroup),
  ],
});
const mockApiServer = setupServer(
  getGetGroupsItemMockHandler(),
  getGetGroupsMockHandler(mockGroupsData),
  getGetGroupsItemEntitlementsMockHandler(),
  getGetGroupsItemIdentitiesMockHandler(),
  getGetGroupsItemRolesMockHandler(),
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
    http.get(`*${Endpoint.GROUPS}`, async () => {
      await delay(100);
    }),
  );
  renderComponent(<Groups />);
  expect(
    await screen.findByText(GroupsLabel.FETCHING_GROUPS),
  ).toBeInTheDocument();
});

test("should display correct group data after fetching groups", async () => {
  renderComponent(<Groups />);
  const row = await screen.findByRole("row", { name: /global/ });
  expect(
    customWithin(row).getCellByHeader(Label.HEADER_NAME),
  ).toHaveTextContent("global");
});

test("search groups", async () => {
  let getDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "GET" &&
      requestClone.url.endsWith("/groups?filter=group1&size=10&page=0")
    ) {
      getDone = true;
    }
  });
  renderComponent(<Groups />);
  await userEvent.type(screen.getByRole("searchbox"), "group1{enter}");
  await waitFor(() => expect(getDone).toBeTruthy());
});

test("paginates", async () => {
  let getDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "GET" &&
      requestClone.url.endsWith("/groups?size=10&page=1")
    ) {
      getDone = true;
    }
  });
  renderComponent(<Groups />);
  // Wait for rows to appear.
  await screen.findAllByRole("row");
  await userEvent.click(
    await screen.findByRole("button", {
      name: EntityTablePaginationLabel.NEXT_PAGE,
    }),
  );
  await waitFor(() => expect(getDone).toBeTruthy());
});

test("should display no groups data when no groups are available", async () => {
  mockApiServer.use(
    getGetGroupsMockHandler(getGetGroupsResponseMock({ data: [] })),
  );
  renderComponent(<Groups />);
  const noGroupsCard = await screen.findByTestId(
    NoEntityCardTestId.NO_ENTITY_CARD,
  );
  expect(
    within(noGroupsCard).getByText(GroupsLabel.NO_GROUPS),
  ).toBeInTheDocument();
});

test("should display error notification and refetch data", async () => {
  mockApiServer.use(getGetGroupsMockHandler404());
  renderComponent(<Groups />);
  const groupsErrorNotification = await screen.findByText(
    GroupsLabel.FETCHING_GROUPS_ERROR,
    { exact: false },
  );
  expect(groupsErrorNotification.childElementCount).toBe(1);
  const refetchButton = groupsErrorNotification.children[0];
  mockApiServer.use(getGetGroupsMockHandler(mockGroupsData));
  expect(refetchButton).toHaveTextContent("refetch");
  await userEvent.click(refetchButton);
  expect(
    await screen.findByText(GroupsLabel.FETCHING_GROUPS),
  ).toBeInTheDocument();
  const rows = await screen.findAllByRole("row");
  expect(rows).toHaveLength(12);
});

test("displays the add panel", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <aside id="aside-panel"></aside>
      <Groups />
    </ReBACAdminContext.Provider>,
  );
  await userEvent.click(await screen.findByRole("button", { name: Label.ADD }));
  const panel = await screen.findByRole("complementary", {
    name: "Create group",
  });
  expect(panel).toBeInTheDocument();
});

test("displays the edit panel", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <aside id="aside-panel"></aside>
      <Groups />
    </ReBACAdminContext.Provider>,
  );
  // Wait for rows to appear.
  await screen.findAllByRole("row");
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
    name: "Edit group",
  });
  expect(panel).toBeInTheDocument();
});

test("displays the delete panel", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <aside id="aside-panel"></aside>
      <Groups />
    </ReBACAdminContext.Provider>,
  );
  await screen.findAllByRole("row");
  const row = await screen.findByRole("row", { name: /global/ });
  await userEvent.click(within(row).getByRole("checkbox"));
  await userEvent.click(screen.getByRole("button", { name: Label.DELETE }));
  const panel = await screen.findByRole("dialog", {
    name: "Delete 1 group",
  });
  expect(panel).toBeInTheDocument();
});

test("does not display the add button if there is no capability", async () => {
  mockApiServer.use(
    ...getGetActualCapabilitiesMock([
      {
        endpoint: Endpoint.GROUPS,
        methods: [CapabilityMethodsItem.GET],
      },
    ]),
  );
  renderComponent(<Groups />);
  expect(
    screen.queryByRole("button", { name: GroupsLabel.ADD }),
  ).not.toBeInTheDocument();
});

test("does not display the edit button if there is no capability", async () => {
  mockApiServer.use(
    ...getGetActualCapabilitiesMock([
      {
        endpoint: Endpoint.GROUPS,
        methods: [CapabilityMethodsItem.GET],
      },
      {
        endpoint: Endpoint.GROUP,
        methods: [CapabilityMethodsItem.GET, CapabilityMethodsItem.DELETE],
      },
    ]),
  );
  renderComponent(<Groups />);
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
        endpoint: Endpoint.GROUPS,
        methods: [CapabilityMethodsItem.GET],
      },
      {
        endpoint: Endpoint.GROUP,
        methods: [CapabilityMethodsItem.GET, CapabilityMethodsItem.PUT],
      },
    ]),
  );
  renderComponent(<Groups />);
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
