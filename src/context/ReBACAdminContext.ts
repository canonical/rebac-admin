import { createContext } from "react";

type Values = {
  asidePanelId?: string | null;
};

export const ReBACAdminContext = createContext<Values>({
  asidePanelId: null,
});
