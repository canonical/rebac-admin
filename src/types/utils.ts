/**
 * This type can be used for React props where a component needs to provide the
 * props from either A or B, but prevent a mix of both.
 */
export type ExclusiveProps<A, B> =
  | (A & Partial<Record<keyof B, never>>)
  | (B & Partial<Record<keyof A, never>>);

export const MAX_SIGNED_INT32 = Math.pow(2, 31) - 1;
