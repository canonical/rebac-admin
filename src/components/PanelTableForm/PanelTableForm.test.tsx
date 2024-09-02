import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import type { EntityEntitlement } from "api/api.schemas";
import { renderComponent } from "test/utils";

import PanelTableForm from "./PanelTableForm";

const COLUMNS = [
  {
    Header: "Entity",
    accessor: "entity_type",
  },
  {
    Header: "Resource",
    accessor: "entity_id",
  },
  {
    Header: "Entitlement",
    accessor: "entitlement",
  },
];

test("displays the form", async () => {
  renderComponent(
    <PanelTableForm<EntityEntitlement>
      addEntities={[
        {
          entitlement: "can_view",
          entity_id: "admins",
          entity_type: "group",
        },
      ]}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={[]}
      form={<form aria-label="Add form"></form>}
      generateCells={(entitlement) => ({ ...entitlement })}
      removeEntities={[]}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
  expect(screen.getByRole("form", { name: "Add form" })).toBeInTheDocument();
});

test("displays the empty state", async () => {
  renderComponent(
    <PanelTableForm<EntityEntitlement>
      addEntities={[]}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={[]}
      form={<form></form>}
      generateCells={(entitlement) => ({ ...entitlement })}
      removeEntities={[]}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
  expect(screen.getByText("No entitlements")).toHaveClass("p-heading--4");
});

test("can display entities", async () => {
  const addEntities = [
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
  const existingEntities = [
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
    <PanelTableForm<EntityEntitlement>
      addEntities={addEntities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={existingEntities}
      form={<form></form>}
      generateCells={(entitlement) => ({ ...entitlement })}
      removeEntities={[]}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          addEntities[0].entity_type,
          addEntities[0].entity_id,
          addEntities[0].entitlement,
        ].join(" "),
      ),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          addEntities[1].entity_type,
          addEntities[1].entity_id,
          addEntities[1].entitlement,
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

test("can filter entities", async () => {
  const addEntities = [
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
  const existingEntities = [
    {
      entitlement: "can_view",
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
    <PanelTableForm<EntityEntitlement>
      addEntities={addEntities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={existingEntities}
      form={<form></form>}
      generateCells={(entitlement) => ({ ...entitlement })}
      removeEntities={[]}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
  await userEvent.type(screen.getByRole("searchbox"), "can_view");
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          addEntities[0].entity_type,
          addEntities[0].entity_id,
          addEntities[0].entitlement,
        ].join(" "),
      ),
    }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("row", {
      name: new RegExp(
        [
          addEntities[1].entity_type,
          addEntities[1].entity_id,
          addEntities[1].entitlement,
        ].join(" "),
      ),
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /collection moderators can_view/,
    }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("row", {
      name: /team staff can_remove/,
    }),
  ).not.toBeInTheDocument();
});

test("displays a message when there are no matches", async () => {
  const addEntities = [
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
  renderComponent(
    <PanelTableForm<EntityEntitlement>
      addEntities={addEntities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={[]}
      form={<form></form>}
      generateCells={(entitlement) => ({ ...entitlement })}
      removeEntities={[]}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
  await userEvent.type(screen.getByRole("searchbox"), "nothing");
  expect(
    screen.getByText("No entitlements match the search criteria."),
  ).toBeInTheDocument();
});

test("does not display removed entities", async () => {
  const removeEntities = [
    {
      entitlement: "can_edit",
      entity_id: "moderators",
      entity_type: "collection",
    },
  ];
  const existingEntities = [
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
    <PanelTableForm<EntityEntitlement>
      addEntities={[]}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={existingEntities}
      form={<form></form>}
      generateCells={(entitlement) => ({ ...entitlement })}
      removeEntities={removeEntities}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
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

test("can remove newly added entities", async () => {
  const entities = [
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
    {
      entitlement: "can_read",
      entity_id: "admins",
      entity_type: "client",
    },
  ];
  const setAddEntities = vi.fn();
  renderComponent(
    <PanelTableForm<EntityEntitlement>
      addEntities={entities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={[]}
      form={<form></form>}
      generateCells={(entitlement) => ({ ...entitlement })}
      removeEntities={[]}
      setAddEntities={setAddEntities}
      setRemoveEntities={vi.fn()}
    />,
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Remove entitlement" })[0],
  );
  expect(setAddEntities).toHaveBeenCalledWith([
    {
      entitlement: "can_read",
      entity_id: "editors",
      entity_type: "client",
    },
    {
      entitlement: "can_read",
      entity_id: "admins",
      entity_type: "client",
    },
  ]);
});

test("can remove existing entities", async () => {
  const existingEntities = [
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
  const setRemoveEntities = vi.fn();
  renderComponent(
    <PanelTableForm<EntityEntitlement>
      addEntities={[]}
      existingEntities={existingEntities}
      setAddEntities={vi.fn()}
      removeEntities={[
        {
          entitlement: "can_remove",
          entity_id: "staff",
          entity_type: "team",
        },
      ]}
      setRemoveEntities={setRemoveEntities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      form={<form></form>}
      generateCells={(entitlement) => ({ ...entitlement })}
    />,
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Remove entitlement" })[0],
  );
  expect(setRemoveEntities).toHaveBeenCalledWith([
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
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <PanelTableForm<EntityEntitlement>
      error="Uh oh!"
      addEntities={[]}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={[]}
      form={<form></form>}
      generateCells={(entitlement) => ({ ...entitlement })}
      removeEntities={[]}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
  expect(await findNotificationByText("Uh oh!")).toBeInTheDocument();
});

test("should display the loading state", async () => {
  renderComponent(
    <PanelTableForm<EntityEntitlement>
      isFetching
      addEntities={[]}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={[]}
      form={<form></form>}
      generateCells={(entitlement) => ({ ...entitlement })}
      removeEntities={[]}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
  expect(screen.getByText("Loading entitlements")).toBeInTheDocument();
});
