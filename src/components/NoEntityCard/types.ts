import type { ReactNode } from "react";

export type Props = {
  title: string;
  message: string;
  actionButton?: ReactNode;
};

export enum TestId {
  NO_ENTITY_CARD = "no-entity-card",
}
