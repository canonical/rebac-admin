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
  getPutGroupsItemMockHandler,
  getPutGroupsItemMockHandler400,
} from "api/groups/groups.msw";
import {
  getGetIdentitiesMockHandler,
  getGetIdentitiesResponseMock,
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
import { Label as RolesPanelFormLabel } from "components/RolesPanelForm";
import { Label as IdentitiesPanelFormLabel } from "components/pages/Groups/IdentitiesPanelForm/types";
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { renderComponent } from "test/utils";

import { FieldsLabel } from "../GroupPanel/Fields";

import EditGroupPanel from "./EditGroupPanel";
import { Label } from "./types";

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: vi.fn().mockReturnValue({ invalidateQueries: vi.fn() }),
  };
});

const mockApiServer = setupServer(
  ...getGetActualCapabilitiesMock(),
  // Needs to be before getGetIdentitiesMockHandler so that the path matches
  // `*/groups/:id/identities` before `*/identities`.
  getGetGroupsItemIdentitiesMockHandler(
    getGetGroupsItemIdentitiesResponseMock({
      data: [
        { id: "user1", email: "user1@example.com" },
        { id: "user2", email: "user2@example.com" },
      ],
    }),
  ),
  getGetIdentitiesMockHandler(
    getGetIdentitiesResponseMock({
      data: [
        { id: "user1", email: "user1@example.com" },
        { id: "user2", email: "user2@example.com" },
        { id: "user3", email: "user3@example.com" },
      ],
    }),
  ),
  // Needs to be before getGetRolesMockHandler so that the path matches this
  // handler first.
  getGetGroupsItemRolesMockHandler(
    getGetGroupsItemRolesResponseMock({
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
  getPatchGroupsItemEntitlementsMockHandler(),
  getGetGroupsItemEntitlementsMockHandler(
    getGetGroupsItemEntitlementsResponseMock({
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
  getPatchGroupsItemIdentitiesMockHandler(),
  getPatchGroupsItemRolesMockHandler(),
  getGetGroupsItemMockHandler(
    getGetGroupsItemResponseMock({ id: "admin1", name: "admin" }),
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
  getPutGroupsItemMockHandler(),
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
  const invalidateQueries = vi.fn();
  vi.spyOn(reactQuery, "useQueryClient").mockReturnValue({
    invalidateQueries,
  } as unknown as reactQuery.QueryClient);
  let patchResponseBody: null | string = null;
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
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditGroupPanel
      onGroupUpdated={vi.fn()}
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
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
  await userEvent.click(
    screen.getAllByRole("button", {
      name: EntitlementsPanelFormLabel.REMOVE,
    })[0],
  );
  await userEvent.selectOptions(
    await screen.findByRole("combobox", {
      name: EntitlementsPanelFormLabel.ENTITY,
    }),
    "client",
  );
  await screen.findByText(EntitlementPanelFormFieldsLabel.SELECT_RESOURCE);
  await userEvent.selectOptions(
    await screen.findByRole("combobox", {
      name: EntitlementsPanelFormLabel.RESOURCE,
    }),
    "editors",
  );
  await userEvent.selectOptions(
    await screen.findByRole("combobox", {
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
  await waitFor(() => {
    expect(patchDone).toBe(true);
  });
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
    await findNotificationByText('Group "admin" was updated.', {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
  expect(invalidateQueries).toHaveBeenCalledWith({
    queryKey: ["/groups/admin1/entitlements"],
  });
});

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
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditGroupPanel
      onGroupUpdated={vi.fn()}
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
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
  await userEvent.click(
    screen.getAllByRole("button", {
      name: EntitlementsPanelFormLabel.REMOVE,
    })[0],
  );
  await userEvent.selectOptions(
    await screen.findByRole("combobox", {
      name: EntitlementsPanelFormLabel.ENTITY,
    }),
    "client",
  );
  await screen.findByText(EntitlementPanelFormFieldsLabel.SELECT_RESOURCE);
  await userEvent.selectOptions(
    await screen.findByRole("combobox", {
      name: EntitlementsPanelFormLabel.RESOURCE,
    }),
    "editors",
  );
  await userEvent.selectOptions(
    await screen.findByRole("combobox", {
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
  expect(
    await findNotificationByText(Label.ENTITLEMENTS_ERROR, {
      appearance: "toast",
    }),
  ).toBeInTheDocument();
});

test("should add and remove users", async () => {
  const invalidateQueries = vi.fn();
  vi.spyOn(reactQuery, "useQueryClient").mockReturnValue({
    invalidateQueries,
  } as unknown as reactQuery.QueryClient);
  let patchResponseBody: null | string = null;
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
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditGroupPanel
      onGroupUpdated={vi.fn()}
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
  await userEvent.click(
    await screen.findByRole("combobox", {
      name: IdentitiesPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "user3@example.com",
    }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update group" }));
  await waitFor(() => {
    expect(patchDone).toBe(true);
  });
  expect(patchResponseBody && JSON.parse(patchResponseBody)).toStrictEqual({
    patches: [
      { identity: "user3", op: "add" },
      { identity: "user1", op: "remove" },
    ],
  });
  expect(
    await findNotificationByText('Group "admin" was updated.', {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
  expect(invalidateQueries).toHaveBeenCalledWith({
    queryKey: ["/groups/admin1/identities"],
  });
});

test("should handle errors when updating users", async () => {
  mockApiServer.use(getPatchGroupsItemIdentitiesMockHandler400());
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditGroupPanel
      onGroupUpdated={vi.fn()}
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
    await screen.findByRole("combobox", {
      name: IdentitiesPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "user2@example.com",
    }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update group" }));
  expect(
    await findNotificationByText(Label.IDENTITIES_ERROR, {
      appearance: "toast",
    }),
  ).toBeInTheDocument();
});

test("should add and remove roles", async () => {
  const invalidateQueries = vi.fn();
  vi.spyOn(reactQuery, "useQueryClient").mockReturnValue({
    invalidateQueries,
  } as unknown as reactQuery.QueryClient);
  let patchResponseBody: null | string = null;
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
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditGroupPanel
      onGroupUpdated={vi.fn()}
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
  await userEvent.click(
    await screen.findByRole("combobox", {
      name: RolesPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "role3",
    }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update group" }));
  await waitFor(() => {
    expect(patchDone).toBe(true);
  });
  expect(patchResponseBody && JSON.parse(patchResponseBody)).toStrictEqual({
    patches: [
      { role: "role345", op: "add" },
      { role: "role123", op: "remove" },
    ],
  });
  expect(
    await findNotificationByText('Group "admin" was updated.', {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
  expect(invalidateQueries).toHaveBeenCalledWith({
    queryKey: ["/groups/admin1/roles"],
  });
});

test("should handle errors when updating roles", async () => {
  mockApiServer.use(getPatchGroupsItemRolesMockHandler400());
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditGroupPanel
      onGroupUpdated={vi.fn()}
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
    await screen.findByRole("combobox", {
      name: RolesPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "role3",
    }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update group" }));
  expect(
    await findNotificationByText(Label.ROLES_ERROR, { appearance: "toast" }),
  ).toBeInTheDocument();
});

test("updates the role", async () => {
  const onGroupUpdated = vi.fn();
  let putResponseBody: null | string = null;
  let putDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PUT" &&
      requestClone.url.endsWith("/groups/admin1")
    ) {
      putResponseBody = await requestClone.text();
      putDone = true;
    }
  });
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditGroupPanel
      onGroupUpdated={onGroupUpdated}
      group={{ id: "admin1", name: "admin" }}
      groupId="admin1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
  );
  await userEvent.type(
    await screen.findByRole("textbox", {
      name: FieldsLabel.NAME,
    }),
    "changed",
  );
  await userEvent.click(screen.getByRole("button", { name: "Update group" }));
  await waitFor(() => {
    expect(putDone).toBe(true);
  });
  expect(putResponseBody && JSON.parse(putResponseBody)).toMatchObject({
    id: "admin1",
    name: "adminchanged",
  });
  expect(
    await findNotificationByText('Group "adminchanged" was updated.', {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
  expect(onGroupUpdated).toHaveBeenCalled();
});

test("handle errors when updating the role", async () => {
  mockApiServer.use(getPutGroupsItemMockHandler400());
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditGroupPanel
      onGroupUpdated={vi.fn()}
      group={{ id: "admin1", name: "admin" }}
      groupId="admin1"
      close={vi.fn()}
      setPanelWidth={vi.fn()}
    />,
  );
  await userEvent.type(
    await screen.findByRole("textbox", {
      name: FieldsLabel.NAME,
    }),
    "changed",
  );
  await userEvent.click(screen.getByRole("button", { name: "Update group" }));
  expect(
    await findNotificationByText(Label.GROUP_ERROR, {
      appearance: "toast",
    }),
  ).toBeInTheDocument();
});
