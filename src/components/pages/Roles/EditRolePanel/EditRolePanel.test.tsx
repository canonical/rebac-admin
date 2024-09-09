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
} from "api/roles/roles.msw";
import { EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { EntitlementPanelFormFieldsLabel } from "components/EntitlementsPanelForm/Fields";
import { renderComponent } from "test/utils";

import EditRolePanel from "./EditRolePanel";

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: vi.fn().mockReturnValue({ invalidateQueries: vi.fn() }),
  };
});

const mockApiServer = setupServer(
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
  await waitFor(() => expect(patchDone).toBe(true));
  expect(patchResponseBody).toBe(
    '{"patches":[{"entitlement":{"entity_type":"client","entitlement":"can_read","entity_id":"mock-entity-id"},"op":"add"},{"entitlement":{"entitlement":"can_edit","entity_id":"moderators","entity_type":"collection"},"op":"remove"}]}',
  );
  expect(
    await findNotificationByText('Role "admin1" was updated.', {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
  expect(invalidateQueries).toHaveBeenCalledWith({
    queryKey: ["/roles/admin123/entitlements"],
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
    await findNotificationByText("Some entitlements couldn't be updated", {
      appearance: "toast",
    }),
  ).toBeInTheDocument();
});
