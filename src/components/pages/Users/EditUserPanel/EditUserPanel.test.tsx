import { NotificationSeverity } from "@canonical/react-components";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getGetEntitlementsMockHandler,
  getGetEntitlementsResponseMock,
} from "api/entitlements/entitlements.msw";
import {
  getGetGroupsMockHandler,
  getGetGroupsResponseMock,
} from "api/groups/groups.msw";
import {
  getPatchIdentitiesItemEntitlementsMockHandler,
  getPatchIdentitiesItemEntitlementsMockHandler400,
  getGetIdentitiesItemEntitlementsMockHandler,
  getGetIdentitiesItemEntitlementsResponseMock,
  getGetIdentitiesItemEntitlementsMockHandler400,
  getGetIdentitiesItemMockHandler,
  getGetIdentitiesItemResponseMock,
  getPatchIdentitiesItemGroupsMockHandler400,
  getGetIdentitiesItemGroupsResponseMock,
  getGetIdentitiesItemGroupsMockHandler,
  getPatchIdentitiesItemGroupsMockHandler,
} from "api/identities/identities.msw";
import {
  getGetResourcesMockHandler,
  getGetResourcesResponseMock,
} from "api/resources/resources.msw";
import { EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { EntitlementPanelFormFieldsLabel } from "components/EntitlementsPanelForm/Fields";
import { GroupsPanelFormLabel } from "components/GroupsPanelForm";
import { mockGroup } from "mocks/groups";
import { renderComponent } from "test/utils";

import EditUserPanel from "./EditUserPanel";
import { Label } from "./types";

const mockUser = {
  id: "user1",
  addedBy: "within",
  email: "pfft@example.com",
  firstName: "really",
  lastName: "good",
  source: "noteworthy",
};

const mockApiServer = setupServer(
  getPatchIdentitiesItemGroupsMockHandler(),
  getPatchIdentitiesItemEntitlementsMockHandler(),
  getGetIdentitiesItemEntitlementsMockHandler(
    getGetIdentitiesItemEntitlementsResponseMock({
      data: [
        {
          entitlement: "can_edit",
          entity_id: "moderators",
          entity_type: "collection",
        },
        {
          entitlement: "can_remove",
          entity_id: "staff",
          entity_type: "team",
        },
      ],
    }),
  ),
  getGetIdentitiesItemMockHandler(getGetIdentitiesItemResponseMock(mockUser)),
  getGetIdentitiesItemGroupsMockHandler(
    getGetIdentitiesItemGroupsResponseMock({
      data: [
        { id: "1", name: "group1" },
        { id: "2", name: "group2" },
      ],
    }),
  ),
  getGetGroupsMockHandler(
    getGetGroupsResponseMock({
      data: [
        mockGroup({ id: "1", name: "group1" }),
        mockGroup({ id: "2", name: "group2" }),
        mockGroup({ id: "3", name: "group3" }),
      ],
    }),
  ),
  getGetEntitlementsMockHandler(
    getGetEntitlementsResponseMock({
      data: [
        {
          entitlement: "can_read",
          receiver_type: "editors",
          entity_type: "client",
        },
      ],
    }),
  ),
  getGetResourcesMockHandler(
    getGetResourcesResponseMock({
      data: [
        {
          entity: {
            id: "mock-entity-id",
            name: "editors",
            type: "mock-entity-name",
          },
        },
      ],
    }),
  ),
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

test("should add and remove groups", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user1/groups")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditUserPanel
      user={mockUser}
      userId="user1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
  );
  // Wait until the groups have loaded.
  await screen.findByText("2 groups");
  await userEvent.click(screen.getByRole("button", { name: /Edit groups/ }));
  await userEvent.click(
    screen.getAllByRole("button", {
      name: GroupsPanelFormLabel.REMOVE,
    })[0],
  );
  await userEvent.click(
    screen.getByRole("combobox", {
      name: GroupsPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "group3",
    }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Update local user" }),
  );
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe(
    '{"patches":[{"group":"3","op":"add"},{"group":"1","op":"remove"}]}',
  );
  expect(
    await findNotificationByText(
      'User with email "pfft@example.com" was updated.',
      { appearance: "toast", severity: NotificationSeverity.POSITIVE },
    ),
  ).toBeInTheDocument();
});

test("should handle errors when updating groups", async () => {
  mockApiServer.use(getPatchIdentitiesItemGroupsMockHandler400());
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditUserPanel
      user={mockUser}
      userId="user1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
  );
  // Wait until the groups have loaded.
  await screen.findByText("2 groups");
  await userEvent.click(screen.getByRole("button", { name: /Edit groups/ }));
  await userEvent.click(
    screen.getByRole("combobox", {
      name: GroupsPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "group3",
    }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Update local user" }),
  );
  expect(
    await findNotificationByText(Label.GROUPS_ERROR, { appearance: "toast" }),
  ).toBeInTheDocument();
});

test("should add and remove entitlements", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user1/entitlements")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditUserPanel
      user={mockUser}
      userId="user1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
  );
  // Wait until the entitlements have loaded.
  await screen.findByText("2 entitlements");
  await userEvent.click(
    screen.getByRole("button", { name: /Edit entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
  await userEvent.click(
    screen.getAllByRole("button", {
      name: EntitlementsPanelFormLabel.REMOVE,
    })[0],
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.ENTITY,
    }),
    "client",
  );
  await screen.findByText(EntitlementPanelFormFieldsLabel.SELECT_RESOURCE);
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.RESOURCE,
    }),
    "editors",
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.ENTITLEMENT,
    }),
    "can_read",
  );
  await userEvent.click(
    screen.getByRole("button", { name: EntitlementsPanelFormLabel.SUBMIT }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Update local user" }),
  );
  await waitFor(() => expect(patchDone).toBe(true));
  expect(patchResponseBody && JSON.parse(patchResponseBody)).toStrictEqual({
    patches: [
      {
        entitlement: {
          entity_type: "client",
          entitlement: "can_read",
          entity_id: "mock-entity-id",
        },
        op: "add",
      },
      {
        entitlement: {
          entitlement: "can_edit",
          entity_id: "moderators",
          entity_type: "collection",
        },
        op: "remove",
      },
    ],
  });
  expect(
    await findNotificationByText(
      'User with email "pfft@example.com" was updated.',
      {
        appearance: "toast",
        severity: NotificationSeverity.POSITIVE,
      },
    ),
  ).toBeInTheDocument();
});

