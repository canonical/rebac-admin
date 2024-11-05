import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import { FieldsLabel } from "../Fields";

import Fields from "./Fields";
import type { FormFields } from "./types";

test("should set the dirty state", async () => {
  const setIsDirty = vi.fn();
  renderComponent(
    <Formik<FormFields>
      initialValues={{ name: "initialname" }}
      onSubmit={vi.fn()}
    >
      <Fields setIsDirty={setIsDirty} />
    </Formik>,
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: FieldsLabel.NAME }),
    "a",
  );
  expect(setIsDirty).toHaveBeenLastCalledWith(true);
  await userEvent.type(
    screen.getByRole("textbox", { name: FieldsLabel.NAME }),
    "{backspace}",
  );
  expect(setIsDirty).toHaveBeenLastCalledWith(false);
});
