import type { ReactNode } from "react";

export type ListItem = {
  label: ReactNode;
  value?: ReactNode;
};

export type Props = {
  title: ReactNode;
  items: ListItem[];
};
