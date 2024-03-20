import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, delay, http } from "msw";
import { setupServer } from "msw/node";

import { CapabilityAction } from "hooks/capabilities";
import { getActualCapabilitiesMock } from "mocks/handlers";
import { renderComponent } from "test/utils";
import { Endpoint } from "types/api";

import CheckCapability from "./CheckCapability";
import { Label } from "./types";

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

test("should display data if user has capability", async () => {
  renderComponent(
    <CheckCapability endpoint={Endpoint.META} action={CapabilityAction.READ}>
      Mocked META data
    </CheckCapability>,
  );
  expect(screen.getByTestId(Label.LOADING)).toBeInTheDocument();
  expect(await screen.findByText("Mocked META data")).toBeInTheDocument();
});

test("should display placeholder message if user has no capability", async () => {
  mockApiServer.use(...getActualCapabilitiesMock([]));
  renderComponent(
    <CheckCapability endpoint={Endpoint.META} action={CapabilityAction.READ}>
      Mocked META data
    </CheckCapability>,
  );
  expect(screen.getByTestId(Label.LOADING)).toBeInTheDocument();
  expect(
    await screen.findByText("This feature is not enabled."),
  ).toBeInTheDocument();
});

test("should display error notification and refetch capability", async () => {
  mockApiServer.use(
    http.get(`*${Endpoint.CAPABILITIES}`, async () => {
      await delay(900);
      return new HttpResponse(null, { status: 404 });
    }),
  );
  renderComponent(
    <CheckCapability endpoint={Endpoint.META} action={CapabilityAction.READ}>
      Mocked META data
    </CheckCapability>,
  );
  expect(screen.getByTestId(Label.LOADING)).toBeInTheDocument();
  const capabilityErrorNotification = await screen.findByText(
    Label.ERROR_MESSAGE,
    { exact: false },
  );
  expect(capabilityErrorNotification.childElementCount).toBe(1);
  const refetchButton = capabilityErrorNotification.children[0];
  mockApiServer.use(...getActualCapabilitiesMock());
  expect(refetchButton).toHaveTextContent("refetch");
  await act(() => userEvent.click(refetchButton));
  expect(screen.getByTestId(Label.LOADING)).toBeInTheDocument();
  expect(await screen.findByText("Mocked META data")).toBeInTheDocument();
});
