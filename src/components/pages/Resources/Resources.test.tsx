import { screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, delay } from "msw";
import { setupServer } from "msw/node";

import {
  getGetResourcesMockHandler,
  getGetResourcesMockHandler404,
  getGetResourcesResponseMock,
} from "api/resources/resources.msw";
import { EntityTablePaginationLabel } from "components/EntityTable/EntityTablePagination";
import { TestId as NoEntityCardTestId } from "components/NoEntityCard";
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { mockEntity, mockResource } from "test/mocks/resources";
import { customWithin } from "test/queries/within";
import { renderComponent } from "test/utils";
import { Endpoint } from "types/api";

import Resources from "./Resources";
import { Label as ResourcesLabel, Label } from "./types";

const mockResourcesData = getGetResourcesResponseMock({
  _meta: {
    page: 0,
    size: 10,
  },
  data: [
    mockResource({
      entity: mockEntity({ name: "controller1", type: "controller" }),
      parent: mockEntity({ name: "main-controller" }),
    }),
    ...Array.from({ length: 9 }, () => mockResource({ parent: mockEntity() })),
  ],
});
const mockApiServer = setupServer(
  getGetResourcesMockHandler(mockResourcesData),
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
    http.get(`*${Endpoint.RESOURCES}`, async () => {
      await delay(100);
    }),
  );
  renderComponent(<Resources />);
  expect(
    await screen.findByText(ResourcesLabel.FETCHING_RESOURCES),
  ).toBeInTheDocument();
});

test("should display correct resource data after fetching resources", async () => {
  renderComponent(<Resources />);
  const row = await screen.findByRole("row", { name: /controller1/ });
  expect(
    customWithin(row).getCellByHeader(Label.HEADER_ENTITY),
  ).toHaveTextContent("controller");
  expect(
    customWithin(row).getCellByHeader(Label.HEADER_RESOURCE),
  ).toHaveTextContent("controller1");
  expect(
    customWithin(row).getCellByHeader(Label.HEADER_PARENT),
  ).toHaveTextContent("main-controller");
});

test("paginates", async () => {
  let getDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "GET" &&
      requestClone.url.endsWith("/resources?size=10&page=1")
    ) {
      getDone = true;
    }
  });
  renderComponent(<Resources />);
  await userEvent.click(
    await screen.findByRole("button", {
      name: EntityTablePaginationLabel.NEXT_PAGE,
    }),
  );
  await waitFor(() => expect(getDone).toBeTruthy());
});

test("should display no resources message", async () => {
  mockApiServer.use(
    getGetResourcesMockHandler(getGetResourcesResponseMock({ data: [] })),
  );
  renderComponent(<Resources />);
  const noResourcesCard = await screen.findByTestId(
    NoEntityCardTestId.NO_ENTITY_CARD,
  );
  expect(
    within(noResourcesCard).getByText(ResourcesLabel.NO_RESOURCES),
  ).toBeInTheDocument();
});

test("should display error notification and refetch data", async () => {
  mockApiServer.use(getGetResourcesMockHandler404());
  renderComponent(<Resources />);
  const resourcesErrorNotification = await screen.findByText(
    ResourcesLabel.FETCHING_RESOURCES_ERROR,
    { exact: false },
  );
  expect(resourcesErrorNotification.childElementCount).toBe(1);
  const refetchButton = resourcesErrorNotification.children[0];
  mockApiServer.use(getGetResourcesMockHandler(mockResourcesData));
  expect(refetchButton).toHaveTextContent("refetch");
  await userEvent.click(refetchButton);
  expect(
    await screen.findByText(ResourcesLabel.FETCHING_RESOURCES),
  ).toBeInTheDocument();
  const rows = await screen.findAllByRole("row");
  expect(rows).toHaveLength(11);
});
