import { NotificationSeverity } from "@canonical/react-components";
import { screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getPatchGroupsIdEntitlementsMockHandler,
  getPatchGroupsIdEntitlementsMockHandler400,
  getGetGroupsIdEntitlementsMockHandler,
  getGetGroupsIdEntitlementsResponseMock,
  getDeleteGroupsIdEntitlementsEntitlementIdMockHandler,
  getGetGroupsIdEntitlementsMockHandler400,
  getGetGroupsIdIdentitiesMockHandler,
  getGetGroupsIdIdentitiesResponseMock,
  getDeleteGroupsIdIdentitiesIdentityIdMockHandler,
  getPatchGroupsIdIdentitiesMockHandler,
  getPatchGroupsIdIdentitiesMockHandler400,
  getDeleteGroupsIdIdentitiesIdentityIdMockHandler400,
  getPostGroupsIdRolesMockHandler,
  getDeleteGroupsIdRolesRolesIdMockHandler,
  getGetGroupsIdRolesMockHandler,
  getGetGroupsIdRolesResponseMock,
  getPostGroupsIdRolesMockHandler400,
  getGetGroupsIdMockHandler400,
  getGetGroupsIdResponseMock400,
  getGetGroupsIdMockHandler,
  getGetGroupsIdResponseMock,
} from "api/groups-id/groups-id.msw";
import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm/types";
import { Label as IdentitiesPanelFormLabel } from "components/pages/Groups/IdentitiesPanelForm/types";
import { Label as RolesPanelFormLabel } from "components/pages/Groups/RolesPanelForm/types";
import { hasNotification, hasToast, renderComponent } from "test/utils";

import EditGroupPanel from "./EditGroupPanel";
import { Label } from "./types";

const mockApiServer = setupServer(
  getPatchGroupsIdEntitlementsMockHandler(),
  getDeleteGroupsIdEntitlementsEntitlementIdMockHandler(),
  getGetGroupsIdEntitlementsMockHandler(
    getGetGroupsIdEntitlementsResponseMock({
      data: ["can_edit::moderators:collection", "can_remove::staff:team"],
    }),
  ),
  getPatchGroupsIdIdentitiesMockHandler(),
  getDeleteGroupsIdIdentitiesIdentityIdMockHandler(),
  getGetGroupsIdIdentitiesMockHandler(
    getGetGroupsIdIdentitiesResponseMock({
      data: ["user1", "user2"],
    }),
  ),
  getPostGroupsIdRolesMockHandler(),
  getDeleteGroupsIdRolesRolesIdMockHandler(),
  getGetGroupsIdRolesMockHandler(
    getGetGroupsIdRolesResponseMock({
      data: ["role1", "role2"],
    }),
  ),
  getGetGroupsIdMockHandler(
    getGetGroupsIdResponseMock({
      data: [{ id: "admin1", name: "admin" }],
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
    getGetGroupsIdMockHandler400(
      getGetGroupsIdResponseMock400({ message: "group not found" }),
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
test("should handle the group not in the reponse", async () => {
  mockApiServer.use(
    getGetGroupsIdMockHandler(
      getGetGroupsIdResponseMock({
        data: [],
      }),
    ),
  );
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await hasNotification("Unable to get group", NotificationSeverity.NEGATIVE);
});

test("should add and remove entitlements", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  let deleteDone = false;
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
    if (
      requestClone.method === "DELETE" &&
      requestClone.url.endsWith(
        "/groups/admin1/entitlements/can_edit::moderators:collection",
      )
    ) {
      deleteDone = true;
    }
  });
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the entitlements have loaded.
  await screen.findByText("2 entitlements");
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: /Edit entitlements/ }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", {
          name: EntitlementsPanelFormLabel.REMOVE,
        })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: EntitlementsPanelFormLabel.ENTITY,
        }),
        "client",
      ),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: EntitlementsPanelFormLabel.RESOURCE,
        }),
        "editors",
      ),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: EntitlementsPanelFormLabel.ENTITLEMENT,
        }),
        "can_read",
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: EntitlementsPanelFormLabel.SUBMIT }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: "Edit group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Update group" }),
      ),
  );
  await waitFor(() => expect(patchDone && deleteDone).toBeTruthy());
  expect(patchResponseBody).toBe(
    '{"permissions":[{"object":"client:editors","relation":"can_read"}]}',
  );
  await hasToast('Group "admin" was updated.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when updating entitlements", async () => {
  mockApiServer.use(
    getGetGroupsIdEntitlementsMockHandler(
      getGetGroupsIdEntitlementsResponseMock({
        data: ["can_edit::moderators:collection", "can_remove::staff:team"],
      }),
    ),
    getPatchGroupsIdEntitlementsMockHandler400(),
    getGetGroupsIdEntitlementsMockHandler400(),
  );
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the entitlements have loaded.
  await screen.findByText("2 entitlements");
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: /Edit entitlements/ }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", {
          name: EntitlementsPanelFormLabel.REMOVE,
        })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: EntitlementsPanelFormLabel.ENTITY,
        }),
        "client",
      ),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: EntitlementsPanelFormLabel.RESOURCE,
        }),
        "editors",
      ),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: EntitlementsPanelFormLabel.ENTITLEMENT,
        }),
        "can_read",
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: EntitlementsPanelFormLabel.SUBMIT }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: "Edit group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Update group" }),
      ),
  );
  await hasToast(Label.ENTITLEMENTS_ERROR, NotificationSeverity.NEGATIVE);
});

