import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getPostGroupsResponseMock,
  getPostGroupsMockHandler,
  getPostGroupsMockHandler400,
  getPostGroupsResponseMock400,
} from "api/groups/groups.msw";
import { getPatchGroupsIdEntitlementsMockHandler } from "api/groups-id/groups-id.msw";
import { hasNotification, hasToast, renderComponent } from "test/utils";

import { Label as GroupPanelLabel } from "../GroupPanel";

import AddGroupPanel from "./AddGroupPanel";

const mockGroupsData = getPostGroupsResponseMock();
const mockApiServer = setupServer(
  getPostGroupsMockHandler(mockGroupsData),
  getPatchGroupsIdEntitlementsMockHandler(),
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
test("should handle errors when adding groupss", async () => {
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
