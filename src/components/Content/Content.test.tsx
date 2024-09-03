import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import { Label as CheckCapabilityLabel } from "components/CheckCapability";
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { renderComponent } from "test/utils";
import { Endpoint } from "types/api";

import Content from "./Content";

const mockApiServer = setupServer(...getGetActualCapabilitiesMock());

beforeAll(() => {
  mockApiServer.listen();
});

afterEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
});

test("should show spinner on mount", () => {
  const title = "Mock content title";
  const content = "This is the content!";
  renderComponent(
    <Content title={title} endpoint={Endpoint.META}>
      <p>{content}</p>
    </Content>,
  );
  expect(screen.getByTestId(CheckCapabilityLabel.LOADING)).toBeInTheDocument();
});

test("should display content if capability is enabled", async () => {
  const title = "Mock content title";
  const content = "This is the content!";
  renderComponent(
    <Content title={title} endpoint={Endpoint.META}>
      <p>{content}</p>
    </Content>,
  );
  expect(screen.getByText(title)).toBeInTheDocument();
  expect((await screen.findByText(content)).closest("div")).toHaveClass(
    "l-content",
  );
});

test("should not display content if capability is disabled", async () => {
  mockApiServer.use(...getGetActualCapabilitiesMock([]));
  const title = "Mock content title";
  const content = "This is the content!";
  renderComponent(
    <Content title={title} endpoint={Endpoint.META}>
      <p>{content}</p>
    </Content>,
  );
  expect(screen.getByText(title)).toBeInTheDocument();
  expect(
    await screen.findByText(CheckCapabilityLabel.DISABLED_FEATURE),
  ).toBeInTheDocument();
  expect(screen.queryByText(content)).not.toBeInTheDocument();
});

test("displays a search box", async () => {
  mockApiServer.use(...getGetActualCapabilitiesMock([]));
  renderComponent(
    <Content
      title="Mock content title"
      endpoint={Endpoint.META}
      onSearch={vi.fn()}
    />,
  );
  expect(screen.getByRole("searchbox")).toBeInTheDocument();
});

test("calls the search callback", async () => {
  mockApiServer.use(...getGetActualCapabilitiesMock([]));
  const onSearch = vi.fn();
  renderComponent(
    <Content
      title="Mock content title"
      endpoint={Endpoint.META}
      onSearch={onSearch}
    />,
  );
  await userEvent.type(screen.getByRole("searchbox"), " group1 {enter}");
  expect(onSearch).toHaveBeenCalledWith("group1");
});
