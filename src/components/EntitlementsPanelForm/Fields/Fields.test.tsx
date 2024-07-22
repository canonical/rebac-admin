import { screen, within } from "@testing-library/react";
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

import { Label } from "../types";

import Fields from "./Fields";

const mockApiServer = setupServer(
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
const mockEntitlements = [
  {
    entity_type: "mock-entity-type-1",
    entity_name: "",
    entitlement_type: "mock-entitlement-type-1",
  },
  {
    entity_type: "mock-entity-type-1",
    entity_name: "",
    entitlement_type: "mock-entitlement-type-2",
  },
  {
    entity_type: "mock-entity-type-3",
    entity_name: "",
    entitlement_type: "mock-entitlement-type-3",
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
      initialValues={{ entity_type: "", entity_name: "", entitlement_type: "" }}
      onSubmit={vi.fn()}
    >
      <Fields entitlements={mockEntitlements} />
    </Formik>,
  );
  const resourceTypeSelect = screen.getByRole("combobox", {
    name: Label.ENTITY,
  });
  expect(resourceTypeSelect).toHaveValue("");
  const resourceSelect = screen.getByRole("combobox", { name: Label.RESOURCE });
  expect(resourceSelect).toHaveValue("");
  expect(resourceSelect).toBeDisabled();
  const entitlementTypeSelect = screen.getByRole("combobox", {
    name: Label.ENTITLEMENT,
  });
  expect(entitlementTypeSelect).toHaveValue("");
  expect(entitlementTypeSelect).toBeDisabled();
});

test("should display the correct values and populate all the fields", async () => {
  renderComponent(
    <Formik<EntityEntitlement>
      initialValues={{ entity_type: "", entity_name: "", entitlement_type: "" }}
      onSubmit={vi.fn()}
    >
      <Fields entitlements={mockEntitlements} />
    </Formik>,
  );
  const resourceTypeSelect = screen.getByRole("combobox", {
    name: Label.ENTITY,
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
  expect(await screen.findByText("Loading...")).toBeInTheDocument();
  expect(await screen.findByText("Select a resource")).toBeInTheDocument();
  const resourceSelect = screen.getByRole("combobox", { name: Label.RESOURCE });
  expect(resourceSelect).not.toBeDisabled();
  const resourceSelectOptions = within(resourceSelect).getAllByRole("option");
  expect(resourceSelectOptions).toHaveLength(2);
  expect(resourceSelectOptions[0]).toHaveValue("");
  expect(resourceSelectOptions[1]).toHaveValue("editors");
  await userEvent.selectOptions(resourceSelect, resourceSelectOptions[1]);
  expect(resourceSelect).toHaveValue("editors");
  const entitlementTypeSelect = screen.getByRole("combobox", {
    name: Label.ENTITLEMENT,
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
      initialValues={{ entity_type: "", entity_name: "", entitlement_type: "" }}
      onSubmit={vi.fn()}
    >
      <Fields entitlements={mockEntitlements} />
    </Formik>,
  );
  const resourceTypeSelect = screen.getByRole("combobox", {
    name: Label.ENTITY,
  });
  await userEvent.selectOptions(resourceTypeSelect, "mock-entity-type-1");
  expect(await screen.findByText("Loading...")).toBeInTheDocument();
  expect(await screen.findByText("Select a resource")).toBeInTheDocument();
  const resourceSelect = screen.getByRole("combobox", { name: Label.RESOURCE });
  await userEvent.selectOptions(resourceSelect, "editors");
  expect(resourceSelect).toHaveValue("editors");
  await userEvent.selectOptions(resourceTypeSelect, "mock-entity-type-3");
  expect(resourceSelect).toHaveValue("");
});
