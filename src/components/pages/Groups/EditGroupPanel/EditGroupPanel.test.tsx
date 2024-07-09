import { NotificationSeverity } from "@canonical/react-components";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

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
  getGetGroupsItemMockHandler,
  getGetGroupsItemResponseMock,
} from "api/groups/groups.msw";
import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm/types";
import { Label as IdentitiesPanelFormLabel } from "components/pages/Groups/IdentitiesPanelForm/types";
import { Label as RolesPanelFormLabel } from "components/pages/Groups/RolesPanelForm/types";
import { hasToast, renderComponent } from "test/utils";

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
      data: [
        { id: "role123", name: "role1" },
        { id: "role234", name: "role2" },
      ],
    }),
  ),
  getGetGroupsItemMockHandler(
    getGetGroupsItemResponseMock({ id: "admin1", name: "admin" }),
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
    <EditGroupPanel
      group={{ id: "admin1", name: "admin" }}
      groupId="admin1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
  );
  // Wait until the entitlements have loaded.
  await screen.findByText("2 entitlements");
  await userEvent.click(
    screen.getByRole("button", { name: /Edit entitlements/ }),
  );
  await userEvent.click(
    screen.getAllByRole("button", {
      name: EntitlementsPanelFormLabel.REMOVE,
    })[0],
  );
  await userEvent.type(
    screen.getByRole("textbox", {
      name: EntitlementsPanelFormLabel.ENTITY,
    }),
    "client",
  );
  await userEvent.type(
    screen.getByRole("textbox", {
      name: EntitlementsPanelFormLabel.RESOURCE,
    }),
    "editors",
  );
  await userEvent.type(
    screen.getByRole("textbox", {
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
    '{"patches":[{"entitlement":{"entity_type":"editors","entitlement_type":"can_read","entity_name":"client"},"op":"add"},{"entitlement":{"entitlement_type":"can_edit","entity_name":"moderators","entity_type":"collection"},"op":"remove"}]}',
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
    <EditGroupPanel
      group={{ id: "admin1", name: "admin" }}
      groupId="admin1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
  );
  // Wait until the entitlements have loaded.
  await screen.findByText("2 entitlements");
  await userEvent.click(
    screen.getByRole("button", { name: /Edit entitlements/ }),
  );
  await userEvent.click(
    screen.getAllByRole("button", {
      name: EntitlementsPanelFormLabel.REMOVE,
    })[0],
  );
  await userEvent.type(
    screen.getByRole("textbox", {
      name: EntitlementsPanelFormLabel.ENTITY,
    }),
    "client",
  );
  await userEvent.type(
    screen.getByRole("textbox", {
      name: EntitlementsPanelFormLabel.RESOURCE,
    }),
    "editors",
  );
  await userEvent.type(
    screen.getByRole("textbox", {
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
    <EditGroupPanel
      group={{ id: "admin1", name: "admin" }}
      groupId="admin1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
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
    <EditGroupPanel
      group={{ id: "admin1", name: "admin" }}
      groupId="admin1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
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
    <EditGroupPanel
      group={{ id: "admin1", name: "admin" }}
      groupId="admin1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
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
    <EditGroupPanel
      group={{ id: "admin1", name: "admin" }}
      groupId="admin1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
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
