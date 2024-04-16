import type { PropsWithChildren } from "react";
import type { Toast } from "react-hot-toast";

export type Props = {
  toastInstance: Omit<Toast, "ariaProps">;
  type: "positive" | "caution" | "negative";
  undo?: () => void;
} & PropsWithChildren;
