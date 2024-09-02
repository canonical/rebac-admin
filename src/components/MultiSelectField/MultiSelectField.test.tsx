import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import MultiSelectField from "./MultiSelectField";

describe("MultiSelectField", () => {
  test("calls onSearch", async () => {
    const onSearch = vi.fn();
    render(
      <MultiSelectField
        addEntities={[]}
        entities={[]}
        entityMatches={vi.fn()}
        entityName="role"
        generateItem={vi.fn()}
        onSearch={onSearch}
        removeEntities={[]}
        setAddEntities={vi.fn()}
        setRemoveEntities={vi.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole("combobox", {
        name: "Select roles",
      }),
    );
    await userEvent.type(
      within(screen.getByRole("listbox")).getByRole("searchbox"),
      "role1{enter}",
    );
    expect(onSearch).toHaveBeenCalledWith("role1");
  });

  test("displays a spinner while searching", async () => {
    const {
      result: { findSpinnerByLabel },
    } = renderComponent(
      <MultiSelectField
        addEntities={[]}
        entities={[]}
        entityMatches={vi.fn()}
        entityName="role"
        generateItem={vi.fn()}
        isLoading={true}
        onSearch={vi.fn()}
        removeEntities={[]}
        setAddEntities={vi.fn()}
        setRemoveEntities={vi.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole("combobox", {
        name: "Select roles",
      }),
    );
    await userEvent.type(
      within(screen.getByRole("listbox")).getByRole("searchbox"),
      "role1{enter}",
    );
    expect(await findSpinnerByLabel("Loading")).toBeInTheDocument();
  });

  test("displays items", async () => {
    render(
      <MultiSelectField
        addEntities={[]}
        entities={[{ name: "role1", id: "role123" }]}
        entityMatches={vi.fn()}
        entityName="role"
        generateItem={(role) => ({ label: role.name, value: role.id })}
        onSearch={vi.fn()}
        removeEntities={[]}
        setAddEntities={vi.fn()}
        setRemoveEntities={vi.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole("combobox", {
        name: "Select roles",
      }),
    );
    expect(
      screen.getByRole("checkbox", {
        name: "role1",
      }),
    ).toBeInTheDocument();
  });

  test("displays selected items", async () => {
    render(
      <MultiSelectField
        addEntities={[{ name: "role4", id: "role456" }]}
        entities={[
          { name: "role1", id: "role123" },
          { name: "role2", id: "role234" },
          { name: "role3", id: "role345" },
          { name: "role4", id: "role456" },
        ]}
        entityMatches={vi.fn()}
        entityName="role"
        existingEntities={[
          { name: "role2", id: "role234" },
          { name: "role3", id: "role345" },
        ]}
        generateItem={(role) => ({ label: role.name, value: role.id })}
        onSearch={vi.fn()}
        removeEntities={[{ name: "role2", id: "role234" }]}
        setAddEntities={vi.fn()}
        setRemoveEntities={vi.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole("combobox", {
        name: "Select roles",
      }),
    );
    expect(
      screen.getByRole("checkbox", {
        name: "role1",
      }),
    ).not.toBeChecked();
    // Should not be selected because it is in removeEntities.
    expect(
      screen.getByRole("checkbox", {
        name: "role2",
      }),
    ).not.toBeChecked();
    // Should be selected because it is in existingEntities.
    expect(
      screen.getByRole("checkbox", {
        name: "role3",
      }),
    ).toBeChecked();
    // Should be selected because it is in addEntities.
    expect(
      screen.getByRole("checkbox", {
        name: "role4",
      }),
    ).toBeChecked();
  });

  test("selects items", async () => {
    const setAddEntities = vi.fn();
    render(
      <MultiSelectField
        addEntities={[{ name: "role1", id: "role123" }]}
        entities={[
          { name: "role1", id: "role123" },
          { name: "role2", id: "role234" },
          { name: "role3", id: "role345" },
          { name: "role4", id: "role456" },
        ]}
        entityMatches={({ id }, { value }) => id === value}
        entityName="role"
        existingEntities={[]}
        generateItem={(role) => ({ label: role.name, value: role.id })}
        onSearch={vi.fn()}
        removeEntities={[]}
        setAddEntities={setAddEntities}
        setRemoveEntities={vi.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole("combobox", {
        name: "Select roles",
      }),
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "role2",
      }),
    );
    expect(setAddEntities).toHaveBeenCalledWith([
      { name: "role1", id: "role123" },
      { name: "role2", id: "role234" },
    ]);
  });

  test("selects existing items that were previously deselected", async () => {
    const setRemoveEntities = vi.fn();
    render(
      <MultiSelectField
        addEntities={[]}
        entities={[
          { name: "role1", id: "role123" },
          { name: "role2", id: "role234" },
          { name: "role3", id: "role345" },
          { name: "role4", id: "role456" },
        ]}
        entityMatches={({ id }, { value }) => id === value}
        entityName="role"
        existingEntities={[{ name: "role1", id: "role123" }]}
        generateItem={(role) => ({ label: role.name, value: role.id })}
        onSearch={vi.fn()}
        removeEntities={[
          { name: "role1", id: "role123" },
          { name: "role2", id: "role234" },
        ]}
        setAddEntities={vi.fn()}
        setRemoveEntities={setRemoveEntities}
      />,
    );
    await userEvent.click(
      screen.getByRole("combobox", {
        name: "Select roles",
      }),
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "role1",
      }),
    );
    expect(setRemoveEntities).toHaveBeenCalledWith([
      { name: "role2", id: "role234" },
    ]);
  });

  test("deselects items", async () => {
    const setAddEntities = vi.fn();
    render(
      <MultiSelectField
        addEntities={[
          { name: "role1", id: "role123" },
          { name: "role2", id: "role234" },
        ]}
        entities={[
          { name: "role1", id: "role123" },
          { name: "role2", id: "role234" },
          { name: "role3", id: "role345" },
          { name: "role4", id: "role456" },
        ]}
        entityMatches={({ id }, { value }) => id === value}
        entityName="role"
        existingEntities={[]}
        generateItem={(role) => ({ label: role.name, value: role.id })}
        onSearch={vi.fn()}
        removeEntities={[]}
        setAddEntities={setAddEntities}
        setRemoveEntities={vi.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole("combobox", {
        name: "Select roles",
      }),
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "role2",
      }),
    );
    expect(setAddEntities).toHaveBeenCalledWith([
      { name: "role1", id: "role123" },
    ]);
  });

  test("deselects existing items", async () => {
    const setRemoveEntities = vi.fn();
    render(
      <MultiSelectField
        addEntities={[]}
        entities={[
          { name: "role1", id: "role123" },
          { name: "role2", id: "role234" },
          { name: "role3", id: "role345" },
          { name: "role4", id: "role456" },
        ]}
        entityMatches={({ id }, { value }) => id === value}
        entityName="role"
        existingEntities={[{ name: "role1", id: "role123" }]}
        generateItem={(role) => ({ label: role.name, value: role.id })}
        onSearch={vi.fn()}
        removeEntities={[{ name: "role2", id: "role234" }]}
        setAddEntities={vi.fn()}
        setRemoveEntities={setRemoveEntities}
      />,
    );
    await userEvent.click(
      screen.getByRole("combobox", {
        name: "Select roles",
      }),
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "role1",
      }),
    );
    expect(setRemoveEntities).toHaveBeenCalledWith([
      { name: "role2", id: "role234" },
      { name: "role1", id: "role123" },
    ]);
  });
});
