import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import Fields from "./Fields";
import { Label, type FormFields } from "./types";

test("should show the correct fields", () => {
  renderComponent(
    <Formik<FormFields>
      initialValues={{
        email: "test@email.com",
        firstName: "First",
        lastName: "Last",
      }}
      onSubmit={vi.fn()}
    >
      <Fields setIsDirty={vi.fn()} />
    </Formik>,
  );
  expect(screen.getByRole("textbox", { name: Label.EMAIL })).toHaveValue(
    "test@email.com",
  );
  expect(screen.getByRole("textbox", { name: Label.FIRST_NAME })).toHaveValue(
    "First",
  );
  expect(screen.getByRole("textbox", { name: Label.LAST_NAME })).toHaveValue(
    "Last",
  );
});

test("should set isDirty to true when fields are modified", async () => {
  const mockIsDirty = vi.fn();
  renderComponent(
    <Formik<FormFields> initialValues={{ email: "" }} onSubmit={vi.fn()}>
      <Fields setIsDirty={mockIsDirty} />
    </Formik>,
  );
  expect(mockIsDirty).toHaveBeenCalledWith(false);
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.EMAIL }),
    "test@email.com",
  );
  expect(mockIsDirty).toHaveBeenCalledWith(true);
});

test("should set isDirty to false when fields are reset", async () => {
  const mockIsDirty = vi.fn();
  renderComponent(
    <Formik<FormFields>
      initialValues={{ email: "test@email.com" }}
      onSubmit={vi.fn()}
    >
      <Fields setIsDirty={mockIsDirty} />
    </Formik>,
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.EMAIL }),
    "test-modified@email.com",
  );
  expect(mockIsDirty).toHaveBeenCalledWith(true);
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.EMAIL }),
    "test@example.com",
  );
  expect(mockIsDirty).toHaveBeenCalledWith(false);
});
