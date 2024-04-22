import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { hasNotification, renderComponent } from "test/utils";

import IdentitiesPanelForm from "./IdentitiesPanelForm";
import { Label } from "./types";

test("can add identities", async () => {
  const setAddIdentities = vi.fn();
  renderComponent(
    <IdentitiesPanelForm
      addIdentities={["johndoe"]}
      setAddIdentities={setAddIdentities}
      removeIdentities={[]}
      setRemoveIdentities={vi.fn()}
    />,
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: Label.USER }),
        "joe",
      ),
  );
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: Label.SUBMIT })),
  );
  expect(setAddIdentities).toHaveBeenCalledWith(["johndoe", "joe"]);
});

test("can display identities", async () => {
  const addIdentities = ["johndoe", "joe"];
  const existingIdentities = ["user:existing1", "user:existing2"];
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
      name: new RegExp(addIdentities[0]),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: new RegExp(addIdentities[1]),
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
  const removeIdentities = ["existing1"];
  const existingIdentities = ["user:existing1", "user:existing2"];
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
  const identities = ["joe", "johndoe"];
  const setAddIdentities = vi.fn();
  renderComponent(
    <IdentitiesPanelForm
      addIdentities={identities}
      setAddIdentities={setAddIdentities}
      removeIdentities={[]}
      setRemoveIdentities={vi.fn()}
    />,
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: Label.REMOVE })[1],
      ),
  );
  expect(setAddIdentities).toHaveBeenCalledWith(["joe"]);
});

test("can remove identities from the API", async () => {
  const existingIdentities = ["user:existing1", "user:existing2"];
  const setRemoveIdentities = vi.fn();
  renderComponent(
    <IdentitiesPanelForm
      addIdentities={[]}
      existingIdentities={existingIdentities}
      setAddIdentities={vi.fn()}
      removeIdentities={["johndoe"]}
      setRemoveIdentities={setRemoveIdentities}
    />,
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: Label.REMOVE })[0],
      ),
  );
  expect(setRemoveIdentities).toHaveBeenCalledWith(["johndoe", "existing1"]);
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
