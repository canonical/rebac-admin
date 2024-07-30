import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import type { EntityEntitlement } from "api/api.schemas";
import {
  getGetResourcesMockHandler,
  getGetResourcesResponseMock,
} from "api/resources/resources.msw";
import { renderComponent } from "test/utils";

import { EntitlementsPanelFormLabel } from "..";

import Fields from "./Fields";
import { Label } from "./types";

const mockApiServer = setupServer(
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
const mockEntitlements = [
  {
    entity_type: "mock-entity-type-1",
    receiver_type: "",
    entitlement: "mock-entitlement-type-1",
  },
  {
    entity_type: "mock-entity-type-1",
    receiver_type: "",
    entitlement: "mock-entitlement-type-2",
  },
  {
    entity_type: "mock-entity-type-3",
    receiver_type: "",
    entitlement: "mock-entitlement-type-3",
  },
];

beforeAll(() => {
  mockApiServer.listen();
});

afterEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
});

test("should show the correct fields initially", () => {
  renderComponent(
    <Formik<EntityEntitlement>
      initialValues={{ entity_type: "", entity_id: "", entitlement: "" }}
      onSubmit={vi.fn()}
    >
      <Fields entitlements={mockEntitlements} />
    </Formik>,
  );
  const resourceTypeSelect = screen.getByRole("combobox", {
    name: EntitlementsPanelFormLabel.ENTITY,
  });
  expect(resourceTypeSelect).toHaveValue("");
  const resourceSelect = screen.getByRole("combobox", {
    name: EntitlementsPanelFormLabel.RESOURCE,
  });
  expect(resourceSelect).toHaveValue("");
  expect(resourceSelect).toBeDisabled();
  const entitlementTypeSelect = screen.getByRole("combobox", {
    name: EntitlementsPanelFormLabel.ENTITLEMENT,
  });
  expect(entitlementTypeSelect).toHaveValue("");
  expect(entitlementTypeSelect).toBeDisabled();
});

test("should select the correct resource type", async () => {
  renderComponent(
    <Formik<EntityEntitlement>
      initialValues={{ entity_type: "", entity_id: "", entitlement: "" }}
      onSubmit={vi.fn()}
    >
      <Fields entitlements={mockEntitlements} />
    </Formik>,
  );
  const resourceTypeSelect = screen.getByRole("combobox", {
    name: EntitlementsPanelFormLabel.ENTITY,
  });
  const resourceTypeSelectOptions =
    within(resourceTypeSelect).getAllByRole("option");
  expect(resourceTypeSelectOptions).toHaveLength(3);
  expect(resourceTypeSelectOptions[0]).toHaveValue("");
  expect(resourceTypeSelectOptions[1]).toHaveValue("mock-entity-type-1");
  expect(resourceTypeSelectOptions[2]).toHaveValue("mock-entity-type-3");
  await userEvent.selectOptions(
    resourceTypeSelect,
    resourceTypeSelectOptions[1],
  );
  expect(resourceTypeSelect).toHaveValue("mock-entity-type-1");
});

test("should select the correct resource", async () => {
  renderComponent(
    <Formik<EntityEntitlement>
      initialValues={{ entity_type: "", entity_id: "", entitlement: "" }}
      onSubmit={vi.fn()}
    >
      <Fields entitlements={mockEntitlements} />
    </Formik>,
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.ENTITY,
    }),
    "mock-entity-type-1",
  );
  await waitFor(() =>
    expect(screen.getByText(Label.LOADING_RESOURCES)).toBeInTheDocument(),
  );
  expect(await screen.findByText(Label.SELECT_RESOURCE)).toBeInTheDocument();
  const resourceSelect = screen.getByRole("combobox", {
    name: EntitlementsPanelFormLabel.RESOURCE,
  });
  expect(resourceSelect).not.toBeDisabled();
  const resourceSelectOptions = within(resourceSelect).getAllByRole("option");
  expect(resourceSelectOptions).toHaveLength(2);
  expect(resourceSelectOptions[0]).toHaveValue("");
  expect(resourceSelectOptions[1]).toHaveValue("mock-entity-id");
  await userEvent.selectOptions(resourceSelect, resourceSelectOptions[1]);
  expect(resourceSelect).toHaveValue("mock-entity-id");
});

test("should select the correct entitlement type", async () => {
  renderComponent(
    <Formik<EntityEntitlement>
      initialValues={{ entity_type: "", entity_id: "", entitlement: "" }}
      onSubmit={vi.fn()}
    >
      <Fields entitlements={mockEntitlements} />
    </Formik>,
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.ENTITY,
    }),
    "mock-entity-type-1",
  );
  await waitFor(() =>
    expect(screen.getByText(Label.LOADING_RESOURCES)).toBeInTheDocument(),
  );
  expect(await screen.findByText(Label.SELECT_RESOURCE)).toBeInTheDocument();
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.RESOURCE,
    }),
    "mock-entity-id",
  );
  const entitlementTypeSelect = screen.getByRole("combobox", {
    name: EntitlementsPanelFormLabel.ENTITLEMENT,
  });
  expect(entitlementTypeSelect).not.toBeDisabled();
  const entitlementTypeSelectOptions = within(
    entitlementTypeSelect,
  ).getAllByRole("option");
  expect(entitlementTypeSelectOptions).toHaveLength(3);
  expect(entitlementTypeSelectOptions[0]).toHaveValue("");
  expect(entitlementTypeSelectOptions[1]).toHaveValue(
    "mock-entitlement-type-1",
  );
  expect(entitlementTypeSelectOptions[2]).toHaveValue(
    "mock-entitlement-type-2",
  );
  await userEvent.selectOptions(
    entitlementTypeSelect,
    entitlementTypeSelectOptions[1],
  );
  expect(entitlementTypeSelect).toHaveValue("mock-entitlement-type-1");
});

test("should reset resource and entitlement when the resource type changes", async () => {
  renderComponent(
    <Formik<EntityEntitlement>
      initialValues={{ entity_type: "", entity_id: "", entitlement: "" }}
      onSubmit={vi.fn()}
    >
      <Fields entitlements={mockEntitlements} />
    </Formik>,
  );
  const resourceTypeSelect = screen.getByRole("combobox", {
    name: EntitlementsPanelFormLabel.ENTITY,
  });
  await userEvent.selectOptions(resourceTypeSelect, "mock-entity-type-1");
  await waitFor(() =>
    expect(screen.getByText(Label.LOADING_RESOURCES)).toBeInTheDocument(),
  );
  expect(await screen.findByText(Label.SELECT_RESOURCE)).toBeInTheDocument();
  const resourceSelect = screen.getByRole("combobox", {
    name: EntitlementsPanelFormLabel.RESOURCE,
  });
  await userEvent.selectOptions(resourceSelect, "mock-entity-id");
  expect(resourceSelect).toHaveValue("mock-entity-id");
  await userEvent.selectOptions(resourceTypeSelect, "mock-entity-type-3");
  expect(resourceSelect).toHaveValue("");
});
