import type { PropsWithChildren } from "react";
import type { Toast } from "react-hot-toast";

export type Props = {
  toastInstance: Omit<Toast, "ariaProps">;
  type: "caution" | "negative" | "positive";
  undo?: () => void;
} & PropsWithChildren;
