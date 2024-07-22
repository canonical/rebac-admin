import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getGetEntitlementsMockHandler,
  getGetEntitlementsResponseMock,
} from "api/entitlements/entitlements.msw";
import {
  getGetResourcesMockHandler,
  getGetResourcesResponseMock,
} from "api/resources/resources.msw";
import { hasNotification, renderComponent } from "test/utils";

import EntitlementsPanelForm from "./EntitlementsPanelForm";
import { Label } from "./types";

const mockApiServer = setupServer(
  getGetEntitlementsMockHandler(
    getGetEntitlementsResponseMock({
      data: [
        {
          entitlement_type: "can_read",
          entity_name: "editors",
          entity_type: "client",
        },
      ],
    }),
  ),
  getGetResourcesMockHandler(
    getGetResourcesResponseMock({
      data: [
        {
          id: "mock-id",
          name: "editors",
          entity: {
            id: "mock-entity-id",
            type: "mock-entity-name",
          },
        },
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
  await screen.findByText("Add entitlement tuple");
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: Label.ENTITY }),
    "client",
  );
  await screen.findByText("Select a resource");
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: Label.RESOURCE }),
    "editors",
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: Label.ENTITLEMENT }),
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
      entity_name: "editors",
      entity_type: "client",
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
  await screen.findByText("Add entitlement tuple");
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
  await screen.findByText("Add entitlement tuple");
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
  await screen.findByText("Add entitlement tuple");
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
  await screen.findByText("Add entitlement tuple");
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
