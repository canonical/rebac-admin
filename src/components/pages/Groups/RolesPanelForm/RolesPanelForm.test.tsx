import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getGetRolesMockHandler,
  getGetRolesResponseMock,
} from "api/roles/roles.msw";
import { hasNotification, renderComponent } from "test/utils";

import RolesPanelForm from "./RolesPanelForm";
import { Label } from "./types";

const mockApiServer = setupServer(
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

test("can add roles", async () => {
  const setAddRoles = vi.fn();
  renderComponent(
    <RolesPanelForm
      addRoles={[{ id: "1", name: "viewer" }]}
      setAddRoles={setAddRoles}
      removeRoles={[]}
      setRemoveRoles={vi.fn()}
    />,
  );
  // Wait for the options to load.
  await screen.findByRole("option", {
    name: "role3",
  });
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: Label.ROLE }),
    "role3",
  );
  await userEvent.click(screen.getByRole("button", { name: Label.SUBMIT }));
  expect(setAddRoles).toHaveBeenCalledWith([
    { id: "1", name: "viewer" },
    { id: "role345", name: "role3" },
  ]);
});

test("can display roles", async () => {
  const addRoles = [{ name: "viewer" }, { name: "devops" }];
  const existingRoles = [{ name: "existing1" }, { name: "existing2" }];
  renderComponent(
    <RolesPanelForm
      addRoles={addRoles}
      existingRoles={existingRoles}
      setAddRoles={vi.fn()}
      removeRoles={[]}
      setRemoveRoles={vi.fn()}
    />,
  );
  expect(
    screen.getByRole("row", {
      name: new RegExp(addRoles[0].name),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: new RegExp(addRoles[1].name),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /existing1/,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /existing2/,
    }),
  ).toBeInTheDocument();
});

test("does not display removed roles from the API", async () => {
  const removeRoles = [{ name: "existing1" }];
  const existingRoles = [{ name: "existing1" }, { name: "existing2" }];
  renderComponent(
    <RolesPanelForm
      addRoles={[]}
      existingRoles={existingRoles}
      setAddRoles={vi.fn()}
      removeRoles={removeRoles}
      setRemoveRoles={vi.fn()}
    />,
  );
  expect(
    screen.queryByRole("row", {
      name: /existing1/,
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /existing2/,
    }),
  ).toBeInTheDocument();
});

test("can remove newly added roles", async () => {
  const roles = [{ name: "devops" }, { name: "viewer" }];
  const setAddRoles = vi.fn();
  renderComponent(
    <RolesPanelForm
      addRoles={roles}
      setAddRoles={setAddRoles}
      removeRoles={[]}
      setRemoveRoles={vi.fn()}
    />,
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: Label.REMOVE })[1],
  );
  expect(setAddRoles).toHaveBeenCalledWith([{ name: "devops" }]);
});

test("can remove roles from the API", async () => {
  const existingRoles = [{ name: "existing1" }, { name: "existing2" }];
  const setRemoveRoles = vi.fn();
  renderComponent(
    <RolesPanelForm
      addRoles={[]}
      existingRoles={existingRoles}
      setAddRoles={vi.fn()}
      removeRoles={[{ name: "viewer" }]}
      setRemoveRoles={setRemoveRoles}
    />,
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: Label.REMOVE })[0],
  );
  expect(setRemoveRoles).toHaveBeenCalledWith([
    { name: "viewer" },
    { name: "existing1" },
  ]);
});

// eslint-disable-next-line vitest/expect-expect
test("can display errors", async () => {
  renderComponent(
    <RolesPanelForm
      error="Uh oh!"
      addRoles={[]}
      setAddRoles={vi.fn()}
      removeRoles={[]}
      setRemoveRoles={vi.fn()}
    />,
  );
  await hasNotification("Uh oh!");
});
