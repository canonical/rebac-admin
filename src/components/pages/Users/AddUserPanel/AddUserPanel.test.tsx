import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getPostIdentitiesMockHandler,
  getPostIdentitiesMockHandler400,
  getPostIdentitiesResponseMock,
  getPostIdentitiesResponseMock400,
} from "api/identities/identities.msw";
import { hasToast, renderComponent, hasNotification } from "test/utils";

import { UserPanelLabel } from "../UserPanel";

import AddUserPanel from "./AddUserPanel";

const mockIdentitiesData = getPostIdentitiesResponseMock({
  email: "test@test.com",
});

const mockApiServer = setupServer(
  getPostIdentitiesMockHandler(mockIdentitiesData),
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

// eslint-disable-next-line vitest/expect-expect
test("should add a user", async () => {
  renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  await hasToast('User with email "test@test.com" was created.', "positive");
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding a user", async () => {
  mockApiServer.use(
    getPostIdentitiesMockHandler400(
      getPostIdentitiesResponseMock400({
        message: "That local user already exists",
      }),
    ),
  );
  renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  await hasNotification(
    "Unable to create local user: That local user already exists",
    "negative",
  );
});
