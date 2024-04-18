import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import { PanelFormNavigationTitleId } from "components/PanelForm/PanelFormNavigation/consts";
import { usePanelPortal } from "hooks/usePanelPortal";

export const usePanel = <D extends object>(
  getPanel: (closePanel: () => void, data: D | null) => ReactNode,
) => {
  const [data, setData] = useState<D | null>(null);
  const { openPortal, closePortal, isOpen, Portal } = usePanelPortal(
    "is-medium",
    PanelFormNavigationTitleId,
    { programmaticallyOpen: true },
  );
  const openPanel = useCallback(
    (newData?: D) => {
      setData(newData ?? null);
      openPortal();
    },
    [openPortal],
  );
  const closePanel = useCallback(() => {
    setData(null);
    closePortal();
  }, [closePortal]);
  const generatePanel = useCallback(() => {
    return isOpen ? <Portal>{getPanel(closePanel, data)}</Portal> : null;
  }, [Portal, closePanel, data, getPanel, isOpen]);
  return { generatePanel, openPanel, closePanel };
};
