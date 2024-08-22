import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getGetRolesMockHandler,
  getGetRolesMockHandler400,
  getGetRolesResponseMock,
  getGetRolesResponseMock400,
} from "api/roles/roles.msw";
import { Label as RolesPanelFormLabel } from "components/RolesPanelForm";
import { hasNotification, renderComponent } from "test/utils";

import RolesPanelForm from "./RolesPanelForm";

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
  await userEvent.click(
    screen.getByRole("combobox", {
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
    screen.getAllByRole("button", { name: "Remove role" })[1],
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
    screen.getAllByRole("button", { name: "Remove role" })[0],
  );
  expect(setRemoveRoles).toHaveBeenCalledWith([
    { name: "viewer" },
    { name: "existing1" },
  ]);
});

// eslint-disable-next-line vitest/expect-expect
test("can display fetch errors", async () => {
  mockApiServer.use(
    getGetRolesMockHandler400(
      getGetRolesResponseMock400({ message: "Uh oh!" }),
    ),
  );
  renderComponent(
    <RolesPanelForm
      addRoles={[]}
      setAddRoles={vi.fn()}
      removeRoles={[]}
      setRemoveRoles={vi.fn()}
    />,
  );
  await hasNotification("Uh oh!");
});

test("filter roles", async () => {
  let getDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    console.log(requestClone.url);
    if (
      requestClone.method === "GET" &&
      requestClone.url.endsWith("/roles?filter=role1")
    ) {
      getDone = true;
    }
  });
  renderComponent(
    <RolesPanelForm
      addRoles={[]}
      setAddRoles={vi.fn()}
      removeRoles={[]}
      setRemoveRoles={vi.fn()}
    />,
  );
  await userEvent.click(
    screen.getByRole("combobox", {
      name: RolesPanelFormLabel.SELECT,
    }),
  );
  await userEvent.type(
    within(screen.getByRole("listbox")).getByRole("searchbox"),
    "role1{enter}",
  );
  await waitFor(() => expect(getDone).toBeTruthy());
});
