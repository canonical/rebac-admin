import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";

import { Label as CheckCapabilityLabel } from "components/CheckCapability";
import { getActualCapabilitiesMock } from "mocks/handlers";
import { renderComponent } from "test/utils";
import { Endpoint } from "types/api";

import Content from "./Content";

const mockApiServer = setupServer(...getActualCapabilitiesMock());

beforeAll(() => {
  mockApiServer.listen();
});

beforeEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
});

test("should display content", async () => {
  const title = "Mock content title";
  const content = "This is the content!";
  renderComponent(
    <Content title={title} endpoint={Endpoint.META}>
      <p>{content}</p>
    </Content>,
  );
  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.getByTestId(CheckCapabilityLabel.LOADING)).toBeInTheDocument();
  expect((await screen.findByText(content)).closest("div")).toHaveClass(
    "l-content",
  );
});
