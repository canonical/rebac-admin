import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import EntityTable from "./EntityTable";
import { Label } from "./types";

type Entity = {
  id: string;
  name: string;
};

test("it appends checkbox and actions headers", async () => {
  renderComponent(
    <EntityTable<Entity>
      checkboxesDisabled={false}
      columns={[
        {
          Header: "name",
          accessor: "name",
        },
      ]}
      entities={[{ id: "1", name: "name1" }]}
      emptyMsg="None!"
      generateColumns={({ name }) => ({ name })}
      onDelete={vi.fn()}
      onEdit={vi.fn()}
      selected={{
        handleSelectEntity: vi.fn(),
        handleSelectAllEntities: vi.fn(),
        selectedEntities: [],
        areAllEntitiesSelected: false,
      }}
    />,
  );
  expect(
    within(screen.getAllByRole("columnheader")[0]).getByRole("checkbox", {
      name: Label.SELECT_ALL,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("columnheader", { name: "name" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("columnheader", { name: Label.HEADER_ACTIONS }),
  ).toBeInTheDocument();
});

test("displays the indeterminate state in the header", async () => {
  renderComponent(
    <EntityTable<Entity>
      checkboxesDisabled={false}
      columns={[
        {
          Header: "name",
          accessor: "name",
        },
      ]}
      entities={[
        { id: "1", name: "name1" },
        { id: "2", name: "name2" },
      ]}
      emptyMsg="None!"
      generateColumns={({ name }) => ({ name })}
      onDelete={vi.fn()}
      onEdit={vi.fn()}
      selected={{
        handleSelectEntity: vi.fn(),
        handleSelectAllEntities: vi.fn(),
        selectedEntities: ["2"],
        areAllEntitiesSelected: false,
      }}
    />,
  );
  expect(
    within(screen.getAllByRole("columnheader")[0]).getByRole("checkbox", {
      name: Label.SELECT_ALL,
    }),
  ).toHaveAttribute("indeterminate");
});

test("displays checkbox and actions", async () => {
  renderComponent(
    <EntityTable<Entity>
      checkboxesDisabled={false}
      columns={[
        {
          Header: "name",
          accessor: "name",
        },
      ]}
      entities={[{ id: "1", name: "name1" }]}
      emptyMsg="None!"
      generateColumns={({ name }) => ({ name })}
      onDelete={vi.fn()}
      onEdit={vi.fn()}
      selected={{
        handleSelectEntity: vi.fn(),
        handleSelectAllEntities: vi.fn(),
        selectedEntities: [],
        areAllEntitiesSelected: false,
      }}
    />,
  );
  expect(
    within(screen.getAllByRole("cell")[0]).getByRole("checkbox"),
  ).toBeInTheDocument();
  expect(screen.getByRole("cell", { name: "name1" })).toBeInTheDocument();
  expect(
    screen.getByRole("cell", { name: Label.ACTION_MENU }),
  ).toBeInTheDocument();
});

test("calls the onEdit prop", async () => {
  const onEdit = vi.fn();
  renderComponent(
    <EntityTable<Entity>
      checkboxesDisabled={false}
      columns={[
        {
          Header: "name",
          accessor: "name",
        },
      ]}
      entities={[{ id: "1", name: "name1" }]}
      emptyMsg="None!"
      generateColumns={({ name }) => ({ name })}
      onDelete={vi.fn()}
      onEdit={onEdit}
      selected={{
        handleSelectEntity: vi.fn(),
        handleSelectAllEntities: vi.fn(),
        selectedEntities: [],
        areAllEntitiesSelected: false,
      }}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: Label.ACTION_MENU }),
  );
  await userEvent.click(screen.getByRole("button", { name: Label.EDIT }));
  expect(onEdit).toHaveBeenCalledWith({ id: "1", name: "name1" });
});

test("calls the onDelete prop", async () => {
  const onDelete = vi.fn();
  renderComponent(
    <EntityTable<Entity>
      checkboxesDisabled={false}
      columns={[
        {
          Header: "name",
          accessor: "name",
        },
      ]}
      entities={[{ id: "1", name: "name1" }]}
      emptyMsg="None!"
      generateColumns={({ name }) => ({ name })}
      onDelete={onDelete}
      onEdit={vi.fn()}
      selected={{
        handleSelectEntity: vi.fn(),
        handleSelectAllEntities: vi.fn(),
        selectedEntities: [],
        areAllEntitiesSelected: false,
      }}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: Label.ACTION_MENU }),
  );
  await userEvent.click(screen.getByRole("button", { name: Label.DELETE }));
  expect(onDelete).toHaveBeenCalledWith({ id: "1", name: "name1" });
});

test("can disable the checkboxes", async () => {
  renderComponent(
    <EntityTable<Entity>
      checkboxesDisabled={true}
      columns={[
        {
          Header: "name",
          accessor: "name",
        },
      ]}
      entities={[{ id: "1", name: "name1" }]}
      emptyMsg="None!"
      generateColumns={({ name }) => ({ name })}
      onDelete={vi.fn()}
      onEdit={vi.fn()}
      selected={{
        handleSelectEntity: vi.fn(),
        handleSelectAllEntities: vi.fn(),
        selectedEntities: [],
        areAllEntitiesSelected: false,
      }}
    />,
  );
  expect(
    within(screen.getAllByRole("columnheader")[0]).getByRole("checkbox", {
      name: Label.SELECT_ALL,
    }),
  ).toBeDisabled();
  expect(
    within(screen.getAllByRole("cell")[0]).getByRole("checkbox"),
  ).toBeDisabled();
});
