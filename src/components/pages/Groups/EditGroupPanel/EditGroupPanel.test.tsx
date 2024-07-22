import { NotificationSeverity } from "@canonical/react-components";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import type { Group } from "api/api.schemas";
import {
  getGetEntitlementsMockHandler,
  getGetEntitlementsResponseMock,
} from "api/entitlements/entitlements.msw";
import {
  getPatchGroupsItemEntitlementsMockHandler,
  getPatchGroupsItemEntitlementsMockHandler400,
  getGetGroupsItemEntitlementsMockHandler,
  getGetGroupsItemEntitlementsResponseMock,
  getGetGroupsItemEntitlementsMockHandler400,
  getGetGroupsItemIdentitiesMockHandler,
  getGetGroupsItemIdentitiesResponseMock,
  getPatchGroupsItemIdentitiesMockHandler,
  getPatchGroupsItemIdentitiesMockHandler400,
  getPatchGroupsItemRolesMockHandler,
  getGetGroupsItemRolesMockHandler,
  getGetGroupsItemRolesResponseMock,
  getPatchGroupsItemRolesMockHandler400,
  getGetGroupsItemMockHandler400,
  getGetGroupsItemResponseMock400,
  getGetGroupsItemMockHandler,
  getGetGroupsItemResponseMock,
} from "api/groups/groups.msw";
import {
  getGetResourcesMockHandler,
  getGetResourcesResponseMock,
} from "api/resources/resources.msw";
import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm/types";
import { Label as IdentitiesPanelFormLabel } from "components/pages/Groups/IdentitiesPanelForm/types";
import { Label as RolesPanelFormLabel } from "components/pages/Groups/RolesPanelForm/types";
import { hasNotification, hasToast, renderComponent } from "test/utils";

import EditGroupPanel from "./EditGroupPanel";
import { Label } from "./types";

