/**
 * Generated by orval v6.28.2 🍺
 * Do not edit manually.
 * Canonical OpenFGA Administration Product Compatibility API
 * The following specification outlines the API required for the FGA administration frontend to interact with an OpenFGA instance through a products API. This is an evolving specification as reflected in the version number.

 * OpenAPI spec version: 0.0.10
 */
import { useQuery } from "@tanstack/react-query";
import type {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { customInstance } from "../../api-utils/mutator/custom-instance";
import type { ErrorType } from "../../api-utils/mutator/custom-instance";
import type {
  BadRequestResponse,
  DefaultResponse,
  GetEntitlementsParams,
  GetEntitlementsResponse,
  NotFoundResponse,
  UnauthorizedResponse,
} from "../api.schemas";

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

/**
 * The application/json response type will return the JSON authorisation model.
 * @summary Get the list of entitlements in JSON format.
 */
export const getEntitlements = (
  params?: GetEntitlementsParams,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<GetEntitlementsResponse>(
    { url: `/entitlements`, method: "GET", params, signal },
    options,
  );
};

export const getGetEntitlementsQueryKey = (params?: GetEntitlementsParams) => {
  return [`/entitlements`, ...(params ? [params] : [])] as const;
};

export const getGetEntitlementsQueryOptions = <
  TData = Awaited<ReturnType<typeof getEntitlements>>,
  TError = ErrorType<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  params?: GetEntitlementsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEntitlements>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customInstance>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetEntitlementsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getEntitlements>>> = ({
    signal,
  }) => getEntitlements(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getEntitlements>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetEntitlementsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getEntitlements>>
>;
export type GetEntitlementsQueryError = ErrorType<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Get the list of entitlements in JSON format.
 */
export const useGetEntitlements = <
  TData = Awaited<ReturnType<typeof getEntitlements>>,
  TError = ErrorType<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  params?: GetEntitlementsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEntitlements>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customInstance>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetEntitlementsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * The text/plain response type will return the raw authorisation model.
 * @summary Get the list of entitlements as raw text.
 */
export const getRawEntitlements = (
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<string>(
    { url: `/entitlements/raw`, method: "GET", signal },
    options,
  );
};

export const getGetRawEntitlementsQueryKey = () => {
  return [`/entitlements/raw`] as const;
};

export const getGetRawEntitlementsQueryOptions = <
  TData = Awaited<ReturnType<typeof getRawEntitlements>>,
  TError = ErrorType<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getRawEntitlements>>,
      TError,
      TData
    >
  >;
  request?: SecondParameter<typeof customInstance>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetRawEntitlementsQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getRawEntitlements>>
  > = ({ signal }) => getRawEntitlements(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getRawEntitlements>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetRawEntitlementsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getRawEntitlements>>
>;
export type GetRawEntitlementsQueryError = ErrorType<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Get the list of entitlements as raw text.
 */
export const useGetRawEntitlements = <
  TData = Awaited<ReturnType<typeof getRawEntitlements>>,
  TError = ErrorType<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getRawEntitlements>>,
      TError,
      TData
    >
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetRawEntitlementsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};
