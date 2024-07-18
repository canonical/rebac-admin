import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";

import {
  getGetIdentitiesItemMockHandler,
  getGetIdentitiesItemResponseMock,
} from "api/identities/identities.msw";
import { getGetActualCapabilitiesMock } from "mocks/capabilities";
import { renderComponent } from "test/utils";
import urls from "urls";

import SummaryTab from "./SummaryTab";

const mockUserData = getGetIdentitiesItemResponseMock({
  id: "user1",
  addedBy: "within",
  email: "pfft",
  firstName: "first",
  lastName: "last",
  source: "noteworthy",
});
const mockApiServer = setupServer(
  getGetIdentitiesItemMockHandler(mockUserData),
  ...getGetActualCapabilitiesMock(),
);

const path = urls.users.user.index(null);
const url = urls.users.user.index({ id: "user1" });

beforeAll(() => {
  mockApiServer.listen();
});

afterEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
});

test("displays full name", async () => {
  renderComponent(<SummaryTab />, {
    path,
    url,
  });
  expect(await screen.findByText("first last")).toBeInTheDocument();
});
