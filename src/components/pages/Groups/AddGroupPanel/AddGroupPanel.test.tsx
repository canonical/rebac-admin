import { NotificationSeverity } from "@canonical/react-components";
import { screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getPostGroupsResponseMock,
  getPostGroupsMockHandler,
  getPostGroupsMockHandler400,
  getPostGroupsResponseMock400,
} from "api/groups/groups.msw";
import {
  getPatchGroupsIdEntitlementsMockHandler,
  getPatchGroupsIdEntitlementsMockHandler400,
  getPatchGroupsIdIdentitiesMockHandler,
  getPatchGroupsIdIdentitiesMockHandler400,
  getPostGroupsIdRolesMockHandler,
  getPostGroupsIdRolesMockHandler400,
} from "api/groups-id/groups-id.msw";
import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm/types";
import { hasNotification, hasToast, renderComponent } from "test/utils";

import { Label as GroupPanelLabel } from "../GroupPanel";
import { Label as IdentitiesPanelFormLabel } from "../IdentitiesPanelForm/types";
import { Label as RolesPanelFormLabel } from "../RolesPanelForm/types";

import AddGroupPanel from "./AddGroupPanel";
import { Label } from "./types";

const mockGroupsData = getPostGroupsResponseMock();
const mockApiServer = setupServer(
  getPostGroupsMockHandler(mockGroupsData),
  getPatchGroupsIdEntitlementsMockHandler(),
  getPatchGroupsIdIdentitiesMockHandler(),
  getPostGroupsIdRolesMockHandler(),
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
  renderComponent(<AddGroupPanel close={vi.fn()} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
        "group1{Enter}",
      ),
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
  renderComponent(<AddGroupPanel close={vi.fn()} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
        "group1{Enter}",
      ),
  );
  await hasNotification(
    "Unable to create group: That group already exists",
    "negative",
  );
});

test("should add entitlements", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/groups/group1/entitlements")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  renderComponent(<AddGroupPanel close={vi.fn()} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
        "group1",
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
        screen.getAllByRole("button", { name: "Create group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Create group" }),
      ),
  );
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe(
    '{"permissions":[{"object":"client:editors","relation":"can_read"}]}',
  );
  await hasToast('Group "group1" was created.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding entitlements", async () => {
  mockApiServer.use(
    getPostGroupsMockHandler(mockGroupsData),
    getPatchGroupsIdEntitlementsMockHandler400(),
  );
  renderComponent(<AddGroupPanel close={vi.fn()} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
        "group1",
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
        screen.getAllByRole("button", { name: "Create group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Create group" }),
      ),
  );
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
      requestClone.url.endsWith("/groups/group1/identities")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  renderComponent(<AddGroupPanel close={vi.fn()} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
        "group1",
      ),
  );
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: /Add users/ })),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: IdentitiesPanelFormLabel.USER,
        }),
        "joe",
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: IdentitiesPanelFormLabel.SUBMIT }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: "Create group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Create group" }),
      ),
  );
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe('{"identities":["joe"]}');
  await hasToast('Group "group1" was created.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding users", async () => {
  mockApiServer.use(
    getPostGroupsMockHandler(mockGroupsData),
    getPatchGroupsIdEntitlementsMockHandler(),
    getPatchGroupsIdIdentitiesMockHandler400(),
  );
  renderComponent(<AddGroupPanel close={vi.fn()} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
        "group1",
      ),
  );
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: /Add users/ })),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: IdentitiesPanelFormLabel.USER,
        }),
        "joe",
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: IdentitiesPanelFormLabel.SUBMIT }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: "Create group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Create group" }),
      ),
  );
  await hasToast(Label.IDENTITIES_ERROR, NotificationSeverity.NEGATIVE);
});

test("should add roles", async () => {
  let postResponseBody: string | null = null;
  let postDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "POST" &&
      requestClone.url.endsWith("/groups/group1/roles")
    ) {
      postResponseBody = await requestClone.text();
      postDone = true;
    }
  });
  renderComponent(<AddGroupPanel close={vi.fn()} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
        "group1",
      ),
  );
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: /Add roles/ })),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: RolesPanelFormLabel.ROLE,
        }),
        "admin",
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: RolesPanelFormLabel.SUBMIT }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: "Create group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Create group" }),
      ),
  );
  await waitFor(() => expect(postDone).toBeTruthy());
  expect(postResponseBody).toBe('{"roles":["admin"]}');
  await hasToast('Group "group1" was created.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding roles", async () => {
  mockApiServer.use(
    getPostGroupsMockHandler(mockGroupsData),
    getPatchGroupsIdEntitlementsMockHandler(),
    getPostGroupsIdRolesMockHandler400(),
  );
  renderComponent(<AddGroupPanel close={vi.fn()} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: GroupPanelLabel.NAME }),
        "group1",
      ),
  );
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: /Add roles/ })),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", {
          name: RolesPanelFormLabel.ROLE,
        }),
        "admin",
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: RolesPanelFormLabel.SUBMIT }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: "Create group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Create group" }),
      ),
  );
  await hasToast(Label.ROLES_ERROR, NotificationSeverity.NEGATIVE);
});
