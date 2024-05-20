import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form, Formik } from "formik";
import { vi } from "vitest";
import * as Yup from "yup";

import { renderComponent } from "test/utils";

import CleanFormikField from "./CleanFormikField";

test("does not display errors when the form is not dirty", async () => {
  const schema = Yup.object().shape({
    resource: Yup.number().min(100, "Too small!"),
  });
  renderComponent(
    <Formik
      initialValues={{ resource: "notanumber" }}
      onSubmit={vi.fn()}
      validationSchema={schema}
    >
      <Form>
        <CleanFormikField name="resource" type="number" />
      </Form>
    </Formik>,
  );
  const input = screen.getByRole("spinbutton");
  await act(async () => {
    await userEvent.type(input, "{tab}");
  });
  expect(input).not.toBeInvalid();
  expect(input).not.toHaveAccessibleErrorMessage("Too small!");
});

test("displays errors when the form is dirty", async () => {
  const schema = Yup.object().shape({
    resource: Yup.number().min(100, "Too small!"),
  });
  renderComponent(
    <Formik
      initialValues={{ resource: "" }}
      onSubmit={vi.fn()}
      validationSchema={schema}
    >
      <Form>
        <CleanFormikField name="resource" type="number" />
      </Form>
    </Formik>,
  );
  const input = screen.getByRole("spinbutton");
  await act(async () => {
    await userEvent.type(input, "99{tab}");
  });
  expect(input).toBeInvalid();
  expect(input).toHaveAccessibleErrorMessage("Too small!");
});
