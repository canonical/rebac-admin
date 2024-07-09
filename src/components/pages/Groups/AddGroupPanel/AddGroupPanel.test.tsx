import { NotificationSeverity } from "@canonical/react-components";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

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
import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm/types";
import { hasNotification, hasToast, renderComponent } from "test/utils";

import { GroupPanelLabel } from "../GroupPanel";
import { Label as IdentitiesPanelFormLabel } from "../IdentitiesPanelForm/types";
import { Label as RolesPanelFormLabel } from "../RolesPanelForm/types";

import AddGroupPanel from "./AddGroupPanel";
import { Label } from "./types";

const mockGroupsData = getPostGroupsResponseMock({
  id: "group123",
  name: "group1",
});
const mockApiServer = setupServer(
  getPostGroupsMockHandler(mockGroupsData),
  getPatchGroupsItemEntitlementsMockHandler(),
  getPatchGroupsItemIdentitiesMockHandler(),
  getPatchGroupsItemRolesMockHandler(),
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
test("should add a group", async () => {
  renderComponent(<AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1{Enter}",
  );
  await hasToast('Group "group1" was created.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding groups", async () => {
  mockApiServer.use(
    getPostGroupsMockHandler400(
      getPostGroupsResponseMock400({ message: "That group already exists" }),
    ),
  );
  renderComponent(<AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1{Enter}",
  );
  await hasNotification(
    "Unable to create group: That group already exists",
    "negative",
  );
});

// eslint-disable-next-line vitest/expect-expect
test("should handle no id in the group response", async () => {
  mockApiServer.use(
    getPostGroupsMockHandler(
      getPostGroupsResponseMock({
        id: null,
        name: "group1",
      }),
    ),
  );
  renderComponent(<AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1{Enter}",
  );
  await hasToast(Label.GROUP_ID_ERROR, NotificationSeverity.NEGATIVE);
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
  renderComponent(<AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1",
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
    screen.getAllByRole("button", { name: "Create group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create group" }));
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe(
    '{"patches":[{"entitlement":{"entity_type":"editors","entitlement_type":"can_read","entity_name":"client"},"op":"add"}]}',
  );
  await hasToast('Group "group1" was created.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding entitlements", async () => {
  mockApiServer.use(
    getPostGroupsMockHandler(mockGroupsData),
    getPatchGroupsItemEntitlementsMockHandler400(),
  );
  renderComponent(<AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1",
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
    screen.getAllByRole("button", { name: "Create group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create group" }));
  await hasToast(Label.ENTITLEMENTS_ERROR, NotificationSeverity.NEGATIVE);
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
  renderComponent(<AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1",
  );
  await userEvent.click(screen.getByRole("button", { name: /Add users/ }));
  await userEvent.type(
    screen.getByRole("textbox", {
      name: IdentitiesPanelFormLabel.USER,
    }),
    "joe",
  );
  await userEvent.click(
    screen.getByRole("button", { name: IdentitiesPanelFormLabel.SUBMIT }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Create group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create group" }));
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe('{"patches":[{"identity":"joe","op":"add"}]}');
  await hasToast('Group "group1" was created.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding users", async () => {
  mockApiServer.use(
    getPostGroupsMockHandler(mockGroupsData),
    getPatchGroupsItemEntitlementsMockHandler(),
    getPatchGroupsItemIdentitiesMockHandler400(),
  );
  renderComponent(<AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1",
  );
  await userEvent.click(screen.getByRole("button", { name: /Add users/ }));
  await userEvent.type(
    screen.getByRole("textbox", {
      name: IdentitiesPanelFormLabel.USER,
    }),
    "joe",
  );
  await userEvent.click(
    screen.getByRole("button", { name: IdentitiesPanelFormLabel.SUBMIT }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Create group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create group" }));
  await hasToast(Label.IDENTITIES_ERROR, NotificationSeverity.NEGATIVE);
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
  renderComponent(<AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1",
  );
  await userEvent.click(screen.getByRole("button", { name: /Add roles/ }));
  await userEvent.type(
    screen.getByRole("textbox", {
      name: RolesPanelFormLabel.ROLE,
    }),
    "admin",
  );
  await userEvent.click(
    screen.getByRole("button", { name: RolesPanelFormLabel.SUBMIT }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Create group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create group" }));
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe('{"patches":[{"role":"admin","op":"add"}]}');
  await hasToast('Group "group1" was created.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding roles", async () => {
  mockApiServer.use(
    getPostGroupsMockHandler(mockGroupsData),
    getPatchGroupsItemEntitlementsMockHandler(),
    getPatchGroupsItemRolesMockHandler400(),
  );
  renderComponent(<AddGroupPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
    "group1",
  );
  await userEvent.click(screen.getByRole("button", { name: /Add roles/ }));
  await userEvent.type(
    screen.getByRole("textbox", {
      name: RolesPanelFormLabel.ROLE,
    }),
    "admin",
  );
  await userEvent.click(
    screen.getByRole("button", { name: RolesPanelFormLabel.SUBMIT }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Create group" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Create group" }));
  await hasToast(Label.ROLES_ERROR, NotificationSeverity.NEGATIVE);
});
