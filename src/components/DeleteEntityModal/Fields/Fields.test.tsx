import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import Fields from "./Fields";

test("initially sets the valid state", async () => {
  const setIsValid = vi.fn();
  renderComponent(
    <Formik onSubmit={vi.fn()} initialValues={{ confirmationMessage: "" }}>
      <Fields
        confirmationMessage="delete 1 test"
        entity="test"
        entityCount="1 test"
        setIsValid={setIsValid}
      />
    </Formik>,
  );
  expect(setIsValid).toHaveBeenCalledWith(false);
});

test("updates the valid state", async () => {
  const setIsValid = vi.fn();
  renderComponent(
    <Formik onSubmit={vi.fn()} initialValues={{ confirmationMessage: "" }}>
      <Fields
        confirmationMessage="delete 1 test"
        entity="test"
        entityCount="1 test"
        setIsValid={setIsValid}
      />
    </Formik>,
  );
  await userEvent.type(screen.getByRole("textbox"), "delete 1 test");
  expect(setIsValid).toHaveBeenCalledWith(true);
});