const mockApiServer = setupServer(
  getPatchGroupsItemEntitlementsMockHandler(),
  getGetGroupsItemEntitlementsMockHandler(
    getGetGroupsItemEntitlementsResponseMock({
      data: [
        {
          entitlement_type: "can_edit",
          entity_name: "moderators",
          entity_type: "collection",
        },
        {
          entitlement_type: "can_remove",
          entity_name: "staff",
          entity_type: "team",
        },
      ],
    }),
  ),
  getPatchGroupsItemIdentitiesMockHandler(),
  getGetGroupsItemIdentitiesMockHandler(
    getGetGroupsItemIdentitiesResponseMock({
      data: [{ email: "user1@example.com" }, { email: "user2@example.com" }],
    }),
  ),
  getPatchGroupsItemRolesMockHandler(),
  getGetGroupsItemRolesMockHandler(
    getGetGroupsItemRolesResponseMock({
      data: [{ name: "role1" }, { name: "role2" }],
    }),
  ),
  getGetGroupsItemMockHandler(
    getGetGroupsItemResponseMock({ id: "admin1", name: "admin" }),
  ),
  getGetEntitlementsMockHandler(
    getGetEntitlementsResponseMock({
      data: [
        {
          entitlement_type: "can_read",
          entity_name: "editors",
          entity_type: "client",
        },
      ],
    }),
  ),
  getGetResourcesMockHandler(
    getGetResourcesResponseMock({
      data: [
        {
          id: "mock-id",
          name: "editors",
          entity: {
            id: "mock-entity-id",
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

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when getting the group", async () => {
  mockApiServer.use(
    getGetGroupsItemMockHandler400(
      getGetGroupsItemResponseMock400({ message: "group not found" }),
    ),
  );
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await hasNotification(
    "Unable to get group: group not found",
    NotificationSeverity.NEGATIVE,
  );
});

// eslint-disable-next-line vitest/expect-expect
test("should handle the group not in the response", async () => {
  // Mock the group not in the response, which is not a valid type.
  mockApiServer.use(getGetGroupsItemMockHandler(null as unknown as Group));
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await hasNotification("Unable to get group", NotificationSeverity.NEGATIVE);
});

test("should add and remove entitlements", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/groups/admin1/entitlements")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the entitlements have loaded.
  await screen.findByText("2 entitlements");
  await userEvent.click(
    screen.getByRole("button", { name: /Edit entitlements/ }),
  );
  await screen.findByText("Add entitlement tuple");
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
  await screen.findByText("Select a resource");
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
    screen.getAllByRole("button", { name: "Edit group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update group" }));
  await waitFor(() => expect(patchDone).toBe(true));
  expect(patchResponseBody).toStrictEqual(
    '{"patches":[{"entitlement":{"entity_type":"client","entitlement_type":"can_read","entity_name":"editors"},"op":"add"},{"entitlement":{"entitlement_type":"can_edit","entity_name":"moderators","entity_type":"collection"},"op":"remove"}]}',
  );
  await hasToast('Group "admin" was updated.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when updating entitlements", async () => {
  mockApiServer.use(
    getGetGroupsItemEntitlementsMockHandler(
      getGetGroupsItemEntitlementsResponseMock({
        data: ["can_edit::moderators:collection", "can_remove::staff:team"],
      }),
    ),
    getPatchGroupsItemEntitlementsMockHandler400(),
    getGetGroupsItemEntitlementsMockHandler400(),
  );
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the entitlements have loaded.
  await screen.findByText("2 entitlements");
  await userEvent.click(
    screen.getByRole("button", { name: /Edit entitlements/ }),
  );
  await screen.findByText("Add entitlement tuple");
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
  await screen.findByText("Select a resource");
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
    screen.getAllByRole("button", { name: "Edit group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update group" }));
  await hasToast(Label.ENTITLEMENTS_ERROR, NotificationSeverity.NEGATIVE);
});

test("should add and remove users", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/groups/admin1/identities")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the users have loaded.
  await screen.findByText("2 users");
  await userEvent.click(screen.getByRole("button", { name: /Edit users/ }));
  await userEvent.click(
    screen.getAllByRole("button", {
      name: IdentitiesPanelFormLabel.REMOVE,
    })[0],
  );
  await userEvent.type(
    screen.getByRole("textbox", {
      name: IdentitiesPanelFormLabel.USER,
    }),
    "joe@example.com",
  );
  await userEvent.click(
    screen.getByRole("button", { name: IdentitiesPanelFormLabel.SUBMIT }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update group" }));
  await waitFor(() => expect(patchDone).toBe(true));
  expect(patchResponseBody).toBe(
    '{"patches":[{"identity":"joe@example.com","op":"add"},{"identity":"user1@example.com","op":"remove"}]}',
  );
  await hasToast('Group "admin" was updated.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when updating users", async () => {
  mockApiServer.use(getPatchGroupsItemIdentitiesMockHandler400());
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the users have loaded.
  await screen.findByText("2 users");
  await userEvent.click(screen.getByRole("button", { name: /Edit users/ }));
  await userEvent.type(
    screen.getByRole("textbox", {
      name: IdentitiesPanelFormLabel.USER,
    }),
    "joe@example.com",
  );
  await userEvent.click(
    screen.getByRole("button", { name: IdentitiesPanelFormLabel.SUBMIT }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update group" }));
  await hasToast(Label.IDENTITIES_ERROR, NotificationSeverity.NEGATIVE);
});

test("should add and remove roles", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/groups/admin1/roles")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the roles have loaded.
  await screen.findByText("2 roles");
  await userEvent.click(screen.getByRole("button", { name: /Edit roles/ }));
  await userEvent.click(
    screen.getAllByRole("button", {
      name: RolesPanelFormLabel.REMOVE,
    })[0],
  );
  await userEvent.type(
    screen.getByRole("textbox", {
      name: RolesPanelFormLabel.ROLE,
    }),
    "role3",
  );
  await userEvent.click(
    screen.getByRole("button", { name: RolesPanelFormLabel.SUBMIT }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update group" }));
  await waitFor(() => expect(patchDone).toBe(true));
  expect(patchResponseBody).toBe(
    '{"patches":[{"role":"role3","op":"add"},{"role":"role1","op":"remove"}]}',
  );
  await hasToast('Group "admin" was updated.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when updating roles", async () => {
  mockApiServer.use(getPatchGroupsItemRolesMockHandler400());
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the roles have loaded.
  await screen.findByText("2 roles");
  await userEvent.click(screen.getByRole("button", { name: /Edit roles/ }));
  await userEvent.type(
    screen.getByRole("textbox", {
      name: RolesPanelFormLabel.ROLE,
    }),
    "admin",
  );
  await userEvent.click(
    screen.getByRole("button", { name: RolesPanelFormLabel.SUBMIT }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update group" }));
  await hasToast(Label.ROLES_ERROR, NotificationSeverity.NEGATIVE);
});
