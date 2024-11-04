import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getGetEntitlementsMockHandler,
  getGetEntitlementsResponseMock,
} from "api/entitlements/entitlements.msw";
import {
  getPostGroupsResponseMock,
  getPostGroupsMockHandler,
  getPostGroupsMockHandler400,
  getPostGroupsResponseMock400,
  getPatchGroupsItemEntitlementsMockHandler,
  getPatchGroupsItemEntitlementsMockHandler400,
  getPatchGroupsItemIdentitiesMockHandler,
  getPatchGroupsItemIdentitiesMockHandler400,
  getPatchGroupsItemRolesMockHandler,
  getPatchGroupsItemRolesMockHandler400,
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
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { renderComponent } from "test/utils";

import { FieldsLabel as GroupPanelLabel } from "../GroupPanel/Fields";
import { Label as IdentitiesPanelFormLabel } from "../IdentitiesPanelForm/types";

import AddGroupPanel from "./AddGroupPanel";
import { Label } from "./types";

const mockGroupsData = getPostGroupsResponseMock({
  id: "group123",
  name: "group1",
});
const mockApiServer = setupServer(
  ...getGetActualCapabilitiesMock(),
  getGetIdentitiesMockHandler(
    getGetIdentitiesResponseMock({
      data: [
        { id: "user1", email: "user1@example.com" },
        { id: "user2", email: "user2@example.com" },
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
  getPostGroupsMockHandler(mockGroupsData),
  getPatchGroupsItemEntitlementsMockHandler(),
  getPatchGroupsItemIdentitiesMockHandler(),
  getPatchGroupsItemRolesMockHandler(),
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

test("should add a group", async () => {
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await userEvent.type(
    await screen.findByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1{Enter}",
  );
  expect(
    await findNotificationByText('Group "group1" was created.', {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
});

test("should handle errors when adding groups", async () => {
  mockApiServer.use(
    getPostGroupsMockHandler400(
      getPostGroupsResponseMock400({ message: "That group already exists" }),
    ),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await userEvent.type(
    await screen.findByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1{Enter}",
  );
  expect(
    await findNotificationByText(
      "Unable to create group: That group already exists",
    ),
  ).toBeInTheDocument();
});

test("should handle no id in the group response", async () => {
  mockApiServer.use(
    getPostGroupsMockHandler(
      getPostGroupsResponseMock({
        id: null,
        name: "group1",
      }),
    ),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await userEvent.type(
    await screen.findByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1{Enter}",
  );
  expect(
    await findNotificationByText(Label.GROUP_ID_ERROR, { appearance: "toast" }),
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
      requestClone.url.endsWith("/groups/group123/entitlements")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await userEvent.type(
    await screen.findByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1",
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
    screen.getAllByRole("button", { name: "Create group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create group" }));
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe(
    '{"patches":[{"entitlement":{"entity_type":"client","entitlement":"can_read","entity_id":"mock-entity-id"},"op":"add"}]}',
  );
  expect(
    await findNotificationByText('Group "group1" was created.', {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
});

test("should handle errors when adding entitlements", async () => {
  mockApiServer.use(
    getPostGroupsMockHandler(mockGroupsData),
    getPatchGroupsItemEntitlementsMockHandler400(),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await userEvent.type(
    await screen.findByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1",
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
    screen.getAllByRole("button", { name: "Create group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create group" }));
  expect(
    await findNotificationByText(Label.ENTITLEMENTS_ERROR, {
      appearance: "toast",
    }),
  ).toBeInTheDocument();
});

test("should add users", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/groups/group123/identities")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await userEvent.type(
    await screen.findByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1",
  );
  await userEvent.click(screen.getByRole("button", { name: /Add users/ }));
  await userEvent.click(
    screen.getByRole("combobox", {
      name: IdentitiesPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "user2@example.com",
    }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Create group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create group" }));
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe(
    '{"patches":[{"identity":"user2","op":"add"}]}',
  );
  expect(
    await findNotificationByText('Group "group1" was created.', {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
});

test("should handle errors when adding users", async () => {
  mockApiServer.use(
    getPostGroupsMockHandler(mockGroupsData),
    getPatchGroupsItemEntitlementsMockHandler(),
    getPatchGroupsItemIdentitiesMockHandler400(),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await userEvent.type(
    await screen.findByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1",
  );
  await userEvent.click(screen.getByRole("button", { name: /Add users/ }));
  await userEvent.click(
    screen.getByRole("combobox", {
      name: IdentitiesPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "user2@example.com",
    }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Create group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create group" }));
  expect(
    await findNotificationByText(Label.IDENTITIES_ERROR, {
      appearance: "toast",
    }),
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
      requestClone.url.endsWith("/groups/group123/roles")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await userEvent.type(
    await screen.findByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1",
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
    screen.getAllByRole("button", { name: "Create group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create group" }));
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe('{"patches":[{"role":"role345","op":"add"}]}');
  expect(
    await findNotificationByText('Group "group1" was created.', {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
});

test("should handle errors when adding roles", async () => {
  mockApiServer.use(
    getPostGroupsMockHandler(mockGroupsData),
    getPatchGroupsItemEntitlementsMockHandler(),
    getPatchGroupsItemRolesMockHandler400(),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  await userEvent.type(
    await screen.findByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1",
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
    screen.getAllByRole("button", { name: "Create group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create group" }));
  expect(
    await findNotificationByText(Label.ROLES_ERROR, { appearance: "toast" }),
  ).toBeInTheDocument();
});
