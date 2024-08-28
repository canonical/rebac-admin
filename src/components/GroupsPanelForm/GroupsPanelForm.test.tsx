import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getGetGroupsMockHandler,
  getGetGroupsMockHandler400,
  getGetGroupsResponseMock,
  getGetGroupsResponseMock400,
} from "api/groups/groups.msw";
import { Label as GroupsPanelFormLabel } from "components/GroupsPanelForm";
import { mockGroup } from "mocks/groups";
import { hasNotification, renderComponent } from "test/utils";

import GroupsPanelForm from "./GroupsPanelForm";

const mockApiServer = setupServer(
  getGetGroupsMockHandler(
    getGetGroupsResponseMock({
      data: [
        mockGroup({ id: "group1", name: "global" }),
        mockGroup({ id: "group2", name: "administrator" }),
        mockGroup({ id: "group3", name: "viewer" }),
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

test("can add groups", async () => {
  const setAddGroups = vi.fn();
  renderComponent(
    <GroupsPanelForm
      addGroups={[{ id: "new-group-id", name: "new-group" }]}
      setAddGroups={setAddGroups}
      removeGroups={[]}
      setRemoveGroups={vi.fn()}
    />,
  );
  await userEvent.click(
    screen.getByRole("combobox", {
      name: GroupsPanelFormLabel.SELECT,
    }),
  );
  // Wait for the options to load.
  const checkbox = await screen.findByRole("checkbox", {
    name: "viewer",
  });
  await userEvent.click(checkbox);
  expect(setAddGroups).toHaveBeenCalledWith([
    { id: "new-group-id", name: "new-group" },
    { id: "group3", name: "viewer" },
  ]);
});

test("can display groups", async () => {
  const addGroups = [{ name: "new-group-1" }, { name: "new-group-2" }];
  const existingGroups = [{ name: "existing1" }, { name: "existing2" }];
  renderComponent(
    <GroupsPanelForm
      addGroups={addGroups}
      existingGroups={existingGroups}
      setAddGroups={vi.fn()}
      removeGroups={[]}
      setRemoveGroups={vi.fn()}
    />,
  );
  expect(
    screen.getByRole("row", {
      name: new RegExp(addGroups[0].name),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: new RegExp(addGroups[1].name),
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /existing1/,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /existing2/,
    }),
  ).toBeInTheDocument();
});

test("does not display removed groups from the API", async () => {
  const removeGroups = [{ name: "existing1" }];
  const existingGroups = [{ name: "existing1" }, { name: "existing2" }];
  renderComponent(
    <GroupsPanelForm
      addGroups={[]}
      existingGroups={existingGroups}
      setAddGroups={vi.fn()}
      removeGroups={removeGroups}
      setRemoveGroups={vi.fn()}
    />,
  );
  expect(
    screen.queryByRole("row", {
      name: /existing1/,
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("row", {
      name: /existing2/,
    }),
  ).toBeInTheDocument();
});

test("can remove newly added groups", async () => {
  const groups = [{ name: "group-1" }, { name: "group-2" }];
  const setAddGroups = vi.fn();
  renderComponent(
    <GroupsPanelForm
      addGroups={groups}
      setAddGroups={setAddGroups}
      removeGroups={[]}
      setRemoveGroups={vi.fn()}
    />,
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: GroupsPanelFormLabel.REMOVE })[1],
  );
  expect(setAddGroups).toHaveBeenCalledWith([{ name: "group-1" }]);
});

test("can remove groups from the API", async () => {
  const existingGroups = [{ name: "existing1" }, { name: "existing2" }];
  const setRemoveGroups = vi.fn();
  renderComponent(
    <GroupsPanelForm
      addGroups={[]}
      existingGroups={existingGroups}
      setAddGroups={vi.fn()}
      removeGroups={[{ name: "viewer" }]}
      setRemoveGroups={setRemoveGroups}
    />,
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: GroupsPanelFormLabel.REMOVE })[0],
  );
  expect(setRemoveGroups).toHaveBeenCalledWith([
    { name: "viewer" },
    { name: "existing1" },
  ]);
});

// eslint-disable-next-line vitest/expect-expect
test("can display fetch errors", async () => {
  mockApiServer.use(
    getGetGroupsMockHandler400(
      getGetGroupsResponseMock400({ message: "Uh oh!" }),
    ),
  );
  renderComponent(
    <GroupsPanelForm
      addGroups={[]}
      setAddGroups={vi.fn()}
      removeGroups={[]}
      setRemoveGroups={vi.fn()}
    />,
  );
  await hasNotification("Uh oh!");
});

test("filter groups", async () => {
  let getDone = false;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mockApiServer.events.on("request:start", async ({ request }) => {
    const requestClone = request.clone();
    if (
      requestClone.method === "GET" &&
      requestClone.url.endsWith("/groups?filter=global")
    ) {
      getDone = true;
    }
  });
  renderComponent(
    <GroupsPanelForm
      addGroups={[]}
      setAddGroups={vi.fn()}
      removeGroups={[]}
      setRemoveGroups={vi.fn()}
    />,
  );
  await userEvent.click(
    screen.getByRole("combobox", {
      name: GroupsPanelFormLabel.SELECT,
    }),
  );
  await userEvent.type(
    within(screen.getByRole("listbox")).getByRole("searchbox"),
    "global{enter}",
  );
  await waitFor(() => expect(getDone).toBeTruthy());
});
