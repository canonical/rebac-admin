import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { hasNotification, renderComponent } from "test/utils";

import EntitlementsPanelForm from "./EntitlementsPanelForm";
import { Label } from "./types";

test("can add entitlements", async () => {
  const setAddEntitlements = vi.fn();
  renderComponent(
    <EntitlementsPanelForm
      addEntitlements={[
        {
          entitlement_type: "can_view",
          entity_name: "admins",
          entity_type: "group",
        },
      ]}
      setAddEntitlements={setAddEntitlements}
      removeEntitlements={[]}
      setRemoveEntitlements={vi.fn()}
    />,
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.ENTITY }),
    "client",
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.RESOURCE }),
    "editors",
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.ENTITLEMENT }),
    "can_read",
  );
  await userEvent.click(screen.getByRole("button", { name: Label.SUBMIT }));
  expect(setAddEntitlements).toHaveBeenCalledWith([
    {
      entitlement_type: "can_view",
      entity_name: "admins",
      entity_type: "group",
    },
    {
      entitlement_type: "can_read",
      entity_name: "client",
      entity_type: "editors",
    },
  ]);
});

test("can display entitlements", async () => {
  const addEntitlements = [
    {
      entitlement_type: "can_view",
      entity_name: "admins",
      entity_type: "group",
    },
    {
      entitlement_type: "can_read",
      entity_name: "editors",
      entity_type: "client",
    },
  ];
  const existingEntitlements = [
    {
      entitlement_type: "can_edit",
      entity_name: "moderators",
      entity_type: "collection",
    },
    {
      entitlement_type: "can_remove",
      entity_name: "staff",
      entity_type: "team",
    },
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
          addEntitlements[0].entity_name,
          addEntitlements[0].entity_type,
          addEntitlements[0].entitlement_type,
        ].join(" "),
      ),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          addEntitlements[1].entity_name,
          addEntitlements[1].entity_type,
          addEntitlements[1].entitlement_type,
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
      entitlement_type: "can_edit",
      entity_name: "moderators",
      entity_type: "collection",
    },
  ];
  const existingEntitlements = [
    {
      entitlement_type: "can_edit",
      entity_name: "moderators",
      entity_type: "collection",
    },
    {
      entitlement_type: "can_remove",
      entity_name: "staff",
      entity_type: "team",
    },
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
      entitlement_type: "can_view",
      entity_name: "admins",
      entity_type: "group",
    },
    {
      entitlement_type: "can_read",
      entity_name: "editors",
      entity_type: "client",
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
  await userEvent.click(
    screen.getAllByRole("button", { name: Label.REMOVE })[0],
  );
  expect(setAddEntitlements).toHaveBeenCalledWith([
    {
      entitlement_type: "can_read",
      entity_name: "editors",
      entity_type: "client",
    },
  ]);
});

test("can remove entitlements from the API", async () => {
  const existingEntitlements = [
    {
      entitlement_type: "can_edit",
      entity_name: "moderators",
      entity_type: "collection",
    },
    {
      entitlement_type: "can_remove",
      entity_name: "staff",
      entity_type: "team",
    },
  ];
  const setRemoveEntitlements = vi.fn();
  renderComponent(
    <EntitlementsPanelForm
      addEntitlements={[]}
      existingEntitlements={existingEntitlements}
      setAddEntitlements={vi.fn()}
      removeEntitlements={[
        {
          entitlement_type: "can_remove",
          entity_name: "staff",
          entity_type: "team",
        },
      ]}
      setRemoveEntitlements={setRemoveEntitlements}
    />,
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: Label.REMOVE })[0],
  );
  expect(setRemoveEntitlements).toHaveBeenCalledWith([
    {
      entitlement_type: "can_remove",
      entity_name: "staff",
      entity_type: "team",
    },
    {
      entitlement_type: "can_edit",
      entity_name: "moderators",
      entity_type: "collection",
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
