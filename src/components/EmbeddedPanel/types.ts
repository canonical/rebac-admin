import type { PropsWithChildren, ReactNode } from "react";

export type Props = {
  title: ReactNode;
  titleId?: string;
} & PropsWithChildren;
