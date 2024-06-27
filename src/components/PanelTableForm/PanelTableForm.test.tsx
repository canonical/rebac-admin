import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import type { EntityEntitlement } from "api/api.schemas";
import { hasNotification, renderComponent } from "test/utils";

import PanelTableForm from "./PanelTableForm";

const COLUMNS = [
  {
    Header: "Entity",
    accessor: "entity_name",
  },
  {
    Header: "Resource",
    accessor: "entity_type",
  },
  {
    Header: "Entitlement",
    accessor: "entitlement_type",
  },
];

test("displays the form", async () => {
  renderComponent(
    <PanelTableForm<EntityEntitlement>
      addEntities={[
        {
          entitlement_type: "can_view",
          entity_name: "admins",
          entity_type: "group",
        },
      ]}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) =>
        entity.entitlement_type.includes(search)
      }
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
      entityMatches={(entity, search) =>
        entity.entitlement_type.includes(search)
      }
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
  const existingEntities = [
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
    <PanelTableForm<EntityEntitlement>
      addEntities={addEntities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) =>
        entity.entitlement_type.includes(search)
      }
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
          addEntities[0].entity_name,
          addEntities[0].entity_type,
          addEntities[0].entitlement_type,
        ].join(" "),
      ),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          addEntities[1].entity_name,
          addEntities[1].entity_type,
          addEntities[1].entitlement_type,
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

test("can filter entities", async () => {
  const addEntities = [
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
  const existingEntities = [
    {
      entitlement_type: "can_view",
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
    <PanelTableForm<EntityEntitlement>
      addEntities={addEntities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) =>
        entity.entitlement_type.includes(search)
      }
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
          addEntities[0].entity_name,
          addEntities[0].entity_type,
          addEntities[0].entitlement_type,
        ].join(" "),
      ),
    }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("row", {
      name: new RegExp(
        [
          addEntities[1].entity_name,
          addEntities[1].entity_type,
          addEntities[1].entitlement_type,
        ].join(" "),
      ),
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /moderators collection can_view/,
    }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("row", {
      name: /staff team can_remove/,
    }),
  ).not.toBeInTheDocument();
});

test("displays a message when there are no matches", async () => {
  const addEntities = [
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
  renderComponent(
    <PanelTableForm<EntityEntitlement>
      addEntities={addEntities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) =>
        entity.entitlement_type.includes(search)
      }
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
      entitlement_type: "can_edit",
      entity_name: "moderators",
      entity_type: "collection",
    },
  ];
  const existingEntities = [
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
    <PanelTableForm<EntityEntitlement>
      addEntities={[]}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) =>
        entity.entitlement_type.includes(search)
      }
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
      name: /moderators collection can_edit/,
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /staff team can_remove/,
    }),
  ).toBeInTheDocument();
});

test("can remove newly added entities", async () => {
  const entities = [
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
    {
      entitlement_type: "can_read",
      entity_name: "admins",
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
      entityMatches={(entity, search) =>
        entity.entitlement_type.includes(search)
      }
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
      entitlement_type: "can_read",
      entity_name: "editors",
      entity_type: "client",
    },
    {
      entitlement_type: "can_read",
      entity_name: "admins",
      entity_type: "client",
    },
  ]);
});

test("can remove existing entities", async () => {
  const existingEntities = [
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
  const setRemoveEntities = vi.fn();
  renderComponent(
    <PanelTableForm<EntityEntitlement>
      addEntities={[]}
      existingEntities={existingEntities}
      setAddEntities={vi.fn()}
      removeEntities={[
        {
          entitlement_type: "can_remove",
          entity_name: "staff",
          entity_type: "team",
        },
      ]}
      setRemoveEntities={setRemoveEntities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) =>
        entity.entitlement_type.includes(search)
      }
      form={<form></form>}
      generateCells={(entitlement) => ({ ...entitlement })}
    />,
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Remove entitlement" })[0],
  );
  expect(setRemoveEntities).toHaveBeenCalledWith([
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
    <PanelTableForm<EntityEntitlement>
      error="Uh oh!"
      addEntities={[]}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) =>
        entity.entitlement_type.includes(search)
      }
      existingEntities={[]}
      form={<form></form>}
      generateCells={(entitlement) => ({ ...entitlement })}
      removeEntities={[]}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
  await hasNotification("Uh oh!");
});
