import { useContext, useEffect } from "react";
import type { UsePortalOptions } from "react-useportal";
import usePortal from "react-useportal";

import { ReBACAdminContext } from "context/ReBACAdminContext";

export const usePanelPortal = (
  className?: string | null,
  labelledBy?: string | null,
  options?: UsePortalOptions,
) => {
  const { asidePanelId } = useContext(ReBACAdminContext);
  const portal = usePortal({
    ...options,
    bindTo: asidePanelId
      ? document.getElementById(asidePanelId) ?? undefined
      : undefined,
    closeOnEsc: false,
    closeOnOutsideClick: false,
  });
  const { isOpen, portalRef } = portal;

  useEffect(() => {
    const portalNode = portalRef.current;
    if (isOpen) {
      // The portal node needs to be the aside element as Vanilla
      // does not allow the aside to be nested (and usePortal creates a wrapping
      // div to insert the portal contents into).
      portalNode?.classList.add("l-aside");
      // usePortal creates a div so to mimic an aside we need to manually set
      // the role.
      portalNode?.setAttribute("role", "complementary");
      if (className) {
        portalNode?.classList.add(className);
      }
      if (labelledBy) {
        portalNode?.setAttribute("aria-labelledby", labelledBy);
      }
    }
    return () => {
      portalNode?.classList.remove("l-aside");
      portalNode?.removeAttribute("role");
      if (className) {
        portalNode?.classList.remove(className);
      }
      if (labelledBy) {
        portalNode?.removeAttribute("aria-labelledby");
      }
    };
  }, [isOpen, portalRef, className, labelledBy]);

  return portal;
};
