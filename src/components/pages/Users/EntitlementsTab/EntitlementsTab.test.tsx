import { NotificationSeverity } from "@canonical/react-components";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, delay } from "msw";
import { setupServer } from "msw/node";

import {
  getGetEntitlementsMockHandler,
  getGetEntitlementsResponseMock,
} from "api/entitlements/entitlements.msw";
import {
  getPatchIdentitiesItemEntitlementsMockHandler,
  getGetIdentitiesItemEntitlementsMockHandler,
  getGetIdentitiesItemEntitlementsResponseMock,
  getPatchIdentitiesItemEntitlementsMockHandler400,
  getGetIdentitiesItemEntitlementsMockHandler400,
} from "api/identities/identities.msw";
import {
  getGetResourcesMockHandler,
  getGetResourcesResponseMock,
} from "api/resources/resources.msw";
import { EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { EntitlementPanelFormFieldsLabel } from "components/EntitlementsPanelForm/Fields";
import { mockEntityEntitlement } from "mocks/entitlements";
import { mockEntity, mockResource } from "mocks/resources";
import { hasNotification, hasSpinner, renderComponent } from "test/utils";
import { Endpoint } from "types/api";
import urls from "urls";

import EntitlementsTab from "./EntitlementsTab";
import { Label } from "./types";

const path = urls.users.user.entitlements(null);
const url = urls.users.user.entitlements({ id: "user1" });

const mockApiServer = setupServer(
  getGetEntitlementsMockHandler(
    getGetEntitlementsResponseMock({
      data: [
        mockEntityEntitlement({
          entitlement: "can_read",
          entity_id: "editors",
          entity_type: "client",
        }),
      ],
    }),
  ),
  getPatchIdentitiesItemEntitlementsMockHandler(),
  getGetIdentitiesItemEntitlementsMockHandler(),
  getGetResourcesMockHandler(
    getGetResourcesResponseMock({
      data: [
        mockResource({
          entity: mockEntity({
            id: "mock-entity-id",
            name: "editors",
          }),
        }),
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
test("display fetch errors", async () => {
  mockApiServer.use(getGetIdentitiesItemEntitlementsMockHandler400());
  renderComponent(<EntitlementsTab />, {
    path,
    url,
  });
  await hasNotification(
    Label.FETCH_ENTITLEMENTS_ERROR,
    NotificationSeverity.NEGATIVE,
  );
});

// eslint-disable-next-line vitest/expect-expect
test("display loading spinner", async () => {
  mockApiServer.use(
    http.get(`*/${Endpoint.IDENTITIES}/*`, async () => {
      await delay(100);
    }),
  );
  renderComponent(<EntitlementsTab />, {
    path,
    url,
  });
  await hasSpinner();
});

// eslint-disable-next-line vitest/expect-expect
test("does not display loading spinner when refetching", async () => {
  mockApiServer.use(
    http.get(`*/${Endpoint.IDENTITIES}/*`, async () => {
      await delay(100);
    }),
  );
  renderComponent(<EntitlementsTab />, {
    path,
    url,
  });
  await userEvent.click(
    (
      await screen.findAllByRole("button", {
        name: EntitlementsPanelFormLabel.REMOVE,
      })
    )[0],
  );
  await hasSpinner(undefined, false);
});

test("should add entitlements", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user1/entitlements")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  renderComponent(<EntitlementsTab />, {
    path,
    url,
  });
  await userEvent.selectOptions(
    await screen.findByRole("combobox", {
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
  await waitFor(() => expect(patchDone).toBe(true));
  expect(patchResponseBody).toStrictEqual(
    '{"patches":[{"entitlement":{"entity_type":"client","entitlement":"can_read","entity_id":"mock-entity-id"},"op":"add"}]}',
  );
});

test("should remove entitlements", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user1/entitlements")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  renderComponent(<EntitlementsTab />, {
    path,
    url,
  });
  await userEvent.click(
    (
      await screen.findAllByRole("button", {
        name: EntitlementsPanelFormLabel.REMOVE,
      })
    )[0],
  );
  await waitFor(() => expect(patchDone).toBe(true));
  expect(patchResponseBody).toStrictEqual(
    '{"patches":[{"entitlement":{"entitlement":"can_read","entity_id":"editors","entity_type":"client"},"op":"remove"}]}',
  );
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when updating entitlements", async () => {
  mockApiServer.use(
    getGetIdentitiesItemEntitlementsMockHandler(
      getGetIdentitiesItemEntitlementsResponseMock({
        data: ["can_edit::moderators:collection", "can_remove::staff:team"],
      }),
    ),
    getPatchIdentitiesItemEntitlementsMockHandler400(),
    getGetIdentitiesItemEntitlementsMockHandler400(),
  );
  renderComponent(<EntitlementsTab />, {
    path,
    url,
  });
  await userEvent.click(
    (
      await screen.findAllByRole("button", {
        name: EntitlementsPanelFormLabel.REMOVE,
      })
    )[0],
  );
  await hasNotification(
    Label.PATCH_ENTITLEMENTS_ERROR,
    NotificationSeverity.NEGATIVE,
  );
});