test("should handle errors when updating entitlements", async () => {
  mockApiServer.use(
    getGetIdentitiesItemEntitlementsMockHandler(
      getGetIdentitiesItemEntitlementsResponseMock({
        data: ["can_edit::moderators:collection", "can_remove::staff:team"],
      }),
    ),
    getPatchIdentitiesItemEntitlementsMockHandler400(),
    getGetIdentitiesItemEntitlementsMockHandler400(),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditUserPanel
      user={mockUser}
      userId="user1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
  );
  // Wait until the entitlements have loaded.
  await screen.findByText("2 entitlements");
  await userEvent.click(
    screen.getByRole("button", { name: /Edit entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
  await userEvent.click(
    screen.getAllByRole("button", {
      name: EntitlementsPanelFormLabel.REMOVE,
    })[0],
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.ENTITY,
    }),
    "client",
  );
  await screen.findByText(EntitlementPanelFormFieldsLabel.SELECT_RESOURCE);
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.RESOURCE,
    }),
    "editors",
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.ENTITLEMENT,
    }),
    "can_read",
  );
  await userEvent.click(
    screen.getByRole("button", { name: EntitlementsPanelFormLabel.SUBMIT }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Update local user" }),
  );
  expect(
    await findNotificationByText(Label.ENTITLEMENTS_ERROR, {
      appearance: "toast",
      severity: NotificationSeverity.NEGATIVE,
    }),
  ).toBeInTheDocument();
});
