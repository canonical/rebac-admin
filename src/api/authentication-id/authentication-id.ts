/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * Canonical OpenFGA Administration Product Compatibility API
 * The following specification outlines the API required for the FGA administration frontend to interact with an OpenFGA instance through a products API. This is an evolving specification as reflected in the version number.

#### Changelog
| Version | Notes |
|---|---|
| **0.0.8** | Implement response type as defined in [IAM Platform Admin UI HTTP Spec](https://docs.google.com/document/d/1ElV22e3mePGFPq8CaM3F3IkuyuOLNpjG7yYgtjvygf4/edit). |
| **0.0.7** | Added `/entitlements/raw` endpoint to split `/entitlements` responses. |
| **0.0.6** | Ensured compatibility with Orval Restful Client Generator. |
| **0.0.5** | Add filter parameter to top level collection `GET` requests. |
| **0.0.4** | Added pagination parameters to appropriate `GET` requests.<br />Changed a couple of `PUT`'s to `PATCH`'s to account for the possible subset returned from the paginated `GET`'s. |
| **0.0.3** | Added skeleton error responses for `400`, `401`, `404`, and `5XX` (`default`) |
| **0.0.2** | Added `GET /users/{id}/groups`<br />Added `GET /users/{id}roles`<br />Added `GET /users/{id}/entitlements`<br />Added `GET,PUT /groups/{id}/users`<br>Added `DELETE /groups/{id}/users/{userId}`<br />Added `GET /roles/{id}/entitlements`<br />Added `DELETE /roles/{id}/entitlements/{entitlementId}` |
| **0.0.1** | Initial dump |

 * OpenAPI spec version: 0.0.8
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { customInstance } from "../../api-utils/mutator/custom-instance";
import type { ErrorType } from "../../api-utils/mutator/custom-instance";
import type {
  BadRequestResponse,
  DefaultResponse,
  GetAuthenticationId200,
  IdentityProvider,
  NotFoundResponse,
  UnauthorizedResponse,
} from "../api.schemas";

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

/**
 * @summary Get a single authentication method.
 */
export const getAuthenticationId = (
  id: string,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<GetAuthenticationId200>(
    { url: `/authentication/${id}`, method: "GET", signal },
    options,
  );
};

export const getGetAuthenticationIdQueryKey = (id: string) => {
  return [`/authentication/${id}`] as const;
};

export const getGetAuthenticationIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getAuthenticationId>>,
  TError = ErrorType<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getAuthenticationId>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customInstance>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAuthenticationIdQueryKey(id);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getAuthenticationId>>
  > = ({ signal }) => getAuthenticationId(id, requestOptions, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getAuthenticationId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetAuthenticationIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAuthenticationId>>
>;
export type GetAuthenticationIdQueryError = ErrorType<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Get a single authentication method.
 */
export const useGetAuthenticationId = <
  TData = Awaited<ReturnType<typeof getAuthenticationId>>,
  TError = ErrorType<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getAuthenticationId>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customInstance>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetAuthenticationIdQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Update an authentication method.
 */
export const patchAuthenticationId = (
  id: string,
  identityProvider: IdentityProvider,
  options?: SecondParameter<typeof customInstance>,
) => {
  return customInstance<void>(
    {
      url: `/authentication/${id}`,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      data: identityProvider,
    },
    options,
  );
};

export const getPatchAuthenticationIdMutationOptions = <
  TError = ErrorType<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchAuthenticationId>>,
    TError,
    { id: string; data: IdentityProvider },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchAuthenticationId>>,
  TError,
  { id: string; data: IdentityProvider },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchAuthenticationId>>,
    { id: string; data: IdentityProvider }
  > = (props) => {
    const { id, data } = props ?? {};

    return patchAuthenticationId(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchAuthenticationIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchAuthenticationId>>
>;
export type PatchAuthenticationIdMutationBody = IdentityProvider;
export type PatchAuthenticationIdMutationError = ErrorType<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Update an authentication method.
 */
export const usePatchAuthenticationId = <
  TError = ErrorType<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchAuthenticationId>>,
    TError,
    { id: string; data: IdentityProvider },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchAuthenticationId>>,
  TError,
  { id: string; data: IdentityProvider },
  TContext
> => {
  const mutationOptions = getPatchAuthenticationIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Remove an authentication method.
 */
export const deleteAuthenticationId = (
  id: string,
  options?: SecondParameter<typeof customInstance>,
) => {
  return customInstance<void>(
    { url: `/authentication/${id}`, method: "DELETE" },
    options,
  );
};

export const getDeleteAuthenticationIdMutationOptions = <
  TError = ErrorType<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteAuthenticationId>>,
    TError,
    { id: string },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteAuthenticationId>>,
  TError,
  { id: string },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteAuthenticationId>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return deleteAuthenticationId(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteAuthenticationIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteAuthenticationId>>
>;

export type DeleteAuthenticationIdMutationError = ErrorType<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Remove an authentication method.
 */
export const useDeleteAuthenticationId = <
  TError = ErrorType<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteAuthenticationId>>,
    TError,
    { id: string },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteAuthenticationId>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getDeleteAuthenticationIdMutationOptions(options);

  return useMutation(mutationOptions);
};
