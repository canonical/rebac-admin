import { NotificationSeverity } from "@canonical/react-components";
import { screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getPatchGroupsIdEntitlementsMockHandler,
  getPatchGroupsIdEntitlementsMockHandler400,
  getGetGroupsIdEntitlementsMockHandler,
  getGetGroupsIdEntitlementsResponseMock,
  getDeleteGroupsIdEntitlementsEntitlementIdMockHandler,
  getGetGroupsIdEntitlementsMockHandler400,
  getGetGroupsIdIdentitiesMockHandler,
  getGetGroupsIdIdentitiesResponseMock,
  getDeleteGroupsIdIdentitiesIdentityIdMockHandler,
  getPatchGroupsIdIdentitiesMockHandler,
  getPatchGroupsIdIdentitiesMockHandler400,
  getDeleteGroupsIdIdentitiesIdentityIdMockHandler400,
} from "api/groups-id/groups-id.msw";
import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm/types";
import { hasToast, renderComponent } from "test/utils";

import { Label as IdentitiesPanelFormLabel } from "../IdentitiesPanelForm/types";

import EditGroupPanel from "./EditGroupPanel";
import { Label } from "./types";

const mockApiServer = setupServer(
  getPatchGroupsIdEntitlementsMockHandler(),
  getDeleteGroupsIdEntitlementsEntitlementIdMockHandler(),
  getGetGroupsIdEntitlementsMockHandler(
    getGetGroupsIdEntitlementsResponseMock({
      data: ["can_edit::moderators:collection", "can_remove::staff:team"],
    }),
  ),
  getPatchGroupsIdIdentitiesMockHandler(),
  getDeleteGroupsIdIdentitiesIdentityIdMockHandler(),
  getGetGroupsIdIdentitiesMockHandler(
    getGetGroupsIdIdentitiesResponseMock({
      data: ["user1", "user2"],
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
  let patchResponseBody: string | null = null;
  let patchDone = false;
  let deleteDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/groups/admin/entitlements")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
    if (
      requestClone.method === "DELETE" &&
      requestClone.url.endsWith(
        "/groups/admin/entitlements/can_edit::moderators:collection",
      )
    ) {
      deleteDone = true;
    }
  });
  renderComponent(
    <EditGroupPanel groupId="admin" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the entitlements have loaded.
  await screen.findByText("2 entitlements");
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: /Edit entitlements/ }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", {
          name: EntitlementsPanelFormLabel.REMOVE,
        })[0],
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
        screen.getAllByRole("button", { name: "Edit group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Update group" }),
      ),
  );
  await waitFor(() => expect(patchDone && deleteDone).toBeTruthy());
  expect(patchResponseBody).toBe(
    '{"permissions":[{"object":"client:editors","relation":"can_read"}]}',
  );
  await hasToast('Group "admin" was updated.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when updating entitlements", async () => {
  mockApiServer.use(
    getGetGroupsIdEntitlementsMockHandler(
      getGetGroupsIdEntitlementsResponseMock({
        data: ["can_edit::moderators:collection", "can_remove::staff:team"],
      }),
    ),
    getPatchGroupsIdEntitlementsMockHandler400(),
    getGetGroupsIdEntitlementsMockHandler400(),
  );
  renderComponent(
    <EditGroupPanel groupId="admin" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the entitlements have loaded.
  await screen.findByText("2 entitlements");
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: /Edit entitlements/ }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", {
          name: EntitlementsPanelFormLabel.REMOVE,
        })[0],
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
        screen.getAllByRole("button", { name: "Edit group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Update group" }),
      ),
  );
  await hasToast(Label.ENTITLEMENTS_ERROR, NotificationSeverity.NEGATIVE);
});

test("should add and remove users", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  let deleteDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/groups/admin/identities")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
    if (
      requestClone.method === "DELETE" &&
      requestClone.url.endsWith("/groups/admin/identities/user1")
    ) {
      deleteDone = true;
    }
  });
  renderComponent(
    <EditGroupPanel groupId="admin" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the users have loaded.
  await screen.findByText("2 users");
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: /Edit users/ })),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", {
          name: IdentitiesPanelFormLabel.REMOVE,
        })[0],
      ),
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
        screen.getAllByRole("button", { name: "Edit group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Update group" }),
      ),
  );
  await waitFor(() => expect(patchDone && deleteDone).toBeTruthy());
  expect(patchResponseBody).toBe('{"identities":["joe"]}');
  await hasToast('Group "admin" was updated.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when updating users", async () => {
  mockApiServer.use(
    getPatchGroupsIdIdentitiesMockHandler400(),
    getDeleteGroupsIdIdentitiesIdentityIdMockHandler400(),
  );
  renderComponent(
    <EditGroupPanel groupId="admin" close={vi.fn()} setPanelWidth={vi.fn()} />,
  );
  // Wait until the users have loaded.
  await screen.findByText("2 users");
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: /Edit users/ })),
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
        screen.getAllByRole("button", { name: "Edit group" })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Update group" }),
      ),
  );
  await hasToast(Label.IDENTITIES_ERROR, NotificationSeverity.NEGATIVE);
});
