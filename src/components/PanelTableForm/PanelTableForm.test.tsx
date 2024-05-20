import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import type { Entitlement } from "components/EntitlementsPanelForm";
import { hasNotification, renderComponent } from "test/utils";

import PanelTableForm from "./PanelTableForm";

const COLUMNS = [
  {
    Header: "Entity",
    accessor: "entity",
  },
  {
    Header: "Resource",
    accessor: "resource",
  },
  {
    Header: "Entitlement",
    accessor: "entitlement",
  },
];

test("displays the form", async () => {
  renderComponent(
    <PanelTableForm<Entitlement>
      addEntities={[
        {
          entitlement: "can_view",
          entity: "admins",
          resource: "group",
        },
      ]}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={[]}
      form={<form aria-label="Add form"></form>}
      generateCells={(entitlement) => entitlement}
      removeEntities={[]}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
  expect(screen.getByRole("form", { name: "Add form" })).toBeInTheDocument();
});

test("displays the empty state", async () => {
  renderComponent(
    <PanelTableForm<Entitlement>
      addEntities={[]}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={[]}
      form={<form></form>}
      generateCells={(entitlement) => entitlement}
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
      entity: "admins",
      resource: "group",
    },
    {
      entitlement: "can_read",
      entity: "editors",
      resource: "client",
    },
  ];
  const existingEntities = [
    {
      entitlement: "can_edit",
      entity: "moderators",
      resource: "collection",
    },
    {
      entitlement: "can_remove",
      entity: "staff",
      resource: "team",
    },
  ];
  renderComponent(
    <PanelTableForm<Entitlement>
      addEntities={addEntities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={existingEntities}
      form={<form></form>}
      generateCells={(entitlement) => entitlement}
      removeEntities={[]}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          addEntities[0].entity,
          addEntities[0].resource,
          addEntities[0].entitlement,
        ].join(" "),
      ),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          addEntities[1].entity,
          addEntities[1].resource,
          addEntities[1].entitlement,
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
  const existingEntities = [
    {
      entitlement: "can_view",
      entity: "moderators",
      resource: "collection",
    },
    {
      entitlement: "can_remove",
      entity: "staff",
      resource: "team",
    },
  ];
  renderComponent(
    <PanelTableForm<Entitlement>
      addEntities={addEntities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={existingEntities}
      form={<form></form>}
      generateCells={(entitlement) => entitlement}
      removeEntities={[]}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
  await act(
    async () => await userEvent.type(screen.getByRole("searchbox"), "can_view"),
  );
  expect(
    screen.getByRole("row", {
      name: new RegExp(
        [
          addEntities[0].entity,
          addEntities[0].resource,
          addEntities[0].entitlement,
        ].join(" "),
      ),
    }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("row", {
      name: new RegExp(
        [
          addEntities[1].entity,
          addEntities[1].resource,
          addEntities[1].entitlement,
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
    <PanelTableForm<Entitlement>
      addEntities={addEntities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={[]}
      form={<form></form>}
      generateCells={(entitlement) => entitlement}
      removeEntities={[]}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
  await act(
    async () => await userEvent.type(screen.getByRole("searchbox"), "nothing"),
  );
  expect(
    screen.getByText("No entitlements match the search criteria."),
  ).toBeInTheDocument();
});

test("does not display removed entities", async () => {
  const removeEntities = [
    {
      entitlement: "can_edit",
      entity: "moderators",
      resource: "collection",
    },
  ];
  const existingEntities = [
    {
      entitlement: "can_edit",
      entity: "moderators",
      resource: "collection",
    },
    {
      entitlement: "can_remove",
      entity: "staff",
      resource: "team",
    },
  ];
  renderComponent(
    <PanelTableForm<Entitlement>
      addEntities={[]}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={existingEntities}
      form={<form></form>}
      generateCells={(entitlement) => entitlement}
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
      entitlement: "can_view",
      entity: "admins",
      resource: "group",
    },
    {
      entitlement: "can_read",
      entity: "editors",
      resource: "client",
    },
    {
      entitlement: "can_read",
      entity: "admins",
      resource: "client",
    },
  ];
  const setAddEntities = vi.fn();
  renderComponent(
    <PanelTableForm<Entitlement>
      addEntities={entities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={[]}
      form={<form></form>}
      generateCells={(entitlement) => entitlement}
      removeEntities={[]}
      setAddEntities={setAddEntities}
      setRemoveEntities={vi.fn()}
    />,
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: "Remove entitlement" })[0],
      ),
  );
  expect(setAddEntities).toHaveBeenCalledWith([
    {
      entitlement: "can_read",
      entity: "editors",
      resource: "client",
    },
    {
      entitlement: "can_read",
      entity: "admins",
      resource: "client",
    },
  ]);
});

test("can remove existing entities", async () => {
  const existingEntities = [
    {
      entitlement: "can_edit",
      entity: "moderators",
      resource: "collection",
    },
    {
      entitlement: "can_remove",
      entity: "staff",
      resource: "team",
    },
  ];
  const setRemoveEntities = vi.fn();
  renderComponent(
    <PanelTableForm<Entitlement>
      addEntities={[]}
      existingEntities={existingEntities}
      setAddEntities={vi.fn()}
      removeEntities={[
        {
          entitlement: "can_remove",
          entity: "staff",
          resource: "team",
        },
      ]}
      setRemoveEntities={setRemoveEntities}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      form={<form></form>}
      generateCells={(entitlement) => entitlement}
    />,
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: "Remove entitlement" })[0],
      ),
  );
  expect(setRemoveEntities).toHaveBeenCalledWith([
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
    <PanelTableForm<Entitlement>
      error="Uh oh!"
      addEntities={[]}
      columns={COLUMNS}
      entityName="entitlement"
      entityEqual={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      entityMatches={(entity, search) => entity.entitlement.includes(search)}
      existingEntities={[]}
      form={<form></form>}
      generateCells={(entitlement) => entitlement}
      removeEntities={[]}
      setAddEntities={vi.fn()}
      setRemoveEntities={vi.fn()}
    />,
  );
  await hasNotification("Uh oh!");
});
