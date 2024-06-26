import { FormikField } from "@canonical/react-components";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form, Formik } from "formik";
import { vi } from "vitest";
import * as Yup from "yup";

import { renderComponent } from "test/utils";

import FormikSubmitButton from "./FormikSubmitButton";

test("submits the form", async () => {
  const onSubmit = vi.fn();
  renderComponent(
    <Formik initialValues={{ resource: "" }} onSubmit={onSubmit}>
      <Form>
        <FormikField name="resource" type="text" />
        <FormikSubmitButton>Go!</FormikSubmitButton>
      </Form>
    </Formik>,
  );
  await userEvent.type(screen.getByRole("textbox"), "hello");
  await userEvent.click(screen.getByRole("button", { name: "Go!" }));
  expect(onSubmit).toHaveBeenCalled();
});

test("can be manually disabled", async () => {
  renderComponent(
    <Formik initialValues={{}} onSubmit={vi.fn()}>
      <Form>
        <FormikSubmitButton disabled>Go!</FormikSubmitButton>
      </Form>
    </Formik>,
  );
  expect(screen.getByRole("button", { name: "Go!" })).toBeDisabled();
});

test("is disabled if the form is not dirty", async () => {
  const schema = Yup.object().shape({
    resource: Yup.number(),
  });
  renderComponent(
    <Formik
      initialValues={{ resource: "" }}
      onSubmit={vi.fn()}
      validationSchema={schema}
    >
      <Form>
        <FormikField name="resource" type="text" />
        <FormikSubmitButton>Go!</FormikSubmitButton>
      </Form>
    </Formik>,
  );
  expect(screen.getByRole("button", { name: "Go!" })).toBeDisabled();
});

test("is disabled if there are errors", async () => {
  const schema = Yup.object().shape({
    resource: Yup.number(),
  });
  renderComponent(
    <Formik
      initialValues={{ resource: "" }}
      onSubmit={vi.fn()}
      validationSchema={schema}
    >
      <Form>
        <FormikField name="resource" type="text" />
        <FormikSubmitButton>Go!</FormikSubmitButton>
      </Form>
    </Formik>,
  );
  await userEvent.type(screen.getByRole("textbox"), "hello");
  expect(screen.getByRole("button", { name: "Go!" })).toBeDisabled();
});

test("can be enabled", async () => {
  const schema = Yup.object().shape({
    resource: Yup.string(),
  });
  renderComponent(
    <Formik
      initialValues={{ resource: "" }}
      onSubmit={vi.fn()}
      validationSchema={schema}
    >
      <Form>
        <FormikField name="resource" type="text" />
        <FormikSubmitButton>Go!</FormikSubmitButton>
      </Form>
    </Formik>,
  );
  await userEvent.type(screen.getByRole("textbox"), "hello");
  expect(screen.getByRole("button", { name: "Go!" })).not.toBeDisabled();
});

test("can override disabled", async () => {
  renderComponent(
    <Formik initialValues={{}} onSubmit={vi.fn()}>
      <Form>
        <FormikSubmitButton enabled disabled>
          Go!
        </FormikSubmitButton>
      </Form>
    </Formik>,
  );
  expect(screen.getByRole("button", { name: "Go!" })).not.toBeDisabled();
});

test("can override disabled when the form is dirty", async () => {
  const schema = Yup.object().shape({
    resource: Yup.number(),
  });
  renderComponent(
    <Formik
      initialValues={{ resource: "" }}
      onSubmit={vi.fn()}
      validationSchema={schema}
    >
      <Form>
        <FormikField name="resource" type="text" />
        <FormikSubmitButton enabled>Go!</FormikSubmitButton>
      </Form>
    </Formik>,
  );
  expect(screen.getByRole("button", { name: "Go!" })).not.toBeDisabled();
});

test("can override disabled when there are errors", async () => {
  const schema = Yup.object().shape({
    resource: Yup.number(),
  });
  renderComponent(
    <Formik
      initialValues={{ resource: "" }}
      onSubmit={vi.fn()}
      validationSchema={schema}
    >
      <Form>
        <FormikField name="resource" type="text" />
        <FormikSubmitButton enabled>Go!</FormikSubmitButton>
      </Form>
    </Formik>,
  );
  await userEvent.type(screen.getByRole("textbox"), "hello");
  expect(screen.getByRole("button", { name: "Go!" })).not.toBeDisabled();
});
