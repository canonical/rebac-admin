import { Button } from "@canonical/react-components";

import { PanelFormNavigationTitleId } from "components/PanelForm/PanelFormNavigation/consts";
import { usePanelPortal } from "hooks/usePanelPortal";

import AddRolePanel from "../AddRolePanel";

import type { Props } from "./types";

const RolePanelButton = ({ roleId }: Props) => {
  const { openPortal, closePortal, isOpen, Portal } = usePanelPortal(
    "is-medium",
    PanelFormNavigationTitleId,
  );
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
