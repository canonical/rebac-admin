import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import { CapabilityMethodsItem } from "api/api.schemas";
import {
  getGetRolesMockHandler,
  getGetRolesMockHandler400,
  getGetRolesResponseMock,
  getGetRolesResponseMock400,
} from "api/roles/roles.msw";
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { renderComponent } from "test/utils";
import { Endpoint } from "types/api";

import RolesPanelForm from "./RolesPanelForm";
import { Label as RolesPanelFormLabel } from "./types";

const mockApiServer = setupServer(
  ...getGetActualCapabilitiesMock(),
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
  await userEvent.click(
    await screen.findByRole("combobox", {
      name: RolesPanelFormLabel.SELECT,
    }),
  );
  // Wait for the options to load.
  const checkbox = await screen.findByRole("checkbox", {
    name: "role3",
  });
  await userEvent.click(checkbox);
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
    screen.getAllByRole("button", { name: RolesPanelFormLabel.REMOVE })[1],
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
    screen.getAllByRole("button", { name: RolesPanelFormLabel.REMOVE })[0],
  );
  expect(setRemoveRoles).toHaveBeenCalledWith([
    { name: "viewer" },
    { name: "existing1" },
  ]);
});

test("can display fetch errors", async () => {
  mockApiServer.use(
    getGetRolesMockHandler400(
      getGetRolesResponseMock400({ message: "Uh oh!" }),
    ),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <RolesPanelForm
      addRoles={[]}
      setAddRoles={vi.fn()}
      removeRoles={[]}
      setRemoveRoles={vi.fn()}
    />,
  );
  expect(await findNotificationByText("Uh oh!")).toBeInTheDocument();
});

test("hides the form if there is no capability", async () => {
  mockApiServer.use(
    ...getGetActualCapabilitiesMock([
      {
        endpoint: Endpoint.ROLES,
        methods: [CapabilityMethodsItem.GET],
      },
    ]),
  );
  renderComponent(
    <RolesPanelForm
      addRoles={[]}
      setAddRoles={vi.fn()}
      removeRoles={[]}
      setRemoveRoles={vi.fn()}
    />,
  );
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
});

test("can hide the table", async () => {
  renderComponent(
    <RolesPanelForm
      addRoles={[]}
      setAddRoles={vi.fn()}
      removeRoles={[]}
      setRemoveRoles={vi.fn()}
      showTable={false}
    />,
  );
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});
