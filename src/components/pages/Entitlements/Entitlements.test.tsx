import { screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, delay } from "msw";
import { setupServer } from "msw/node";

import {
  getGetEntitlementsMockHandler,
  getGetEntitlementsMockHandler404,
  getGetEntitlementsResponseMock,
} from "api/entitlements/entitlements.msw";
import { EntityTablePaginationLabel } from "components/EntityTable/EntityTablePagination";
import { TestId as NoEntityCardTestId } from "components/NoEntityCard";
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { mockEntityEntitlement } from "test/mocks/entitlements";
import { customWithin } from "test/queries/within";
import { renderComponent } from "test/utils";
import { Endpoint } from "types/api";

import Entitlements from "./Entitlements";
import { Label as EntitlementsLabel, Label } from "./types";

const mockEntitlementsData = getGetEntitlementsResponseMock({
  _meta: {
    page: 0,
    size: 10,
  },
  data: [
    mockEntityEntitlement({ entity_type: "controller", entitlement: "admin" }),
    ...Array.from({ length: 9 }, mockEntityEntitlement),
  ],
});
const mockApiServer = setupServer(
  getGetEntitlementsMockHandler(mockEntitlementsData),
  ...getGetActualCapabilitiesMock(),
);

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
  mockApiServer.use(
    http.get(`*${Endpoint.ENTITLEMENTS}`, async () => {
      await delay(100);
    }),
  );
  renderComponent(<Entitlements />);
  expect(
    await screen.findByText(EntitlementsLabel.FETCHING_ENTITLEMENTS),
  ).toBeInTheDocument();
});

test("should display correct entitlement data after fetching entitlements", async () => {
  renderComponent(<Entitlements />);
  const row = await screen.findByRole("row", { name: /controller/ });
  expect(
    customWithin(row).getCellByHeader(Label.HEADER_ENTITY),
  ).toHaveTextContent("controller");
  expect(
    customWithin(row).getCellByHeader(Label.HEADER_ENTITLEMENT),
  ).toHaveTextContent("admin");
});

test("search entitlements", async () => {
  let getDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "GET" &&
      requestClone.url.endsWith(
        "/entitlements?filter=entitlement1&size=10&page=0",
      )
    ) {
      getDone = true;
    }
  });
  renderComponent(<Entitlements />);
  await userEvent.type(screen.getByRole("searchbox"), "entitlement1{enter}");
  await waitFor(() => expect(getDone).toBeTruthy());
});

test("paginates", async () => {
  let getDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "GET" &&
      requestClone.url.endsWith("/entitlements?size=10&page=1")
    ) {
      getDone = true;
    }
  });
  renderComponent(<Entitlements />);
  await userEvent.click(
    await screen.findByRole("button", {
      name: EntityTablePaginationLabel.NEXT_PAGE,
    }),
  );
  await waitFor(() => expect(getDone).toBeTruthy());
});

test("should display no entitlements message", async () => {
  mockApiServer.use(
    getGetEntitlementsMockHandler(getGetEntitlementsResponseMock({ data: [] })),
  );
  renderComponent(<Entitlements />);
  const noEntitlementsCard = await screen.findByTestId(
    NoEntityCardTestId.NO_ENTITY_CARD,
  );
  expect(
    within(noEntitlementsCard).getByText(EntitlementsLabel.NO_ENTITLEMENTS),
  ).toBeInTheDocument();
});

test("should display error notification and refetch data", async () => {
  mockApiServer.use(getGetEntitlementsMockHandler404());
  renderComponent(<Entitlements />);
  const entitlementsErrorNotification = await screen.findByText(
    EntitlementsLabel.FETCHING_ENTITLEMENTS_ERROR,
    { exact: false },
  );
  expect(entitlementsErrorNotification.childElementCount).toBe(1);
  const refetchButton = entitlementsErrorNotification.children[0];
  mockApiServer.use(getGetEntitlementsMockHandler(mockEntitlementsData));
  expect(refetchButton).toHaveTextContent("refetch");
  await userEvent.click(refetchButton);
  expect(
    await screen.findByText(EntitlementsLabel.FETCHING_ENTITLEMENTS),
  ).toBeInTheDocument();
  const rows = await screen.findAllByRole("row");
  expect(rows).toHaveLength(11);
});