test("should add and remove users", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  let deleteDone = false;
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
    if (
      requestClone.method === "DELETE" &&
      requestClone.url.endsWith("/groups/admin1/identities/user1")
    ) {
      deleteDone = true;
    }
  });
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the users have loaded.
  await screen.findByText("2 users");
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: /Edit users/ })),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", {
          name: IdentitiesPanelFormLabel.REMOVE,
        })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: IdentitiesPanelFormLabel.USER,
        }),
        "joe",
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: IdentitiesPanelFormLabel.SUBMIT }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: "Edit group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Update group" }),
      ),
  );
  await waitFor(() => expect(patchDone && deleteDone).toBeTruthy());
  expect(patchResponseBody).toBe('{"identities":["joe"]}');
  await hasToast('Group "admin" was updated.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when updating users", async () => {
  mockApiServer.use(
    getPatchGroupsIdIdentitiesMockHandler400(),
    getDeleteGroupsIdIdentitiesIdentityIdMockHandler400(),
  );
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the users have loaded.
  await screen.findByText("2 users");
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: /Edit users/ })),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: IdentitiesPanelFormLabel.USER,
        }),
        "joe",
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: IdentitiesPanelFormLabel.SUBMIT }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: "Edit group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Update group" }),
      ),
  );
  await hasToast(Label.IDENTITIES_ERROR, NotificationSeverity.NEGATIVE);
});

test("should add and remove roles", async () => {
  let postResponseBody: string | null = null;
  let postDone = false;
  let deleteDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "POST" &&
      requestClone.url.endsWith("/groups/admin1/roles")
    ) {
      postResponseBody = await requestClone.text();
      postDone = true;
    }
    if (
      requestClone.method === "DELETE" &&
      requestClone.url.endsWith("/groups/admin1/roles/role1")
    ) {
      deleteDone = true;
    }
  });
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the roles have loaded.
  await screen.findByText("2 roles");
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: /Edit roles/ })),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", {
          name: RolesPanelFormLabel.REMOVE,
        })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: RolesPanelFormLabel.ROLE,
        }),
        "role3",
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: RolesPanelFormLabel.SUBMIT }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: "Edit group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Update group" }),
      ),
  );
  await waitFor(() => expect(postDone && deleteDone).toBeTruthy());
  expect(postResponseBody).toBe('{"roles":["role3"]}');
  await hasToast('Group "admin" was updated.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when updating roles", async () => {
  mockApiServer.use(
    getPostGroupsIdRolesMockHandler400(),
    getDeleteGroupsIdRolesRolesIdMockHandler(),
  );
  renderComponent(
    <EditGroupPanel groupId="admin1" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the roles have loaded.
  await screen.findByText("2 roles");
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: /Edit roles/ })),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: RolesPanelFormLabel.ROLE,
        }),
        "admin",
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: RolesPanelFormLabel.SUBMIT }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: "Edit group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Update group" }),
      ),
  );
  await hasToast(Label.ROLES_ERROR, NotificationSeverity.NEGATIVE);
});
