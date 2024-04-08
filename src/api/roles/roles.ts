/**
 * Generated by orval v6.25.0 🍺
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
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import type {
  BadRequestResponse,
  DefaultResponse,
  GetRoles200,
  GetRolesParams,
  NotFoundResponse,
  Role,
  UnauthorizedResponse,
} from "../api.schemas";

/**
 * @summary Get the list of roles.
 */
export const getRoles = (
  params?: GetRolesParams,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<GetRoles200>> => {
  return axios.get(`/roles`, {
    ...options,
    params: { ...params, ...options?.params },
  });
};

export const getGetRolesQueryKey = (params?: GetRolesParams) => {
  return [`/roles`, ...(params ? [params] : [])] as const;
};

export const getGetRolesQueryOptions = <
  TData = Awaited<ReturnType<typeof getRoles>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  params?: GetRolesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getRoles>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetRolesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getRoles>>> = ({
    signal,
  }) => getRoles(params, { signal, ...axiosOptions });

  return {
    queryKey,
    queryFn,
    refetchOnWindowFocus: false,
    ...queryOptions,
  } as UseQueryOptions<Awaited<ReturnType<typeof getRoles>>, TError, TData> & {
    queryKey: QueryKey;
  };
};

export type GetRolesQueryResult = NonNullable<
  Awaited<ReturnType<typeof getRoles>>
>;
export type GetRolesQueryError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Get the list of roles.
 */
export const useGetRoles = <
  TData = Awaited<ReturnType<typeof getRoles>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  params?: GetRolesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getRoles>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetRolesQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Create a new role
 */
export const postRoles = (
  role: Role,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<Role[]>> => {
  return axios.post(`/roles`, role, options);
};

export const getPostRolesMutationOptions = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postRoles>>,
    TError,
    { data: Role },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postRoles>>,
  TError,
  { data: Role },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postRoles>>,
    { data: Role }
  > = (props) => {
    const { data } = props ?? {};

    return postRoles(data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostRolesMutationResult = NonNullable<
  Awaited<ReturnType<typeof postRoles>>
>;
export type PostRolesMutationBody = Role;
export type PostRolesMutationError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Create a new role
 */
export const usePostRoles = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postRoles>>,
    TError,
    { data: Role },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const mutationOptions = getPostRolesMutationOptions(options);

  return useMutation(mutationOptions);
};
