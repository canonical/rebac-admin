import { NotificationSeverity } from "@canonical/react-components";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import type { Role } from "api/api.schemas";
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
  getGetRolesItemMockHandler400,
  getGetRolesItemResponseMock400,
} from "api/roles/roles.msw";
import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm/types";
import { hasToast, renderComponent, hasNotification } from "test/utils";

import EditRolePanel from "./EditRolePanel";

const mockApiServer = setupServer(
  getPatchRolesItemEntitlementsMockHandler(),
  getGetRolesItemEntitlementsMockHandler(
    getGetRolesItemEntitlementsResponseMock({
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
test("should handle errors when getting the role", async () => {
  mockApiServer.use(
    getGetRolesItemMockHandler400(
      getGetRolesItemResponseMock400({ message: "role not found" }),
    ),
  );
  renderComponent(
    <EditRolePanel roleId="admin123" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await hasNotification(
    "Unable to get role: role not found",
    NotificationSeverity.NEGATIVE,
  );
});

// eslint-disable-next-line vitest/expect-expect
test("should handle the role not in the response", async () => {
  mockApiServer.use(
    getGetRolesItemMockHandler(
      // Mimic something wrong with the response, that is not allowed by the type.
      null as unknown as Role,
    ),
  );
  renderComponent(
    <EditRolePanel roleId="admin123" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await hasNotification("Unable to get role", NotificationSeverity.NEGATIVE);
});

test("should add and remove entitlements", async () => {
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
  renderComponent(
    <EditRolePanel roleId="admin123" close={vi.fn()} setPanelWidth={vi.fn()} />,
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
    screen.getAllByRole("button", { name: "Edit role" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update role" }));
  await waitFor(() => expect(patchDone).toBe(true));
  expect(patchResponseBody).toBe(
    '{"patches":[{"entitlement":{"entity_type":"client","entitlement_type":"can_read","entity_name":"editors"},"op":"add"},{"entitlement":{"entitlement_type":"can_edit","entity_name":"moderators","entity_type":"collection"},"op":"remove"}]}',
  );
  await hasToast('Role "admin1" was updated.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when updating entitlements", async () => {
  mockApiServer.use(
    getGetRolesItemEntitlementsMockHandler(
      getGetRolesItemEntitlementsResponseMock({
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
    getPatchRolesItemEntitlementsMockHandler400(),
    getGetRolesItemEntitlementsMockHandler400(),
  );
  renderComponent(
    <EditRolePanel roleId="admin123" close={vi.fn()} setPanelWidth={vi.fn()} />,
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
    screen.getAllByRole("button", { name: "Edit role" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Update role" }));
  await hasToast(
    "Some entitlements couldn't be updated",
    NotificationSeverity.NEGATIVE,
  );
});
