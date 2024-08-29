import { NotificationSeverity } from "@canonical/react-components";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, delay } from "msw";
import { setupServer } from "msw/node";

import {
  getGetGroupsMockHandler,
  getGetGroupsResponseMock,
} from "api/groups/groups.msw";
import {
  getPatchIdentitiesItemGroupsMockHandler,
  getGetIdentitiesItemGroupsMockHandler,
  getGetIdentitiesItemGroupsResponseMock,
  getPatchIdentitiesItemGroupsMockHandler400,
  getGetIdentitiesItemGroupsMockHandler400,
} from "api/identities/identities.msw";
import { Label as GroupsPanelFormLabel } from "components/GroupsPanelForm";
import { mockGroup } from "mocks/groups";
import { hasNotification, hasSpinner, renderComponent } from "test/utils";
import { Endpoint } from "types/api";
import urls from "urls";

import GroupsTab from "./GroupsTab";
import { Label } from "./types";

const path = urls.users.user.groups(null);
const url = urls.users.user.groups({ id: "user1" });

const mockApiServer = setupServer(
  getPatchIdentitiesItemGroupsMockHandler(),
  getGetIdentitiesItemGroupsMockHandler(
    getGetIdentitiesItemGroupsResponseMock({
      data: [mockGroup({ id: "group123" }), mockGroup()],
    }),
  ),
  getGetGroupsMockHandler(
    getGetGroupsResponseMock({
      data: [
        mockGroup(),
        mockGroup(),
        mockGroup({ id: "group345", name: "group3" }),
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
  mockApiServer.use(getGetIdentitiesItemGroupsMockHandler400());
  renderComponent(<GroupsTab />, {
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
  renderComponent(<GroupsTab />, {
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
  renderComponent(<GroupsTab />, {
    path,
    url,
  });
  await userEvent.click(
    (
      await screen.findAllByRole("button", {
        name: GroupsPanelFormLabel.REMOVE,
      })
    )[0],
  );
  await hasSpinner(undefined, false);
});

test("should add groups", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user1/groups")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  renderComponent(<GroupsTab />, {
    path,
    url,
  });
  await userEvent.click(
    await screen.findByRole("combobox", {
      name: GroupsPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "group3",
    }),
  );
  await waitFor(() => expect(patchDone).toBe(true));
  expect(patchResponseBody && JSON.parse(patchResponseBody)).toStrictEqual({
    patches: [
      {
        group: "group345",
        op: "add",
      },
    ],
  });
});

test("should remove groups", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user1/groups")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  renderComponent(<GroupsTab />, {
    path,
    url,
  });
  await userEvent.click(
    (
      await screen.findAllByRole("button", {
        name: GroupsPanelFormLabel.REMOVE,
      })
    )[0],
  );
  await waitFor(() => expect(patchDone).toBe(true));
  expect(patchResponseBody && JSON.parse(patchResponseBody)).toStrictEqual({
    patches: [
      {
        group: "group123",
        op: "remove",
      },
    ],
  });
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when updating groups", async () => {
  mockApiServer.use(
    getGetIdentitiesItemGroupsMockHandler(
      getGetIdentitiesItemGroupsResponseMock({
        data: ["can_edit::moderators:collection", "can_remove::staff:team"],
      }),
    ),
    getPatchIdentitiesItemGroupsMockHandler400(),
    getGetIdentitiesItemGroupsMockHandler400(),
  );
  renderComponent(<GroupsTab />, {
    path,
    url,
  });
  await userEvent.click(
    (
      await screen.findAllByRole("button", {
        name: GroupsPanelFormLabel.REMOVE,
      })
    )[0],
  );
  await hasNotification(Label.PATCH_ERROR, NotificationSeverity.NEGATIVE);
});
