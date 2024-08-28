import type { Response } from "api/api.schemas";
import type { PaginationParams } from "hooks/usePagination";

export type Props = {
  pagination: PaginationParams;
  response?: Response;
};

export enum Label {
  PREVIOUS_PAGE = "Previous page",
  FIRST_PAGE = "Back to first page",
  NEXT_PAGE = "Next page",
}
