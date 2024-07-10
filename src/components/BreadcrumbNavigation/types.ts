import type { ReactNode } from "react";

export type Props = {
  backTitle?: ReactNode;
  onBack?: () => void;
  title: ReactNode;
  titleId?: string;
};
