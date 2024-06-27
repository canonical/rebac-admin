import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { hasNotification, renderComponent } from "test/utils";

import RolesPanelForm from "./RolesPanelForm";
import { Label } from "./types";

test("can add roles", async () => {
  const setAddRoles = vi.fn();
  renderComponent(
    <RolesPanelForm
      addRoles={[{ name: "viewer" }]}
      setAddRoles={setAddRoles}
      removeRoles={[]}
      setRemoveRoles={vi.fn()}
    />,
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.ROLE }),
    "devops",
  );
  await userEvent.click(screen.getByRole("button", { name: Label.SUBMIT }));
  expect(setAddRoles).toHaveBeenCalledWith([
    { name: "viewer" },
    { name: "devops" },
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
