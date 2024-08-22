import { NotificationSeverity } from "@canonical/react-components";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getGetEntitlementsMockHandler,
  getGetEntitlementsResponseMock,
} from "api/entitlements/entitlements.msw";
import {
  getPatchIdentitiesItemEntitlementsMockHandler,
  getPatchIdentitiesItemEntitlementsMockHandler400,
  getPatchIdentitiesItemRolesMockHandler,
  getPatchIdentitiesItemRolesMockHandler400,
  getPostIdentitiesMockHandler,
  getPostIdentitiesMockHandler400,
  getPostIdentitiesResponseMock,
  getPostIdentitiesResponseMock400,
} from "api/identities/identities.msw";
import {
  getGetResourcesMockHandler,
  getGetResourcesResponseMock,
} from "api/resources/resources.msw";
import {
  getGetRolesMockHandler,
  getGetRolesResponseMock,
} from "api/roles/roles.msw";
import { EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { EntitlementPanelFormFieldsLabel } from "components/EntitlementsPanelForm/Fields";
import { Label as RolesPanelFormLabel } from "components/pages/Groups/RolesPanelForm";
import { hasToast, renderComponent, hasNotification } from "test/utils";

import { UserPanelLabel } from "../UserPanel";

import AddUserPanel from "./AddUserPanel";
import { Label } from "./types";

const mockIdentitiesData = getPostIdentitiesResponseMock({
  id: "user123",
  email: "test@test.com",
});

const mockApiServer = setupServer(
  getPostIdentitiesMockHandler(mockIdentitiesData),
  getPatchIdentitiesItemRolesMockHandler(),
  getPatchIdentitiesItemEntitlementsMockHandler(),
  getGetRolesMockHandler(
    getGetRolesResponseMock({
      data: [
        { id: "role123", name: "role1" },
        { id: "role234", name: "role2" },
        { id: "role345", name: "role3" },
      ],
    }),
  ),
  getGetEntitlementsMockHandler(
    getGetEntitlementsResponseMock({
      data: [
        {
          entitlement: "can_read",
          receiver_type: "editors",
          entity_type: "client",
        },
      ],
    }),
  ),
  getGetResourcesMockHandler(
    getGetResourcesResponseMock({
      data: [
        {
          entity: {
            id: "mock-entity-id",
            name: "editors",
            type: "mock-entity-name",
          },
        },
      ],
    }),
  ),
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

// eslint-disable-next-line vitest/expect-expect
test("should handle no identity id error when adding a user", async () => {
  mockApiServer.use(
    getPostIdentitiesMockHandler(
      getPostIdentitiesResponseMock({
        id: null,
        email: "test@test.com",
      }),
    ),
  );
  renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "mock@gmail.com{Enter}",
  );
  await hasToast(Label.IDENTITY_ID_ERROR, NotificationSeverity.NEGATIVE);
});

test("should add roles", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user123/roles")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  await userEvent.click(screen.getByRole("button", { name: /Add roles/ }));
  await userEvent.click(
    screen.getByRole("combobox", {
      name: RolesPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "role3",
    }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Create local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Create local user" }),
  );
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe('{"patches":[{"role":"role345","op":"add"}]}');
  await hasToast(
    'User with email "test@test.com" was created.',
    NotificationSeverity.POSITIVE,
  );
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding roles", async () => {
  mockApiServer.use(getPatchIdentitiesItemRolesMockHandler400());
  renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  await userEvent.click(screen.getByRole("button", { name: /Add roles/ }));
  await userEvent.click(
    screen.getByRole("combobox", {
      name: RolesPanelFormLabel.SELECT,
    }),
  );
  await userEvent.click(
    await screen.findByRole("checkbox", {
      name: "role3",
    }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Create local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Create local user" }),
  );
  await hasToast(Label.ROLES_ERROR, NotificationSeverity.NEGATIVE);
});

test("should add entitlements", async () => {
  let patchResponseBody: string | null = null;
  let patchDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "PATCH" &&
      requestClone.url.endsWith("/identities/user123/entitlements")
    ) {
      patchResponseBody = await requestClone.text();
      patchDone = true;
    }
  });
  renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.ENTITY,
    }),
    "client",
  );
  await screen.findByText(EntitlementPanelFormFieldsLabel.SELECT_RESOURCE);
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.RESOURCE,
    }),
    "editors",
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.ENTITLEMENT,
    }),
    "can_read",
  );
  await userEvent.click(
    screen.getByRole("button", { name: EntitlementsPanelFormLabel.SUBMIT }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Create local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Create local user" }),
  );
  await waitFor(() => expect(patchDone).toBeTruthy());
  expect(patchResponseBody).toBe(
    '{"patches":[{"entitlement":{"entity_type":"client","entitlement":"can_read","entity_id":"mock-entity-id"},"op":"add"}]}',
  );
  await hasToast(
    'User with email "test@test.com" was created.',
    NotificationSeverity.POSITIVE,
  );
});

// eslint-disable-next-line vitest/expect-expect
test("should handle errors when adding entitlements", async () => {
  mockApiServer.use(getPatchIdentitiesItemEntitlementsMockHandler400());
  renderComponent(<AddUserPanel close={vi.fn()} setPanelWidth={vi.fn()} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: UserPanelLabel.EMAIL }),
    "test@test.com{Enter}",
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.ENTITY,
    }),
    "client",
  );
  await screen.findByText(EntitlementPanelFormFieldsLabel.SELECT_RESOURCE);
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.RESOURCE,
    }),
    "editors",
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", {
      name: EntitlementsPanelFormLabel.ENTITLEMENT,
    }),
    "can_read",
  );
  await userEvent.click(
    screen.getByRole("button", { name: EntitlementsPanelFormLabel.SUBMIT }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Create local user" })[0],
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Create local user" }),
  );
  await hasToast(Label.ENTITLEMENTS_ERROR, NotificationSeverity.NEGATIVE);
});
