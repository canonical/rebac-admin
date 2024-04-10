import { Button } from "@canonical/react-components";

import { usePanelPortal } from "hooks/usePanelPortal";

import AddRolePanel from "../AddRolePanel";

import type { Props } from "./types";

const RolePanelButton = ({ roleId }: Props) => {
  const { openPortal, closePortal, isOpen, Portal } = usePanelPortal();
  return (
    <>
      <Button appearance={roleId ? "link" : "positive"} onClick={openPortal}>
        {roleId ? "Edit" : "Create role"}
      </Button>
      {isOpen ? (
        <Portal>{roleId ? null : <AddRolePanel close={closePortal} />}</Portal>
      ) : null}
    </>
  );
};

export default RolePanelButton;
