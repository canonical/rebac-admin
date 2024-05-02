import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { hasNotification, renderComponent } from "test/utils";

import EntitlementsPanelForm from "./EntitlementsPanelForm";
import { Label } from "./types";

test("displays the empty state", async () => {
  renderComponent(
    <EntitlementsPanelForm
      addEntitlements={[]}
      existingEntitlements={[]}
      setAddEntitlements={vi.fn()}
      removeEntitlements={[]}
      setRemoveEntitlements={vi.fn()}
    />,
  );
  expect(
    screen.getByRole("heading", { name: Label.EMPTY }),
  ).toBeInTheDocument();
});

test("can add entitlements", async () => {
  const setAddEntitlements = vi.fn();
  renderComponent(
    <EntitlementsPanelForm
      addEntitlements={[
        {
          entitlement: "can_view",
          entity: "admins",
          resource: "group",
        },
      ]}
      setAddEntitlements={setAddEntitlements}
      removeEntitlements={[]}
      setRemoveEntitlements={vi.fn()}
    />,
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: Label.ENTITY }),
        "client",
      ),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: Label.RESOURCE }),
        "editors",
      ),
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: Label.ENTITLEMENT }),
        "can_read",
      ),
  );
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: Label.SUBMIT })),
  );
  expect(setAddEntitlements).toHaveBeenCalledWith([
    {
      entitlement: "can_view",
      entity: "admins",
      resource: "group",
    },
    {
      entitlement: "can_read",
      entity: "client",
      resource: "editors",
    },
  ]);
});

test("can display entitlements", async () => {
  const addEntitlements = [
    {
      entitlement: "can_view",
      entity: "admins",
      resource: "group",
    },
    {
      entitlement: "can_read",
      entity: "editors",
      resource: "client",
    },
  ];
  const existingEntitlements = [
    "can_edit::moderators:collection",
    "can_remove::staff:team",
  ];
  renderComponent(
    <EntitlementsPanelForm
      addEntitlements={addEntitlements}
      existingEntitlements={existingEntitlements}
      setAddEntitlements={vi.fn()}
      removeEntitlements={[]}
      setRemoveEntitlements={vi.fn()}
    />,
  );
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          addEntitlements[0].entity,
          addEntitlements[0].resource,
          addEntitlements[0].entitlement,
        ].join(" "),
      ),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          addEntitlements[1].entity,
          addEntitlements[1].resource,
          addEntitlements[1].entitlement,
        ].join(" "),
      ),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /moderators collection can_edit/,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /staff team can_remove/,
    }),
  ).toBeInTheDocument();
});

test("does not display removed entitlements from the API", async () => {
  const removeEntitlements = [
    {
      entitlement: "can_edit",
      entity: "moderators",
      resource: "collection",
    },
  ];
  const existingEntitlements = [
    "can_edit::moderators:collection",
    "can_remove::staff:team",
  ];
  renderComponent(
    <EntitlementsPanelForm
      addEntitlements={[]}
      existingEntitlements={existingEntitlements}
      setAddEntitlements={vi.fn()}
      removeEntitlements={removeEntitlements}
      setRemoveEntitlements={vi.fn()}
    />,
  );
  expect(
    screen.queryByRole("row", {
      name: /moderators collection can_edit/,
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /staff team can_remove/,
    }),
  ).toBeInTheDocument();
});

test("can remove newly added entitlements", async () => {
  const entitlements = [
    {
      entitlement: "can_view",
      entity: "admins",
      resource: "group",
    },
    {
      entitlement: "can_read",
      entity: "editors",
      resource: "client",
    },
  ];
  const setAddEntitlements = vi.fn();
  renderComponent(
    <EntitlementsPanelForm
      addEntitlements={entitlements}
      setAddEntitlements={setAddEntitlements}
      removeEntitlements={[]}
      setRemoveEntitlements={vi.fn()}
    />,
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: Label.REMOVE })[1],
      ),
  );
  expect(setAddEntitlements).toHaveBeenCalledWith([
    {
      entitlement: "can_read",
      entity: "editors",
      resource: "client",
    },
  ]);
});

test("can remove entitlements from the API", async () => {
  const existingEntitlements = [
    "can_edit::moderators:collection",
    "can_remove::staff:team",
  ];
  const setRemoveEntitlements = vi.fn();
  renderComponent(
    <EntitlementsPanelForm
      addEntitlements={[]}
      existingEntitlements={existingEntitlements}
      setAddEntitlements={vi.fn()}
      removeEntitlements={[
        {
          entitlement: "can_remove",
          entity: "staff",
          resource: "team",
        },
      ]}
      setRemoveEntitlements={setRemoveEntitlements}
    />,
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: Label.REMOVE })[0],
      ),
  );
  expect(setRemoveEntitlements).toHaveBeenCalledWith([
    {
      entitlement: "can_remove",
      entity: "staff",
      resource: "team",
    },
    {
      entitlement: "can_edit",
      entity: "moderators",
      resource: "collection",
    },
  ]);
});

// eslint-disable-next-line vitest/expect-expect
test("can display errors", async () => {
  renderComponent(
    <EntitlementsPanelForm
      error="Uh oh!"
      addEntitlements={[]}
      setAddEntitlements={vi.fn()}
      removeEntitlements={[]}
      setRemoveEntitlements={vi.fn()}
    />,
  );
  await hasNotification("Uh oh!");
});
