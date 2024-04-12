import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getPostRolesResponseMock,
  getPostRolesMockHandler,
  getPostRolesMockHandler400,
  getPostRolesResponseMock400,
} from "api/roles/roles.msw";
import { hasNotification, hasToast, renderComponent } from "test/utils";

import { Label as RolePanelLabel } from "../RolePanel";

import AddRolePanel from "./AddRolePanel";

const mockRolesData = getPostRolesResponseMock({
  message: "Role was created!",
});
const mockApiServer = setupServer(getPostRolesMockHandler(mockRolesData));

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
test("should add a role", async () => {
  renderComponent(<AddRolePanel close={vi.fn()} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
        "role1{Enter}",
      ),
  );
  await hasToast("Role was created!", "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding roles", async () => {
  mockApiServer.use(
    getPostRolesMockHandler400(
      getPostRolesResponseMock400({ message: "That role already exists" }),
    ),
  );
  renderComponent(<AddRolePanel close={vi.fn()} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: RolePanelLabel.NAME }),
        "role1{Enter}",
      ),
  );
  await hasNotification(
    "Unable to create role: That role already exists",
    "negative",
  );
});
