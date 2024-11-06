import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useState } from "react";

import type {
  PaginationSizeParameter,
  Response,
  PaginationNextTokenParameter,
  PaginationPageParameter,
} from "api/api.schemas";

type PageData = (
  | {
      nextToken: PaginationNextTokenParameter;
    }
  | {
      page: PaginationPageParameter;
    }
  | {}
) & { size: PaginationSizeParameter };

const PAGE_SIZE = 10;

export type PaginationParams = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => void;
  pageData: PageData;
  previousPage: (() => void) | null;
  resetPage: () => void;
  setPage: (page: number) => void;
  setResponse: (response?: Response) => void;
  setSize: (size: number) => void;
};

export const usePagination = (): PaginationParams => {
  const [pageData, setPageData] = useState<PageData>({
    size: PAGE_SIZE,
  });
  const [response, setResponse] = useState<Response>();
  const updateResponse = useCallback(
    (next?: Response) => {
      if (
        next &&
        (!response ||
          !isEqual(response._meta, next?._meta) ||
          !isEqual(response._links, next?._links))
      ) {
        setResponse(next);
      }
    },
    [response],
  );
  const nextPage = useCallback(() => {
    if (!response) {
      return;
    }
    const current = response._meta.page ?? 0;
    if ("page" in response._meta) {
      setPageData({
        ...pageData,
        page: current + 1,
      });
    } else {
      const parts = response._links.next.href.split("?");
      if (parts.length > 1) {
        const params = new URLSearchParams(parts[1]);
        const nextToken = params.get("nextToken");
        if (nextToken) {
          setPageData({ ...pageData, nextToken });
        }
      }
    }
  }, [pageData, response]);
  const previousPage = useCallback(() => {
    if (!response) {
      return;
    }
    const current = response._meta.page ?? 0;
    if ("page" in response._meta && current > 0) {
      setPageData({
        ...pageData,
        page: current - 1,
      });
    }
  }, [response, pageData]);
  useEffect(() => {
    if (response?._meta && "page" in response._meta && !("page" in pageData)) {
      setPageData({
        ...pageData,
        page: response._meta.page,
      });
    }
  }, [pageData, response]);
  return {
    hasNextPage: response?._meta.pageToken
      ? !!response?._links.next.href
      : (response?._meta.size ?? 0) === pageData.size,
    hasPreviousPage:
      response?._meta && "page" in response._meta
        ? (response._meta?.page ?? 0) > 0
        : !!pageData && "nextToken" in pageData && !!pageData.nextToken,
    nextPage,
    pageData,
    previousPage: response?._meta.pageToken ? null : previousPage,
    setPage: (page) => setPageData({ ...pageData, page }),
    resetPage: () => setPageData({ size: pageData.size }),
    setResponse: updateResponse,
    setSize: (size) => {
      setPageData({
        size,
        ...("page" in pageData ? { page: 0 } : {}),
      });
    },
  };
};
