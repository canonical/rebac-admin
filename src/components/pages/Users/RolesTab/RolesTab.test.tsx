import { NotificationSeverity } from "@canonical/react-components";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, delay } from "msw";
import { setupServer } from "msw/node";

import {
  getPatchIdentitiesItemRolesMockHandler,
  getGetIdentitiesItemRolesMockHandler,
  getGetIdentitiesItemRolesResponseMock,
  getPatchIdentitiesItemRolesMockHandler400,
  getGetIdentitiesItemRolesMockHandler400,
} from "api/identities/identities.msw";
import {
  getGetRolesMockHandler,
  getGetRolesResponseMock,
} from "api/roles/roles.msw";
import { Label as RolesPanelFormLabel } from "components/RolesPanelForm";
import { hasNotification, hasSpinner, renderComponent } from "test/utils";
import { Endpoint } from "types/api";
import urls from "urls";

import RolesTab from "./RolesTab";
import { Label } from "./types";

const path = urls.users.user.roles(null);
const url = urls.users.user.roles({ id: "user1" });

const mockApiServer = setupServer(
  getPatchIdentitiesItemRolesMockHandler(),
  getGetIdentitiesItemRolesMockHandler(
    getGetIdentitiesItemRolesResponseMock({
      data: [
        { id: "role123", name: "role1" },
        { id: "role234", name: "role2" },
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
  mockApiServer.use(getGetIdentitiesItemRolesMockHandler400());
  renderComponent(<RolesTab />, {
    path,
    url,
  });
  await hasNotification(Label.FETCH_ERROR, NotificationSeverity.NEGATIVE);
});

// eslint-disable-next-line vitest/expect-expect
test("display loading spinner", async () => {
  mockApiServer.use(
    http.get(`*/${Endpoint.IDENTITIES}/*`, async () => {
      await delay(100);
    }),
  );
  renderComponent(<RolesTab />, {
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
  renderComponent(<RolesTab />, {
    path,
    url,
  });
  await userEvent.click(
    (
      await screen.findAllByRole("button", {
        name: RolesPanelFormLabel.REMOVE,
      })
    )[0],
  );
  await hasSpinner(undefined, false);
});

test("should add roles", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user1/roles")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  renderComponent(<RolesTab />, {
    path,
    url,
  });
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
  await waitFor(() => expect(patchDone).toBe(true));
  expect(patchResponseBody && JSON.parse(patchResponseBody)).toStrictEqual({
    patches: [
      {
        role: "role345",
        op: "add",
      },
    ],
  });
});

test("should remove roles", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user1/roles")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  renderComponent(<RolesTab />, {
    path,
    url,
  });
  await userEvent.click(
    (
      await screen.findAllByRole("button", {
        name: RolesPanelFormLabel.REMOVE,
      })
    )[0],
  );
  await waitFor(() => expect(patchDone).toBe(true));
  expect(patchResponseBody && JSON.parse(patchResponseBody)).toStrictEqual({
    patches: [
      {
        role: "role123",
        op: "remove",
      },
    ],
  });
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when updating roles", async () => {
  mockApiServer.use(
    getGetIdentitiesItemRolesMockHandler(
      getGetIdentitiesItemRolesResponseMock({
        data: ["can_edit::moderators:collection", "can_remove::staff:team"],
      }),
    ),
    getPatchIdentitiesItemRolesMockHandler400(),
    getGetIdentitiesItemRolesMockHandler400(),
  );
  renderComponent(<RolesTab />, {
    path,
    url,
  });
  await userEvent.click(
    (
      await screen.findAllByRole("button", {
        name: RolesPanelFormLabel.REMOVE,
      })
    )[0],
  );
  await hasNotification(Label.PATCH_ERROR, NotificationSeverity.NEGATIVE);
});
