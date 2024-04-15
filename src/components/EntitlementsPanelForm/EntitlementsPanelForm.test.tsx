import { screen, act } from "@testing-library/react";
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
          entitlement: "can_view",
          entity: "admins",
          resource: "group",
        },
      ]}
      setAddEntitlements={setAddEntitlements}
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
  renderComponent(
    <EntitlementsPanelForm
      addEntitlements={entitlements}
      setAddEntitlements={vi.fn()}
    />,
  );
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          entitlements[0].entity,
          entitlements[0].resource,
          entitlements[0].entitlement,
        ].join(" "),
      ),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          entitlements[1].entity,
          entitlements[1].resource,
          entitlements[1].entitlement,
        ].join(" "),
      ),
    }),
  ).toBeInTheDocument();
});

test("can remove entitlements", async () => {
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
    />,
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: Label.REMOVE })[0],
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

// eslint-disable-next-line vitest/expect-expect
test("can display errors", async () => {
  renderComponent(
    <EntitlementsPanelForm
      error="Uh oh!"
      addEntitlements={[]}
      setAddEntitlements={vi.fn()}
    />,
  );
  await hasNotification("Uh oh!");
});
