import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getGetEntitlementsMockHandler,
  getGetEntitlementsMockHandler404,
  getGetEntitlementsResponseMock,
} from "api/entitlements/entitlements.msw";
import {
  getGetResourcesMockHandler,
  getGetResourcesResponseMock,
} from "api/resources/resources.msw";
import { renderComponent } from "test/utils";

import EntitlementsPanelForm from "./EntitlementsPanelForm";
import { EntitlementPanelFormFieldsLabel } from "./Fields";
import { Label } from "./types";

const mockApiServer = setupServer(
  getGetEntitlementsMockHandler(
    getGetEntitlementsResponseMock({
      data: [
        {
          entitlement: "can_read",
          entity_id: "editors",
          entity_type: "client",
        },
      ],
    }),
  ),
  getGetResourcesMockHandler(
    getGetResourcesResponseMock({
      data: [
        {
          entity: {
            id: "mock-entity-id",
            name: "editors",
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
          entitlement: "can_view",
          entity_id: "admins",
          entity_type: "group",
        },
      ]}
      setAddEntitlements={setAddEntitlements}
      removeEntitlements={[]}
      setRemoveEntitlements={vi.fn()}
    />,
  );
  await screen.findByText(Label.ADD_ENTITLEMENT);
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: Label.ENTITY }),
    "client",
  );
  await screen.findByText(EntitlementPanelFormFieldsLabel.SELECT_RESOURCE);
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
      entitlement: "can_view",
      entity_id: "admins",
      entity_type: "group",
    },
    {
      entitlement: "can_read",
      entity_id: "mock-entity-id",
      entity_type: "client",
    },
  ]);
});

test("can display entitlements", async () => {
  const addEntitlements = [
    {
      entitlement: "can_view",
      entity_id: "admins",
      entity_type: "group",
    },
    {
      entitlement: "can_read",
      entity_id: "editors",
      entity_type: "client",
    },
  ];
  const existingEntitlements = [
    {
      entitlement: "can_edit",
      entity_id: "moderators",
      entity_type: "collection",
    },
    {
      entitlement: "can_remove",
      entity_id: "staff",
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
  await screen.findByText(Label.ADD_ENTITLEMENT);
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          addEntitlements[0].entity_type,
          addEntitlements[0].entity_id,
          addEntitlements[0].entitlement,
        ].join(" "),
      ),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          addEntitlements[1].entity_type,
          addEntitlements[1].entity_id,
          addEntitlements[1].entitlement,
        ].join(" "),
      ),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /collection moderators can_edit/,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /team staff can_remove/,
    }),
  ).toBeInTheDocument();
});

test("does not display removed entitlements from the API", async () => {
  const removeEntitlements = [
    {
      entitlement: "can_edit",
      entity_id: "moderators",
      entity_type: "collection",
    },
  ];
  const existingEntitlements = [
    {
      entitlement: "can_edit",
      entity_id: "moderators",
      entity_type: "collection",
    },
    {
      entitlement: "can_remove",
      entity_id: "staff",
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
  await screen.findByText(Label.ADD_ENTITLEMENT);
  expect(
    screen.queryByRole("row", {
      name: /collection moderators can_edit/,
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /team staff can_remove/,
    }),
  ).toBeInTheDocument();
});

test("can remove newly added entitlements", async () => {
  const entitlements = [
    {
      entitlement: "can_view",
      entity_id: "admins",
      entity_type: "group",
    },
    {
      entitlement: "can_read",
      entity_id: "editors",
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
  await screen.findByText(Label.ADD_ENTITLEMENT);
  await userEvent.click(
    screen.getAllByRole("button", { name: Label.REMOVE })[0],
  );
  expect(setAddEntitlements).toHaveBeenCalledWith([
    {
      entitlement: "can_read",
      entity_id: "editors",
      entity_type: "client",
    },
  ]);
});

test("can remove entitlements from the API", async () => {
  const existingEntitlements = [
    {
      entitlement: "can_edit",
      entity_id: "moderators",
      entity_type: "collection",
    },
    {
      entitlement: "can_remove",
      entity_id: "staff",
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
          entitlement: "can_remove",
          entity_id: "staff",
          entity_type: "team",
        },
      ]}
      setRemoveEntitlements={setRemoveEntitlements}
    />,
  );
  await screen.findByText(Label.ADD_ENTITLEMENT);
  await userEvent.click(
    screen.getAllByRole("button", { name: Label.REMOVE })[0],
  );
  expect(setRemoveEntitlements).toHaveBeenCalledWith([
    {
      entitlement: "can_remove",
      entity_id: "staff",
      entity_type: "team",
    },
    {
      entitlement: "can_edit",
      entity_id: "moderators",
      entity_type: "collection",
    },
  ]);
});

test("can display errors", async () => {
  mockApiServer.use(getGetEntitlementsMockHandler404());
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <EntitlementsPanelForm
      addEntitlements={[]}
      setAddEntitlements={vi.fn()}
      removeEntitlements={[]}
      setRemoveEntitlements={vi.fn()}
    />,
  );
  expect(
    await findNotificationByText("Request failed with status code 404"),
  ).toBeInTheDocument();
});
