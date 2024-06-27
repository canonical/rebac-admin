import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { hasNotification, renderComponent } from "test/utils";

import IdentitiesPanelForm from "./IdentitiesPanelForm";
import { Label } from "./types";

test("can add identities", async () => {
  const setAddIdentities = vi.fn();
  renderComponent(
    <IdentitiesPanelForm
      addIdentities={[
        { email: "johndoe@example.com", addedBy: "admin", source: "local" },
      ]}
      setAddIdentities={setAddIdentities}
      removeIdentities={[]}
      setRemoveIdentities={vi.fn()}
    />,
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.USER }),
    "joe@example.com",
  );
  await userEvent.click(screen.getByRole("button", { name: Label.SUBMIT }));
  expect(setAddIdentities).toHaveBeenCalledWith([
    { email: "johndoe@example.com", addedBy: "admin", source: "local" },
    { email: "joe@example.com", addedBy: "", source: "" },
  ]);
});

test("can display identities", async () => {
  const addIdentities = [
    { email: "johndoe@example.com", addedBy: "admin", source: "local" },
    { email: "joe@example.com", addedBy: "admin", source: "local" },
  ];
  const existingIdentities = [
    { email: "existing1@example.com", addedBy: "admin", source: "local" },
    { email: "existing2@example.com", addedBy: "admin", source: "local" },
  ];
  renderComponent(
    <IdentitiesPanelForm
      addIdentities={addIdentities}
      existingIdentities={existingIdentities}
      setAddIdentities={vi.fn()}
      removeIdentities={[]}
      setRemoveIdentities={vi.fn()}
    />,
  );
  expect(
    screen.getByRole("row", {
      name: new RegExp(addIdentities[0].email),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: new RegExp(addIdentities[1].email),
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

test("does not display removed identities from the API", async () => {
  const removeIdentities = [
    { email: "existing1@example.com", addedBy: "admin", source: "local" },
  ];
  const existingIdentities = [
    { email: "existing1@example.com", addedBy: "admin", source: "local" },
    { email: "existing2@example.com", addedBy: "admin", source: "local" },
  ];
  renderComponent(
    <IdentitiesPanelForm
      addIdentities={[]}
      existingIdentities={existingIdentities}
      setAddIdentities={vi.fn()}
      removeIdentities={removeIdentities}
      setRemoveIdentities={vi.fn()}
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

test("can remove newly added identities", async () => {
  const identities = [
    { email: "joe@example.com", addedBy: "admin", source: "local" },
    { email: "johndoe@example.com", addedBy: "admin", source: "local" },
  ];
  const setAddIdentities = vi.fn();
  renderComponent(
    <IdentitiesPanelForm
      addIdentities={identities}
      setAddIdentities={setAddIdentities}
      removeIdentities={[]}
      setRemoveIdentities={vi.fn()}
    />,
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: Label.REMOVE })[1],
  );
  expect(setAddIdentities).toHaveBeenCalledWith([
    { email: "joe@example.com", addedBy: "admin", source: "local" },
  ]);
});

test("can remove identities from the API", async () => {
  const existingIdentities = [
    { email: "existing1@example.com", addedBy: "admin", source: "local" },
    { email: "existing2@example.com", addedBy: "admin", source: "local" },
  ];
  const setRemoveIdentities = vi.fn();
  renderComponent(
    <IdentitiesPanelForm
      addIdentities={[]}
      existingIdentities={existingIdentities}
      setAddIdentities={vi.fn()}
      removeIdentities={[
        { email: "johndoe@example.com", addedBy: "admin", source: "local" },
      ]}
      setRemoveIdentities={setRemoveIdentities}
    />,
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: Label.REMOVE })[0],
  );
  expect(setRemoveIdentities).toHaveBeenCalledWith([
    { email: "johndoe@example.com", addedBy: "admin", source: "local" },
    { email: "existing1@example.com", addedBy: "admin", source: "local" },
  ]);
});

// eslint-disable-next-line vitest/expect-expect
test("can display errors", async () => {
  renderComponent(
    <IdentitiesPanelForm
      error="Uh oh!"
      addIdentities={[]}
      setAddIdentities={vi.fn()}
      removeIdentities={[]}
      setRemoveIdentities={vi.fn()}
    />,
  );
  await hasNotification("Uh oh!");
});
