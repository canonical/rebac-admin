import { Icon, TablePaginationControls } from "@canonical/react-components";
import type { FC } from "react";

import { Label, type Props } from "./types";

const EntityTablePagination: FC<Props> = ({ pagination }: Props) => {
  if (!pagination) {
    return;
  }
  return (
    <TablePaginationControls
      currentPage={
        "page" in pagination.pageData
          ? // The API uses zero indexed page numbers so increase the displayed count by 1.
            pagination.pageData.page + 1
          : 1
      }
      displayDescription={false}
      pageSize={pagination.pageData.size}
      onInputPageChange={(page) =>
        // The API uses zero indexed page numbers so reduce the count by 1.
        page > 0 && pagination.setPage(page - 1)
      }
      onNextPage={pagination.nextPage}
      onPreviousPage={() => {
        if (pagination.previousPage) {
          pagination.previousPage?.();
        } else {
          pagination.resetPage();
        }
      }}
      onPageSizeChange={pagination.setSize}
      previousButtonProps={{
        disabled: !pagination.hasPreviousPage,
        children: pagination.previousPage ? (
          <Icon name="chevron-left">{Label.PREVIOUS_PAGE}</Icon>
        ) : (
          <Icon className="p-icon--rotate-270" name="back-to-top">
            {Label.FIRST_PAGE}
          </Icon>
        ),
      }}
      nextButtonProps={{ disabled: !pagination.hasNextPage }}
      pageLimits={[10, 25, 50]}
      showPageInput={"page" in pagination.pageData}
    />
  );
};

export default EntityTablePagination;
