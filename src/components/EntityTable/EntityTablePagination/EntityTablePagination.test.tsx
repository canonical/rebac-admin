import { faker } from "@faker-js/faker";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import EntityTablePagination from "./EntityTablePagination";
import { Label } from "./types";

test("displays page number pagination", () => {
  renderComponent(
    <EntityTablePagination
      pagination={{
        hasNextPage: true,
        hasPreviousPage: true,
        nextPage: vi.fn(),
        pageData: {
          page: 0,
          size: 10,
        },
        previousPage: vi.fn(),
        setPage: vi.fn(),
        resetPage: vi.fn(),
        setResponse: vi.fn(),
        setSize: vi.fn(),
      }}
    />,
  );
  expect(screen.getByRole("spinbutton")).toHaveValue(1);
  expect(
    screen
      .getByRole("button", { name: Label.PREVIOUS_PAGE })
      .querySelector(".p-icon--chevron-left"),
  ).toBeInTheDocument();
});

test("displays token pagination", () => {
  renderComponent(
    <EntityTablePagination
      pagination={{
        hasNextPage: true,
        hasPreviousPage: true,
        nextPage: vi.fn(),
        pageData: {
          nextToken: faker.word.sample(),
          size: 10,
        },
        previousPage: null,
        setPage: vi.fn(),
        resetPage: vi.fn(),
        setResponse: vi.fn(),
        setSize: vi.fn(),
      }}
    />,
  );
  expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  expect(
    screen
      .getByRole("button", { name: Label.PREVIOUS_PAGE })
      .querySelector(".p-icon--back-to-top"),
  ).toBeInTheDocument();
});

test("handles page input changes", async () => {
  const setPage = vi.fn();
  renderComponent(
    <EntityTablePagination
      pagination={{
        hasNextPage: true,
        hasPreviousPage: true,
        nextPage: vi.fn(),
        pageData: {
          page: 0,
          size: 10,
        },
        previousPage: vi.fn(),
        setPage,
        resetPage: vi.fn(),
        setResponse: vi.fn(),
        setSize: vi.fn(),
      }}
    />,
  );
  await userEvent.type(screen.getByRole("spinbutton"), "2");
  expect(setPage).toHaveBeenCalledWith(11);
});

test("handles next page", async () => {
  const nextPage = vi.fn();
  renderComponent(
    <EntityTablePagination
      pagination={{
        hasNextPage: true,
        hasPreviousPage: true,
        nextPage,
        pageData: {
          page: 0,
          size: 10,
        },
        previousPage: vi.fn(),
        setPage: vi.fn(),
        resetPage: vi.fn(),
        setResponse: vi.fn(),
        setSize: vi.fn(),
      }}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: Label.NEXT_PAGE }));
  expect(nextPage).toHaveBeenCalled();
});

test("handles previous page for number pagination", async () => {
  const previousPage = vi.fn();
  renderComponent(
    <EntityTablePagination
      pagination={{
        hasNextPage: true,
        hasPreviousPage: true,
        nextPage: vi.fn(),
        pageData: {
          page: 0,
          size: 10,
        },
        previousPage,
        setPage: vi.fn(),
        resetPage: vi.fn(),
        setResponse: vi.fn(),
        setSize: vi.fn(),
      }}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: Label.PREVIOUS_PAGE }),
  );
  expect(previousPage).toHaveBeenCalled();
});

test("handles previous page for token pagination", async () => {
  const resetPage = vi.fn();
  renderComponent(
    <EntityTablePagination
      pagination={{
        hasNextPage: true,
        hasPreviousPage: true,
        nextPage: vi.fn(),
        pageData: {
          nextToken: faker.word.sample(),
          size: 10,
        },
        previousPage: null,
        setPage: vi.fn(),
        resetPage,
        setResponse: vi.fn(),
        setSize: vi.fn(),
      }}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: Label.PREVIOUS_PAGE }),
  );
  expect(resetPage).toHaveBeenCalled();
});

test("changes page size", async () => {
  const setSize = vi.fn();
  renderComponent(
    <EntityTablePagination
      pagination={{
        hasNextPage: true,
        hasPreviousPage: true,
        nextPage: vi.fn(),
        pageData: {
          nextToken: faker.word.sample(),
          size: 10,
        },
        previousPage: vi.fn(),
        setPage: vi.fn(),
        resetPage: vi.fn(),
        setResponse: vi.fn(),
        setSize,
      }}
    />,
  );
  await userEvent.selectOptions(screen.getByRole("combobox"), "25");
  expect(setSize).toHaveBeenCalledWith(25);
});
