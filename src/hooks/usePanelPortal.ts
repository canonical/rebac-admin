import { useContext, useEffect } from "react";
import usePortal from "react-useportal";

import { ReBACAdminContext } from "context/ReBACAdminContext";

export const usePanelPortal = () => {
  const { asidePanelId } = useContext(ReBACAdminContext);
  const portal = usePortal({
    bindTo: asidePanelId
      ? document.getElementById(asidePanelId) ?? undefined
      : undefined,
  });
  const { isOpen, portalRef } = portal;

  useEffect(() => {
    const portalNode = portalRef.current;
    if (isOpen && asidePanelId) {
      // The portal container needs to be the aside element as Vanilla
      // does not allow the aside to be nested.
      document.getElementById(asidePanelId)?.classList.add("l-aside");
      // The portal node must have the panel class as Vanilla requires the panel
      // to be a direct descendent of the aside.
      portalNode.classList.add("p-panel");
    }
    return () => {
      if (asidePanelId) {
        document.getElementById(asidePanelId)?.classList.remove("l-aside");
        portalNode.classList.remove("p-panel");
      }
    };
  }, [isOpen, asidePanelId, portalRef]);

  return portal;
};
