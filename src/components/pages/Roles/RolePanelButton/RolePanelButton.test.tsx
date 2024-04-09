import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ReBACAdminContext } from "context/ReBACAdminContext";
import { renderComponent } from "test/utils";

import RolePanelButton from "./RolePanelButton";

test("can display add state", async () => {
  renderComponent(<RolePanelButton />);
  expect(
    screen.getByRole("button", { name: "Create role" }),
  ).toBeInTheDocument();
});

test("can display edit state", async () => {
  renderComponent(<RolePanelButton roleId="role1" />);
  expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
});

test("can display the add panel", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <div id="aside-panel"></div>
      <RolePanelButton />
    </ReBACAdminContext.Provider>,
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Create role" }),
      ),
  );
  const heading = screen.getByRole("heading", { name: "Create role" });
  expect(heading).toBeInTheDocument();
  expect(heading.closest(".p-panel")).toBeInTheDocument();
});
