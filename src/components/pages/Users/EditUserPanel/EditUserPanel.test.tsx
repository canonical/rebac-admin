import { NotificationSeverity } from "@canonical/react-components";
import * as reactQuery from "@tanstack/react-query";
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
  getGetIdentitiesItemRolesMockHandler,
  getGetIdentitiesItemRolesResponseMock,
  getPatchIdentitiesItemRolesMockHandler,
  getPatchIdentitiesItemRolesMockHandler400,
  getPutIdentitiesItemMockHandler,
  getPutIdentitiesItemMockHandler400,
} from "api/identities/identities.msw";
import {
  getGetResourcesMockHandler,
  getGetResourcesResponseMock,
} from "api/resources/resources.msw";
import {
  getGetRolesMockHandler,
  getGetRolesResponseMock,
} from "api/roles/roles.msw";
import { EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { EntitlementPanelFormFieldsLabel } from "components/EntitlementsPanelForm/Fields";
import { GroupsPanelFormLabel } from "components/GroupsPanelForm";
import { RolesPanelFormLabel } from "components/RolesPanelForm";
import { UserPanelLabel } from "components/pages/Users/UserPanel";
import { mockGroup } from "test/mocks/groups";
import { renderComponent } from "test/utils";

import EditUserPanel from "./EditUserPanel";
import { Label } from "./types";

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: vi.fn().mockReturnValue({ invalidateQueries: vi.fn() }),
  };
});

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
  getPatchIdentitiesItemRolesMockHandler(),
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
  getGetIdentitiesItemRolesMockHandler(
    getGetIdentitiesItemRolesResponseMock({
      data: [
        { id: "role123", name: "role1" },
        { id: "role234", name: "role2" },
      ],
    }),
  ),
  getGetRolesMockHandler(
    getGetRolesResponseMock({
      data: [
        { id: "role123", name: "role1" },
        { id: "role234", name: "role2" },
        { id: "role345", name: "role3" },
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
  getPutIdentitiesItemMockHandler(),
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
  const invalidateQueries = vi.fn();
  vi.spyOn(reactQuery, "useQueryClient").mockReturnValue({
    invalidateQueries,
  } as unknown as reactQuery.QueryClient);
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
      onUserUpdate={vi.fn()}
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
  expect(invalidateQueries).toHaveBeenCalledWith({
    queryKey: ["/identities/user1/groups"],
  });
});

test("should handle errors when updating groups", async () => {
  mockApiServer.use(getPatchIdentitiesItemGroupsMockHandler400());
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditUserPanel
      user={mockUser}
      onUserUpdate={vi.fn()}
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
    await findNotificationByText(Label.GROUPS_ERROR, {
      appearance: "toast",
      severity: NotificationSeverity.NEGATIVE,
    }),
  ).toBeInTheDocument();
});

test("should add and remove roles", async () => {
  const invalidateQueries = vi.fn();
  vi.spyOn(reactQuery, "useQueryClient").mockReturnValue({
    invalidateQueries,
  } as unknown as reactQuery.QueryClient);
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user1/roles")
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
      onUserUpdate={vi.fn()}
      userId="user1"
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
  await userEvent.click(
    screen.getByRole("combobox", {
      name: RolesPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "role3",
    }),
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
      { role: "role345", op: "add" },
      { role: "role123", op: "remove" },
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
  expect(invalidateQueries).toHaveBeenCalledWith({
    queryKey: ["/identities/user1/roles"],
  });
});

test("should handle errors when updating roles", async () => {
  mockApiServer.use(getPatchIdentitiesItemRolesMockHandler400());
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditUserPanel
      user={mockUser}
      onUserUpdate={vi.fn()}
      userId="user1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
  );
  // Wait until the roles have loaded.
  await screen.findByText("2 roles");
  await userEvent.click(screen.getByRole("button", { name: /Edit roles/ }));
  await userEvent.click(
    screen.getByRole("combobox", {
      name: RolesPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "role3",
    }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Update local user" }),
  );
  expect(
    await findNotificationByText(Label.ROLES_ERROR, {
      appearance: "toast",
      severity: NotificationSeverity.NEGATIVE,
    }),
  ).toBeInTheDocument();
});

test("should add and remove entitlements", async () => {
  const invalidateQueries = vi.fn();
  vi.spyOn(reactQuery, "useQueryClient").mockReturnValue({
    invalidateQueries,
  } as unknown as reactQuery.QueryClient);
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
      onUserUpdate={vi.fn()}
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
  expect(invalidateQueries).toHaveBeenCalledWith({
    queryKey: ["/identities/user1/entitlements"],
  });
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
      onUserUpdate={vi.fn()}
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

test("should change user details", async () => {
  const mockUserUpdate = vi.fn();
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PUT" &&
      requestClone.url.endsWith("/identities/user1")
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
      onUserUpdate={mockUserUpdate}
      userId="user1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
  );
  const firstNameField = screen.getByRole("textbox", {
    name: UserPanelLabel.FIRST_NAME,
  });
  await userEvent.clear(firstNameField);
  await userEvent.type(firstNameField, "First Name modified");
  await userEvent.click(
    screen.getByRole("button", { name: "Update local user" }),
  );
  await waitFor(() => expect(patchDone).toBe(true));
  expect(patchResponseBody && JSON.parse(patchResponseBody)).toStrictEqual({
    addedBy: "within",
    email: "pfft@example.com",
    firstName: "First Name modified",
    id: "user1",
    lastName: "good",
    source: "noteworthy",
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
  expect(mockUserUpdate).toHaveBeenCalledTimes(1);
});

test("should handle errors when updating user details", async () => {
  const mockUserUpdate = vi.fn();
  mockApiServer.use(getPutIdentitiesItemMockHandler400());
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditUserPanel
      user={mockUser}
      onUserUpdate={mockUserUpdate}
      userId="user1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.FIRST_NAME }),
    "First",
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Update local user" }),
  );
  expect(
    await findNotificationByText(Label.USER_ERROR, {
      appearance: "toast",
      severity: NotificationSeverity.NEGATIVE,
    }),
  ).toBeInTheDocument();
  expect(mockUserUpdate).not.toHaveBeenCalled();
});
