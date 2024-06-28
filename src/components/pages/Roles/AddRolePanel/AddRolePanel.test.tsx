import { NotificationSeverity } from "@canonical/react-components";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getPostRolesResponseMock,
  getPostRolesMockHandler,
  getPostRolesMockHandler400,
  getPostRolesResponseMock400,
  getPostRolesMockHandler200,
  getPostRolesResponseMock200,
  getPatchRolesItemEntitlementsMockHandler,
  getPatchRolesItemEntitlementsMockHandler400,
  getPatchRolesItemEntitlementsResponseMock400,
} from "api/roles/roles.msw";
import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm/types";
import { hasNotification, hasToast, renderComponent } from "test/utils";

import { Label as RolePanelLabel } from "../RolePanel";

import AddRolePanel from "./AddRolePanel";

const mockRolesData = getPostRolesResponseMock({
  id: "role123",
  name: "role1",
});
const mockApiServer = setupServer(
  getPostRolesMockHandler(mockRolesData),
  getPatchRolesItemEntitlementsMockHandler(),
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
test("should add a role", async () => {
  renderComponent(<AddRolePanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
    "role1{Enter}",
  );
  await hasToast('Role "role1" was created.', "positive");
});

test("should add a role and entitlements", async () => {
  let responseBody: string | null = null;
  let done = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/roles/role123/entitlements")
    ) {
      responseBody = await requestClone.text();
      done = true;
    }
  });
  renderComponent(<AddRolePanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
    "role1",
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
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
    screen.getAllByRole("button", { name: "Create role" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create role" }));
  await hasToast('Role "role1" was created.', "positive");
  await waitFor(() => expect(done).toBeTruthy());
  expect(responseBody).toBe(
    '{"patches":[{"entitlement":{"entity_type":"editors","entitlement_type":"can_read","entity_name":"client"},"op":"add"}]}',
  );
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding roles", async () => {
  mockApiServer.use(
    getPostRolesMockHandler400(
      getPostRolesResponseMock400({ message: "That role already exists" }),
    ),
  );
  renderComponent(<AddRolePanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
    "role1{Enter}",
  );
  await hasNotification(
    "Unable to create role: That role already exists",
    "negative",
  );
});

// eslint-disable-next-line vitest/expect-expect
test("handles the role not in the response", async () => {
  mockApiServer.use(
    getPostRolesMockHandler200(getPostRolesResponseMock200({ data: [] })),
  );
  renderComponent(<AddRolePanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
    "role1",
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
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
    screen.getAllByRole("button", { name: "Create role" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create role" }));
  await hasToast(
    'Entitlements couldn\'t be added to role "role1".',
    NotificationSeverity.NEGATIVE,
  );
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding entitlements", async () => {
  mockApiServer.use(
    getPostRolesMockHandler(mockRolesData),
    getPatchRolesItemEntitlementsMockHandler400(
      getPatchRolesItemEntitlementsResponseMock400({
        message: "No resource with that name found",
      }),
    ),
  );
  renderComponent(<AddRolePanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
    "role1",
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
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
    screen.getAllByRole("button", { name: "Create role" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create role" }));
  await hasToast(
    'Entitlements couldn\'t be added: "No resource with that name found".',
    NotificationSeverity.NEGATIVE,
  );
});
