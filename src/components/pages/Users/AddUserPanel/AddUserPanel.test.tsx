import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getPostIdentitiesMockHandler,
  getPostIdentitiesResponseMock,
} from "api/identities/identities.msw";
import { hasToast, renderComponent } from "test/utils";

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
test("should add a group", async () => {
  renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  await hasToast('User with email "test@test.com" was created.', "positive");
});
