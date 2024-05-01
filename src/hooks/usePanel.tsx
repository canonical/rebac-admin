import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import { EmbeddedPanelLabelledById } from "components/EmbeddedPanel/consts";
import { usePanelPortal } from "hooks/usePanelPortal";

export enum PanelWidth {
  MEDIUM = "is-medium",
  NARROW = "is-narrow",
  DEFAULT = "is-default",
  WIDE = "is-wide",
}

export type SetPanelWidth = (panelWidth?: PanelWidth | null) => void;

export const usePanel = <D extends object>(
  getPanel: (
    closePanel: () => void,
    data: D | null,
    setPanelWidth: SetPanelWidth,
  ) => ReactNode,
) => {
  const [data, setData] = useState<D | null>(null);
  const [panelWidth, setPanelWidth] = useState<PanelWidth | null | undefined>();
  const { openPortal, closePortal, isOpen, Portal } = usePanelPortal(
    panelWidth,
    EmbeddedPanelLabelledById,
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
    return isOpen ? (
      <Portal>{getPanel(closePanel, data, setPanelWidth)}</Portal>
    ) : null;
  }, [Portal, closePanel, data, getPanel, isOpen]);
  return { generatePanel, openPanel, closePanel };
};
