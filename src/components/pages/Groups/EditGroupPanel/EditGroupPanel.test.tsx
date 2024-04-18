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
} from "api/groups-id/groups-id.msw";
import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm/types";
import { hasToast, renderComponent } from "test/utils";

import EditGroupPanel from "./EditGroupPanel";

const mockApiServer = setupServer(
  getPatchGroupsIdEntitlementsMockHandler(),
  getDeleteGroupsIdEntitlementsEntitlementIdMockHandler(),
  getGetGroupsIdEntitlementsMockHandler(
    getGetGroupsIdEntitlementsResponseMock({
      data: ["can_edit::moderators:collection", "can_remove::staff:team"],
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
  renderComponent(<EditGroupPanel groupId="admin" close={vi.fn()} />);
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
  renderComponent(<EditGroupPanel groupId="admin" close={vi.fn()} />);
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
  await hasToast(
    "Some entitlements couldn't be updated",
    NotificationSeverity.NEGATIVE,
  );
});
