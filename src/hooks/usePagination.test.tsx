import { faker } from "@faker-js/faker";
import { act, renderHook } from "@testing-library/react";

import { mockResponse } from "mocks/common";

import { usePagination } from "./usePagination";

test("initialises page number", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setResponse(
      mockResponse({
        _meta: {
          page: 5,
          size: 10,
        },
      }),
    );
  });
  expect(
    "page" in result.current.pageData ? result.current.pageData.page : null,
  ).toBe(5);
});

test("has next page for token pagination", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setResponse(
      mockResponse({
        _links: {
          next: {
            href: faker.word.sample(),
          },
        },
        _meta: {
          pageToken: faker.word.sample(),
          size: 10,
        },
      }),
    );
  });
  expect(result.current.hasNextPage).toBe(true);
});

test("has next page for page number pagination", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setResponse(
      mockResponse({
        _meta: {
          page: 5,
          size: 10,
        },
      }),
    );
  });
  expect(result.current.hasNextPage).toBe(true);
});

test("handles no next page for token pagination", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setResponse(
      mockResponse({
        _links: {
          next: {
            href: "",
          },
        },
        _meta: {
          pageToken: faker.word.sample(),
          size: 10,
        },
      }),
    );
  });
  expect(result.current.hasNextPage).toBe(false);
});

test("handles no next page for page number pagination", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setSize(10);
  });
  act(() => {
    result.current.setResponse(
      mockResponse({
        _meta: {
          page: 5,
          size: 9,
        },
      }),
    );
  });
  expect(result.current.hasNextPage).toBe(false);
});

test("has previous page for token pagination", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setResponse(
      mockResponse({
        _links: {
          next: {
            href: "http://example.com/something/?nextToken=abc123",
          },
        },
        _meta: {
          pageToken: faker.word.sample(),
          size: 10,
        },
      }),
    );
  });
  act(() => {
    result.current.nextPage();
  });
  expect(result.current.hasPreviousPage).toBe(true);
});

test("has previous page for page number pagination", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setResponse(
      mockResponse({
        _meta: {
          page: 5,
          size: 9,
        },
      }),
    );
  });
  expect(result.current.hasPreviousPage).toBe(true);
});

test("handles no previous page for token pagination", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setResponse(
      mockResponse({
        _links: {
          next: {
            href: "http://example.com/something/?nextToken=abc123",
          },
        },
        _meta: {
          pageToken: faker.word.sample(),
          size: 10,
        },
      }),
    );
  });
  expect(result.current.hasPreviousPage).toBe(false);
});

test("handles no previous page for page number pagination", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setResponse(
      mockResponse({
        _meta: {
          page: 0,
          size: 9,
        },
      }),
    );
  });
  expect(result.current.hasNextPage).toBe(false);
});

test("handles next page for page number pagination", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setResponse(
      mockResponse({
        _meta: {
          page: 0,
          size: 9,
        },
      }),
    );
  });
  act(() => {
    result.current.nextPage();
  });
  expect(
    "page" in result.current.pageData ? result.current.pageData.page : null,
  ).toBe(1);
});

test("handles next page for token pagination", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setResponse(
      mockResponse({
        _links: {
          next: {
            href: "http://example.com/something/?nextToken=abc123",
          },
        },
        _meta: {
          pageToken: faker.word.sample(),
          size: 10,
        },
      }),
    );
  });
  act(() => {
    result.current.nextPage();
  });
  expect(
    "nextToken" in result.current.pageData
      ? result.current.pageData.nextToken
      : null,
  ).toBe("abc123");
});

test("handles previous page for page number pagination", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setResponse(
      mockResponse({
        _meta: {
          page: 5,
          size: 9,
        },
      }),
    );
  });
  act(() => {
    result.current.previousPage?.();
  });
  expect(
    "page" in result.current.pageData ? result.current.pageData.page : null,
  ).toBe(4);
});

test("doesn't handle previous page for token pagination", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setResponse(
      mockResponse({
        _links: {
          next: {
            href: faker.word.sample(),
          },
        },
        _meta: {
          pageToken: faker.word.sample(),
          size: 10,
        },
      }),
    );
  });
  expect(result.current.previousPage).toBeNull();
});

test("sets page", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setPage(12);
  });
  expect(
    "page" in result.current.pageData ? result.current.pageData.page : null,
  ).toBe(12);
});

test("resets page", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setSize(100);
  });
  act(() => {
    result.current.setPage(12);
  });
  expect(
    "page" in result.current.pageData ? result.current.pageData.page : null,
  ).toBe(12);
  act(() => {
    result.current.resetPage();
  });
  expect(result.current.pageData).toStrictEqual({ size: 100 });
});

test("sets size", () => {
  const { result } = renderHook(() => usePagination());
  act(() => {
    result.current.setSize(100);
  });
  expect(result.current.pageData.size).toBe(100);
});
