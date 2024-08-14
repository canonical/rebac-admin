import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import usePortal from "react-useportal";

export const useDeleteModal = <D,>(
  getModal: (closeModal: () => void, data: D) => ReactNode,
) => {
  const [data, setData] = useState<D | null>(null);
  const { openPortal, closePortal, isOpen, Portal } = usePortal({
    programmaticallyOpen: true,
  });
  const openModal = useCallback(
    (newData?: D) => {
      setData(newData ?? null);
      openPortal();
    },
    [openPortal],
  );
  const closeModal = useCallback(() => {
    setData(null);
    closePortal();
  }, [closePortal]);
  const generateModal = useCallback(() => {
    return isOpen && data ? (
      <Portal>{getModal(closeModal, data)}</Portal>
    ) : null;
  }, [Portal, closeModal, data, getModal, isOpen]);
  return { generateModal, openModal, closeModal, isModalOpen: isOpen };
};
