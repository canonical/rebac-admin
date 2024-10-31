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
  getPostRolesResponseMock,
  getPostRolesMockHandler,
  getPostRolesMockHandler400,
  getPostRolesResponseMock400,
  getPostRolesMockHandler200,
  getPatchRolesItemEntitlementsMockHandler,
  getPatchRolesItemEntitlementsMockHandler400,
  getPatchRolesItemEntitlementsResponseMock400,
} from "api/roles/roles.msw";
import { EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { EntitlementPanelFormFieldsLabel } from "components/EntitlementsPanelForm/Fields";
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { renderComponent } from "test/utils";

import { FieldsLabel as RolePanelLabel } from "../RolePanel/Fields";

import AddRolePanel from "./AddRolePanel";

const mockRolesData = getPostRolesResponseMock({
  id: "role123",
  name: "role1",
});
const mockApiServer = setupServer(
  ...getGetActualCapabilitiesMock(),
  getPostRolesMockHandler(mockRolesData),
  getPatchRolesItemEntitlementsMockHandler(),
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

test("should add a role", async () => {
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddRolePanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
    "role1{Enter}",
  );
  expect(
    await findNotificationByText('Role "role1" was created.', {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
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
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddRolePanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
    "role1",
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
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
    screen.getAllByRole("button", { name: "Create role" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create role" }));
  expect(
    await findNotificationByText('Role "role1" was created.', {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
  await waitFor(() => expect(done).toBeTruthy());
  expect(responseBody).toBe(
    '{"patches":[{"entitlement":{"entity_type":"client","entitlement":"can_read","entity_id":"mock-entity-id"},"op":"add"}]}',
  );
});

test("should handle errors when adding roles", async () => {
  mockApiServer.use(
    getPostRolesMockHandler400(
      getPostRolesResponseMock400({ message: "That role already exists" }),
    ),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddRolePanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
    "role1{Enter}",
  );
  expect(
    await findNotificationByText(
      "Unable to create role: That role already exists",
    ),
  ).toBeInTheDocument();
});

test("handles the role not in the response", async () => {
  // Handle a role not returned by the API which is not a valid type.
  mockApiServer.use(getPostRolesMockHandler200(null as unknown as Role));
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddRolePanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
    "role1",
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
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
    screen.getAllByRole("button", { name: "Create role" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create role" }));
  expect(
    await findNotificationByText(
      'Entitlements couldn\'t be added to role "role1".',
      { appearance: "toast" },
    ),
  ).toBeInTheDocument();
});

test("should handle errors when adding entitlements", async () => {
  mockApiServer.use(
    getPostRolesMockHandler(mockRolesData),
    getPatchRolesItemEntitlementsMockHandler400(
      getPatchRolesItemEntitlementsResponseMock400({
        message: "No resource with that name found",
      }),
    ),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddRolePanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
    "role1",
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
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
    screen.getAllByRole("button", { name: "Create role" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create role" }));
  expect(
    await findNotificationByText(
      'Entitlements couldn\'t be added: "No resource with that name found".',
      { appearance: "toast" },
    ),
  ).toBeInTheDocument();
});
