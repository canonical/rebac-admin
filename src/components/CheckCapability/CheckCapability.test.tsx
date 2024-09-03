import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";

import { CapabilityAction } from "hooks/capabilities";
import {
  getGetActualCapabilitiesMock,
  getGetCapabilitiesErrorMockHandler,
} from "test/mocks/capabilities";
import { renderComponent } from "test/utils";
import { Endpoint } from "types/api";

import CheckCapability from "./CheckCapability";
import { Label } from "./types";

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

test("should display spinner on mount", async () => {
  renderComponent(
    <CheckCapability endpoint={Endpoint.META} action={CapabilityAction.READ}>
      Mocked META data
    </CheckCapability>,
  );
  expect(screen.getByTestId(Label.LOADING)).toBeInTheDocument();
});

test("should display data if user has capability", async () => {
  renderComponent(
    <CheckCapability endpoint={Endpoint.META} action={CapabilityAction.READ}>
      Mocked META data
    </CheckCapability>,
  );
  expect(await screen.findByText("Mocked META data")).toBeInTheDocument();
});

test("should display placeholder message if user has no capability", async () => {
  mockApiServer.use(...getGetActualCapabilitiesMock([]));
  renderComponent(
    <CheckCapability endpoint={Endpoint.META} action={CapabilityAction.READ}>
      Mocked META data
    </CheckCapability>,
  );
  expect(await screen.findByText(Label.DISABLED_FEATURE)).toBeInTheDocument();
});

test("should display error notification and refetch capability", async () => {
  mockApiServer.use(getGetCapabilitiesErrorMockHandler());
  renderComponent(
    <CheckCapability endpoint={Endpoint.META} action={CapabilityAction.READ}>
      Mocked META data
    </CheckCapability>,
  );
  const capabilityErrorNotification = await screen.findByText(
    Label.CHECK_CAPABILITY_ERROR,
    { exact: false },
  );
  expect(capabilityErrorNotification.childElementCount).toBe(1);
  const refetchButton = capabilityErrorNotification.children[0];
  mockApiServer.use(...getGetActualCapabilitiesMock());
  expect(refetchButton).toHaveTextContent("refetch");
  await userEvent.click(refetchButton);
  expect(await screen.findByText("Mocked META data")).toBeInTheDocument();
});
