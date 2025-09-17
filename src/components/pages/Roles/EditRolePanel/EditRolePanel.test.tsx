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
  getGetResourcesMockHandler,
  getGetResourcesResponseMock,
} from "api/resources/resources.msw";
import {
  getPatchRolesItemEntitlementsMockHandler,
  getPatchRolesItemEntitlementsMockHandler400,
  getGetRolesItemEntitlementsMockHandler,
  getGetRolesItemEntitlementsResponseMock,
  getGetRolesItemEntitlementsMockHandler400,
  getGetRolesItemMockHandler,
  getGetRolesItemResponseMock,
  getPutRolesItemMockHandler,
  getPutRolesItemMockHandler400,
} from "api/roles/roles.msw";
import { EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { EntitlementPanelFormFieldsLabel } from "components/EntitlementsPanelForm/Fields";
import { FieldsLabel } from "components/pages/Roles/RolePanel/Fields";
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { renderComponent } from "test/utils";

import EditRolePanel from "./EditRolePanel";
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
  getPutRolesItemMockHandler(),
  getPatchRolesItemEntitlementsMockHandler(),
  getGetRolesItemEntitlementsMockHandler(
    getGetRolesItemEntitlementsResponseMock({
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
  getGetRolesItemMockHandler(
    getGetRolesItemResponseMock({
      id: "admin123",
      name: "admin1",
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

test("updates the role", async () => {
  const onRoleUpdated = vi.fn();
  let putResponseBody: null | string = null;
  let putDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PUT" &&
      requestClone.url.endsWith("/roles/admin123")
    ) {
      putResponseBody = await requestClone.text();
      putDone = true;
    }
  });
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditRolePanel
      onRoleUpdated={onRoleUpdated}
      role={{
        id: "admin123",
        name: "admin1",
      }}
      roleId="admin123"
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
  await userEvent.click(screen.getByRole("button", { name: "Update role" }));
  await waitFor(() => {
    expect(putDone).toBe(true);
  });
  expect(putResponseBody && JSON.parse(putResponseBody)).toMatchObject({
    id: "admin123",
    name: "admin1changed",
  });
  expect(
    await findNotificationByText('Role "admin1changed" was updated.', {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
  expect(onRoleUpdated).toHaveBeenCalled();
});

test("handle errors when updating the role", async () => {
  mockApiServer.use(getPutRolesItemMockHandler400());
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditRolePanel
      onRoleUpdated={vi.fn()}
      role={{
        id: "admin123",
        name: "admin1",
      }}
      roleId="admin123"
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
  await userEvent.click(screen.getByRole("button", { name: "Update role" }));
  expect(
    await findNotificationByText(Label.ERROR_ROLE, {
      appearance: "toast",
    }),
  ).toBeInTheDocument();
});

test("should not call onRoleUpdated if the role wasn't changed", async () => {
  const onRoleUpdated = vi.fn();
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/roles/admin123/entitlements")
    ) {
      patchDone = true;
    }
  });
  renderComponent(
    <EditRolePanel
      onRoleUpdated={onRoleUpdated}
      role={{
        id: "admin123",
        name: "admin1",
      }}
      roleId="admin123"
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
  await userEvent.click(
    screen.getByRole("button", { name: EntitlementsPanelFormLabel.SUBMIT }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Edit role" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update role" }));
  await waitFor(() => {
    expect(patchDone).toBe(true);
  });
  expect(onRoleUpdated).not.toHaveBeenCalled();
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
      requestClone.url.endsWith("/roles/admin123/entitlements")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditRolePanel
      onRoleUpdated={vi.fn()}
      role={{
        id: "admin123",
        name: "admin1",
      }}
      roleId="admin123"
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
    screen.getAllByRole("button", { name: "Edit role" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update role" }));
  await waitFor(() => {
    expect(patchDone).toBe(true);
  });
  expect(patchResponseBody).toBe(
    '{"patches":[{"entitlement":{"entity_type":"client","entitlement":"can_read","entity_id":"mock-entity-id"},"op":"add"},{"entitlement":{"entitlement":"can_edit","entity_id":"moderators","entity_type":"collection"},"op":"remove"}]}',
  );
  expect(
    await findNotificationByText('Role "admin1" was updated.', {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
  await waitFor(() => {
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["/roles/admin123/entitlements"],
    });
  });
});

test("should handle errors when updating entitlements", async () => {
  mockApiServer.use(
    getGetRolesItemEntitlementsMockHandler(
      getGetRolesItemEntitlementsResponseMock({
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
    getPatchRolesItemEntitlementsMockHandler400(),
    getGetRolesItemEntitlementsMockHandler400(),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EditRolePanel
      onRoleUpdated={vi.fn()}
      role={{
        id: "admin123",
        name: "admin1",
      }}
      roleId="admin123"
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
    screen.getAllByRole("button", { name: "Edit role" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update role" }));
  expect(
    await findNotificationByText(Label.ERROR_ENTITLEMENTS, {
      appearance: "toast",
    }),
  ).toBeInTheDocument();
});
