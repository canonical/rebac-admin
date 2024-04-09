import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getPostRolesResponseMock,
  getPostRolesMockHandler,
} from "api/roles/roles.msw";
import { renderComponent } from "test/utils";

import RolePanel from "./RolePanel";
import { Label } from "./types";

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

test("can submit the form", async () => {
  const onSubmit = vi.fn();
  renderComponent(<RolePanel close={vi.fn()} onSubmit={onSubmit} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: Label.NAME }),
        "role1{Enter}",
      ),
  );
  expect(onSubmit).toHaveBeenCalled();
});
