/**
 * Generated by orval v6.18.1 🍺
 * Do not edit manually.
 * Canonical OpenFGA Administration Product Compatibility API
 * The following specification outlines the API required for the FGA administration frontend to interact with an OpenFGA instance through a products API. This is an evolving specification as reflected in the version number.

#### Changelog
| Version | Notes |
|---|---|
| **0.0.6** | Ensured compatibility with Orval Restful Client Generator. |
| **0.0.5** | Add filter parameter to top level collection `GET` requests. |
| **0.0.4** | Added pagination parameters to appropriate `GET` requests.<br />Changed a couple of `PUT`'s to `PATCH`'s to account for the possible subset returned from the paginated `GET`'s. |
| **0.0.3** | Added skeleton error responses for `400`, `401`, `404`, and `5XX` (`default`) |
| **0.0.2** | Added `GET /users/{id}/groups`<br />Added `GET /users/{id}roles`<br />Added `GET /users/{id}/entitlements`<br />Added `GET,PUT /groups/{id}/users`<br>Added `DELETE /groups/{id}/users/{userId}`<br />Added `GET /roles/{id}/entitlements`<br />Added `DELETE /roles/{id}/entitlements/{entitlementId}` |
| **0.0.1** | Initial dump |

 * OpenAPI spec version: 0.0.6
 */
import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  QueryKey,
} from "@tanstack/react-query";
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

import type {
  Role,
  BadRequestResponse,
  UnauthorizedResponse,
  NotFoundResponse,
  DefaultResponse,
  Entitlement,
  GetRolesIdEntitlementsParams,
} from "../api.schemas";

/**
 * @summary Get a single role.
 */
export const getRolesId = (
  id: string,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<Role>> => {
  return axios.get(`/roles/${id}`, options);
};

export const getGetRolesIdQueryKey = (id: string) => {
  return [`/roles/${id}`] as const;
};

export const getGetRolesIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getRolesId>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getRolesId>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetRolesIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getRolesId>>> = ({
    signal,
  }) => getRolesId(id, { signal, ...axiosOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getRolesId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetRolesIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getRolesId>>
>;
export type GetRolesIdQueryError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Get a single role.
 */
export const useGetRolesId = <
  TData = Awaited<ReturnType<typeof getRolesId>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getRolesId>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetRolesIdQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Update a role.
 */
export const patchRolesId = (
  id: string,
  role: Role,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<void>> => {
  return axios.patch(`/roles/${id}`, role, options);
};

export const getPatchRolesIdMutationOptions = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchRolesId>>,
    TError,
    { id: string; data: Role },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchRolesId>>,
  TError,
  { id: string; data: Role },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchRolesId>>,
    { id: string; data: Role }
  > = (props) => {
    const { id, data } = props ?? {};

    return patchRolesId(id, data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchRolesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchRolesId>>
>;
export type PatchRolesIdMutationBody = Role;
export type PatchRolesIdMutationError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Update a role.
 */
export const usePatchRolesId = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchRolesId>>,
    TError,
    { id: string; data: Role },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const mutationOptions = getPatchRolesIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Delete a role.
 */
export const deleteRolesId = (
  id: string,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<void>> => {
  return axios.delete(`/roles/${id}`, options);
};

export const getDeleteRolesIdMutationOptions = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteRolesId>>,
    TError,
    { id: string },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteRolesId>>,
  TError,
  { id: string },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteRolesId>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return deleteRolesId(id, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteRolesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteRolesId>>
>;

export type DeleteRolesIdMutationError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Delete a role.
 */
export const useDeleteRolesId = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteRolesId>>,
    TError,
    { id: string },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const mutationOptions = getDeleteRolesIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Get the entitlements of a role
 */
export const getRolesIdEntitlements = (
  id: string,
  params?: GetRolesIdEntitlementsParams,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<Entitlement[]>> => {
  return axios.get(`/roles/${id}/entitlements`, {
    ...options,
    params: { ...params, ...options?.params },
  });
};

export const getGetRolesIdEntitlementsQueryKey = (
  id: string,
  params?: GetRolesIdEntitlementsParams,
) => {
  return [`/roles/${id}/entitlements`, ...(params ? [params] : [])] as const;
};

export const getGetRolesIdEntitlementsQueryOptions = <
  TData = Awaited<ReturnType<typeof getRolesIdEntitlements>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  id: string,
  params?: GetRolesIdEntitlementsParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getRolesIdEntitlements>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetRolesIdEntitlementsQueryKey(id, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getRolesIdEntitlements>>
  > = ({ signal }) =>
    getRolesIdEntitlements(id, params, { signal, ...axiosOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getRolesIdEntitlements>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetRolesIdEntitlementsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getRolesIdEntitlements>>
>;
export type GetRolesIdEntitlementsQueryError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Get the entitlements of a role
 */
export const useGetRolesIdEntitlements = <
  TData = Awaited<ReturnType<typeof getRolesIdEntitlements>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  id: string,
  params?: GetRolesIdEntitlementsParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getRolesIdEntitlements>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetRolesIdEntitlementsQueryOptions(
    id,
    params,
    options,
  );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Remove an entitlement from a role
 */
export const deleteRolesIdEntitlementsEntitlementId = (
  id: string,
  entitlementId: string,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<void>> => {
  return axios.delete(`/roles/${id}/entitlements/${entitlementId}`, options);
};

export const getDeleteRolesIdEntitlementsEntitlementIdMutationOptions = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteRolesIdEntitlementsEntitlementId>>,
    TError,
    { id: string; entitlementId: string },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteRolesIdEntitlementsEntitlementId>>,
  TError,
  { id: string; entitlementId: string },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteRolesIdEntitlementsEntitlementId>>,
    { id: string; entitlementId: string }
  > = (props) => {
    const { id, entitlementId } = props ?? {};

    return deleteRolesIdEntitlementsEntitlementId(
      id,
      entitlementId,
      axiosOptions,
    );
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteRolesIdEntitlementsEntitlementIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteRolesIdEntitlementsEntitlementId>>
>;

export type DeleteRolesIdEntitlementsEntitlementIdMutationError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Remove an entitlement from a role
 */
export const useDeleteRolesIdEntitlementsEntitlementId = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteRolesIdEntitlementsEntitlementId>>,
    TError,
    { id: string; entitlementId: string },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const mutationOptions =
    getDeleteRolesIdEntitlementsEntitlementIdMutationOptions(options);

  return useMutation(mutationOptions);
};
