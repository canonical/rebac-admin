import { useContext, useEffect } from "react";
import type { UsePortalOptions } from "react-useportal";
import usePortal from "react-useportal";

import { ReBACAdminContext } from "context/ReBACAdminContext";

export const usePanelPortal = (
  className?: string,
  labelledBy?: string,
  options?: UsePortalOptions,
) => {
  const { asidePanelId } = useContext(ReBACAdminContext);
  const portal = usePortal({
    ...options,
    bindTo: asidePanelId
      ? document.getElementById(asidePanelId) ?? undefined
      : undefined,
    closeOnOutsideClick: false,
    closeOnEsc: false,
  });
  const { isOpen, portalRef } = portal;

  useEffect(() => {
    const portalNode = portalRef.current;
    if (isOpen && asidePanelId) {
      // The portal container needs to be the aside element as Vanilla
      // does not allow the aside to be nested.
      const asideNode = document.getElementById(asidePanelId);
      asideNode?.classList.add("l-aside");
      if (className) {
        asideNode?.classList.add(className);
      }
      if (labelledBy) {
        asideNode?.setAttribute("aria-labelledby", labelledBy);
      }
      // The portal node must have the panel class as Vanilla requires the panel
      // to be a direct descendent of the aside.
      portalNode.classList.add("p-panel");
    }
    return () => {
      if (asidePanelId) {
        const asideNode = document.getElementById(asidePanelId);
        asideNode?.classList.remove("l-aside");
        if (className) {
          asideNode?.classList.remove(className);
        }
        if (labelledBy) {
          asideNode?.removeAttribute("aria-labelledby");
        }
        portalNode.classList.remove("p-panel");
      }
    };
  }, [isOpen, asidePanelId, portalRef, className, labelledBy]);

  return portal;
};
