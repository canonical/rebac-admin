import { createContext } from "react";

type Values = {
  asidePanelId?: null | string;
};

export const ReBACAdminContext = createContext<Values>({
  asidePanelId: null,
});
