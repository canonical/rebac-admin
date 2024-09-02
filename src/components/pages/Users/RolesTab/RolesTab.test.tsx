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
import { renderComponent } from "test/utils";
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

test("display fetch errors", async () => {
  mockApiServer.use(getGetIdentitiesItemRolesMockHandler400());
  const {
    result: { findNotificationByText },
  } = renderComponent(<RolesTab />, {
    path,
    url,
  });
  expect(await findNotificationByText(Label.FETCH_ERROR)).toBeInTheDocument();
});

test("display loading spinner", async () => {
  mockApiServer.use(
    http.get(`*/${Endpoint.IDENTITIES}/*`, async () => {
      await delay(100);
    }),
  );
  const {
    result: { findSpinnerByLabel },
  } = renderComponent(<RolesTab />, {
    path,
    url,
  });
  expect(await findSpinnerByLabel("Loading")).toBeInTheDocument();
});

test("does not display loading spinner when refetching", async () => {
  mockApiServer.use(
    http.get(`*/${Endpoint.IDENTITIES}/*`, async () => {
      await delay(100);
    }),
  );
  const {
    result: { findSpinnerByLabel },
  } = renderComponent(<RolesTab />, {
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
  // Check that the spinner doesn't exist using findBy* so that the component is
  // given time to rerender.
  await expect(findSpinnerByLabel("Loading")).rejects.toBeTruthy();
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
  const {
    result: { findNotificationByText },
  } = renderComponent(<RolesTab />, {
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
  expect(await findNotificationByText(Label.PATCH_ERROR)).toBeInTheDocument();
});
