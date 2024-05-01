import { NotificationSeverity } from "@canonical/react-components";
import { screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getPostRolesResponseMock,
  getPostRolesMockHandler,
  getPostRolesMockHandler400,
  getPostRolesResponseMock400,
} from "api/roles/roles.msw";
import {
  getPatchRolesIdEntitlementsMockHandler,
  getPatchRolesIdEntitlementsMockHandler400,
  getPatchRolesIdEntitlementsResponseMock400,
} from "api/roles-id/roles-id.msw";
import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm/types";
import { hasNotification, hasToast, renderComponent } from "test/utils";

import { Label as RolePanelLabel } from "../RolePanel";

import AddRolePanel from "./AddRolePanel";

const mockRolesData = getPostRolesResponseMock();
const mockApiServer = setupServer(
  getPostRolesMockHandler(mockRolesData),
  getPatchRolesIdEntitlementsMockHandler(),
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
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
        "role1{Enter}",
      ),
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
      requestClone.url.endsWith("/roles/role1/entitlements")
    ) {
      responseBody = await requestClone.text();
      done = true;
    }
  });
  renderComponent(<AddRolePanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
        "role1",
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: /Add entitlements/ }),
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
        screen.getAllByRole("button", { name: "Create role" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Create role" }),
      ),
  );
  await hasToast('Role "role1" was created.', "positive");
  await waitFor(() => expect(done).toBeTruthy());
  expect(responseBody).toBe(
    '{"permissions":[{"object":"client:editors","relation":"can_read"}]}',
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
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
        "role1{Enter}",
      ),
  );
  await hasNotification(
    "Unable to create role: That role already exists",
    "negative",
  );
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding entitlements", async () => {
  mockApiServer.use(
    getPostRolesMockHandler(mockRolesData),
    getPatchRolesIdEntitlementsMockHandler400(
      getPatchRolesIdEntitlementsResponseMock400({
        message: "No resource with that name found",
      }),
    ),
  );
  renderComponent(<AddRolePanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
        "role1",
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: /Add entitlements/ }),
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
        screen.getAllByRole("button", { name: "Create role" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Create role" }),
      ),
  );
  await hasToast(
    'Entitlements couldn\'t be added: "No resource with that name found".',
    NotificationSeverity.NEGATIVE,
  );
});
