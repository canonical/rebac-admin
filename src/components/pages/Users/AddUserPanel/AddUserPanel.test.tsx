import { NotificationSeverity } from "@canonical/react-components";
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
  getPatchIdentitiesItemGroupsMockHandler,
  getPatchIdentitiesItemGroupsMockHandler400,
  getPatchIdentitiesItemRolesMockHandler,
  getPatchIdentitiesItemRolesMockHandler400,
  getPostIdentitiesMockHandler,
  getPostIdentitiesMockHandler400,
  getPostIdentitiesResponseMock,
  getPostIdentitiesResponseMock400,
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
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { mockGroup } from "test/mocks/groups";
import { renderComponent } from "test/utils";

import { UserPanelLabel } from "../UserPanel";

import AddUserPanel from "./AddUserPanel";
import { Label } from "./types";

const mockIdentitiesData = getPostIdentitiesResponseMock({
  id: "user123",
  email: "test@test.com",
});

const mockApiServer = setupServer(
  ...getGetActualCapabilitiesMock(),
  getPostIdentitiesMockHandler(mockIdentitiesData),
  getPatchIdentitiesItemGroupsMockHandler(),
  getPatchIdentitiesItemRolesMockHandler(),
  getPatchIdentitiesItemEntitlementsMockHandler(),
  getGetGroupsMockHandler(
    getGetGroupsResponseMock({
      data: [
        mockGroup({ id: "group1", name: "global" }),
        mockGroup({ id: "group2" }),
        mockGroup({ id: "group3" }),
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

test("should add a user", async () => {
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  expect(
    await findNotificationByText(
      'User with email "test@test.com" was created.',
      { appearance: "toast", severity: "positive" },
    ),
  ).toBeInTheDocument();
});

test("should handle errors when adding a user", async () => {
  mockApiServer.use(
    getPostIdentitiesMockHandler400(
      getPostIdentitiesResponseMock400({
        message: "That local user already exists",
      }),
    ),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  expect(
    await findNotificationByText(
      "Unable to create local user: That local user already exists",
    ),
  ).toBeInTheDocument();
});

test("should handle no identity id error when adding a user", async () => {
  mockApiServer.use(
    getPostIdentitiesMockHandler(
      getPostIdentitiesResponseMock({
        id: null,
        email: "test@test.com",
      }),
    ),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "mock@gmail.com{Enter}",
  );
  expect(
    await findNotificationByText(Label.IDENTITY_ID_ERROR, {
      appearance: "toast",
    }),
  ).toBeInTheDocument();
});

test("should add groups", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user123/groups")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  await userEvent.click(screen.getByRole("button", { name: /Add groups/ }));
  await userEvent.click(
    await screen.findByRole("combobox", {
      name: GroupsPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "global",
    }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Create local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Create local user" }),
  );
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe('{"patches":[{"group":"group1","op":"add"}]}');
  expect(
    await findNotificationByText(
      'User with email "test@test.com" was created.',
      { appearance: "toast", severity: NotificationSeverity.POSITIVE },
    ),
  ).toBeInTheDocument();
});

test("should handle errors when adding groups", async () => {
  mockApiServer.use(getPatchIdentitiesItemGroupsMockHandler400());
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  await userEvent.click(screen.getByRole("button", { name: /Add groups/ }));
  await userEvent.click(
    await screen.findByRole("combobox", {
      name: GroupsPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "global",
    }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Create local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Create local user" }),
  );
  expect(
    await findNotificationByText(Label.GROUPS_ERROR, { appearance: "toast" }),
  ).toBeInTheDocument();
});

test("should add roles", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user123/roles")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  await userEvent.click(screen.getByRole("button", { name: /Add roles/ }));
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
    screen.getAllByRole("button", { name: "Create local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Create local user" }),
  );
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe('{"patches":[{"role":"role345","op":"add"}]}');
  expect(
    await findNotificationByText(
      'User with email "test@test.com" was created.',
      { appearance: "toast", severity: NotificationSeverity.POSITIVE },
    ),
  ).toBeInTheDocument();
});

test("should handle errors when adding roles", async () => {
  mockApiServer.use(getPatchIdentitiesItemRolesMockHandler400());
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  await userEvent.click(screen.getByRole("button", { name: /Add roles/ }));
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
    screen.getAllByRole("button", { name: "Create local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Create local user" }),
  );
  expect(
    await findNotificationByText(Label.ROLES_ERROR, { appearance: "toast" }),
  ).toBeInTheDocument();
});

test("should add entitlements", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user123/entitlements")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
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
    screen.getAllByRole("button", { name: "Create local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Create local user" }),
  );
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe(
    '{"patches":[{"entitlement":{"entity_type":"client","entitlement":"can_read","entity_id":"mock-entity-id"},"op":"add"}]}',
  );
  expect(
    await findNotificationByText(
      'User with email "test@test.com" was created.',
      { appearance: "toast", severity: NotificationSeverity.POSITIVE },
    ),
  ).toBeInTheDocument();
});

test("should handle errors when adding entitlements", async () => {
  mockApiServer.use(getPatchIdentitiesItemEntitlementsMockHandler400());
  const {
    result: { findNotificationByText },
  } = renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
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
    screen.getAllByRole("button", { name: "Create local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Create local user" }),
  );
  expect(
    await findNotificationByText(Label.ENTITLEMENTS_ERROR, {
      appearance: "toast",
    }),
  ).toBeInTheDocument();
});
