/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * Canonical OpenFGA Administration Product Compatibility API
 * The following specification outlines the API required for the FGA administration frontend to interact with an OpenFGA instance through a products API. This is an evolving specification as reflected in the version number.

 * OpenAPI spec version: 0.0.10
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
  GetIdentitiesItemEntitlementsParams,
  GetIdentitiesItemGroupsParams,
  GetIdentitiesItemRolesParams,
  GetIdentitiesParams,
  GetIdentitiesResponse,
  GetIdentityEntitlementsResponse,
  GetIdentityGroupsResponse,
  GetIdentityRolesResponse,
  Identity,
  IdentityEntitlementsPatchRequestBody,
  IdentityGroupsPatchRequestBody,
  IdentityRolesPatchRequestBody,
  NotFoundResponse,
  UnauthorizedResponse,
} from "../api.schemas";

/**
 * Get list of identities.
 * @summary Get list of identities.
 */
export const getIdentities = (
  params?: GetIdentitiesParams,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<GetIdentitiesResponse>> => {
  return axios.get(`/identities`, {
    ...options,
    params: { ...params, ...options?.params },
  });
};

export const getGetIdentitiesQueryKey = (params?: GetIdentitiesParams) => {
  return [`/identities`, ...(params ? [params] : [])] as const;
};

export const getGetIdentitiesQueryOptions = <
  TData = Awaited<ReturnType<typeof getIdentities>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  params?: GetIdentitiesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getIdentities>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetIdentitiesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getIdentities>>> = ({
    signal,
  }) => getIdentities(params, { signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getIdentities>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetIdentitiesQueryResult = NonNullable<
  Awaited<ReturnType<typeof getIdentities>>
>;
export type GetIdentitiesQueryError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Get list of identities.
 */
export const useGetIdentities = <
  TData = Awaited<ReturnType<typeof getIdentities>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  params?: GetIdentitiesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getIdentities>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetIdentitiesQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * Add an identity.
 * @summary Add an identity.
 */
export const postIdentities = (
  identity: Identity,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<Identity>> => {
  return axios.post(`/identities`, identity, options);
};

export const getPostIdentitiesMutationOptions = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postIdentities>>,
    TError,
    { data: Identity },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postIdentities>>,
  TError,
  { data: Identity },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postIdentities>>,
    { data: Identity }
  > = (props) => {
    const { data } = props ?? {};

    return postIdentities(data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostIdentitiesMutationResult = NonNullable<
  Awaited<ReturnType<typeof postIdentities>>
>;
export type PostIdentitiesMutationBody = Identity;
export type PostIdentitiesMutationError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Add an identity.
 */
export const usePostIdentities = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postIdentities>>,
    TError,
    { data: Identity },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const mutationOptions = getPostIdentitiesMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Get a single identity.
 * @summary Get a single identity.
 */
export const getIdentitiesItem = (
  id: string,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<Identity>> => {
  return axios.get(`/identities/${id}`, options);
};

export const getGetIdentitiesItemQueryKey = (id: string) => {
  return [`/identities/${id}`] as const;
};

export const getGetIdentitiesItemQueryOptions = <
  TData = Awaited<ReturnType<typeof getIdentitiesItem>>,
  TError = AxiosError<
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
        Awaited<ReturnType<typeof getIdentitiesItem>>,
        TError,
        TData
      >
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetIdentitiesItemQueryKey(id);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getIdentitiesItem>>
  > = ({ signal }) => getIdentitiesItem(id, { signal, ...axiosOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getIdentitiesItem>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetIdentitiesItemQueryResult = NonNullable<
  Awaited<ReturnType<typeof getIdentitiesItem>>
>;
export type GetIdentitiesItemQueryError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Get a single identity.
 */
export const useGetIdentitiesItem = <
  TData = Awaited<ReturnType<typeof getIdentitiesItem>>,
  TError = AxiosError<
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
        Awaited<ReturnType<typeof getIdentitiesItem>>,
        TError,
        TData
      >
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetIdentitiesItemQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * Update an identity.
 * @summary Update an identity.
 */
export const putIdentitiesItem = (
  id: string,
  identity: Identity,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<Identity>> => {
  return axios.put(`/identities/${id}`, identity, options);
};

export const getPutIdentitiesItemMutationOptions = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putIdentitiesItem>>,
    TError,
    { id: string; data: Identity },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putIdentitiesItem>>,
  TError,
  { id: string; data: Identity },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putIdentitiesItem>>,
    { id: string; data: Identity }
  > = (props) => {
    const { id, data } = props ?? {};

    return putIdentitiesItem(id, data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutIdentitiesItemMutationResult = NonNullable<
  Awaited<ReturnType<typeof putIdentitiesItem>>
>;
export type PutIdentitiesItemMutationBody = Identity;
export type PutIdentitiesItemMutationError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Update an identity.
 */
export const usePutIdentitiesItem = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putIdentitiesItem>>,
    TError,
    { id: string; data: Identity },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const mutationOptions = getPutIdentitiesItemMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Remove an identity.
 * @summary Remove an identity.
 */
export const deleteIdentitiesItem = (
  id: string,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<void>> => {
  return axios.delete(`/identities/${id}`, options);
};

export const getDeleteIdentitiesItemMutationOptions = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteIdentitiesItem>>,
    TError,
    { id: string },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteIdentitiesItem>>,
  TError,
  { id: string },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteIdentitiesItem>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return deleteIdentitiesItem(id, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteIdentitiesItemMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteIdentitiesItem>>
>;

export type DeleteIdentitiesItemMutationError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Remove an identity.
 */
export const useDeleteIdentitiesItem = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteIdentitiesItem>>,
    TError,
    { id: string },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const mutationOptions = getDeleteIdentitiesItemMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * List groups the identity is a member of.
 * @summary List groups the identity is a member of.
 */
export const getIdentitiesItemGroups = (
  id: string,
  params?: GetIdentitiesItemGroupsParams,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<GetIdentityGroupsResponse>> => {
  return axios.get(`/identities/${id}/groups`, {
    ...options,
    params: { ...params, ...options?.params },
  });
};

export const getGetIdentitiesItemGroupsQueryKey = (
  id: string,
  params?: GetIdentitiesItemGroupsParams,
) => {
  return [`/identities/${id}/groups`, ...(params ? [params] : [])] as const;
};

export const getGetIdentitiesItemGroupsQueryOptions = <
  TData = Awaited<ReturnType<typeof getIdentitiesItemGroups>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  id: string,
  params?: GetIdentitiesItemGroupsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getIdentitiesItemGroups>>,
        TError,
        TData
      >
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetIdentitiesItemGroupsQueryKey(id, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getIdentitiesItemGroups>>
  > = ({ signal }) =>
    getIdentitiesItemGroups(id, params, { signal, ...axiosOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getIdentitiesItemGroups>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetIdentitiesItemGroupsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getIdentitiesItemGroups>>
>;
export type GetIdentitiesItemGroupsQueryError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary List groups the identity is a member of.
 */
export const useGetIdentitiesItemGroups = <
  TData = Awaited<ReturnType<typeof getIdentitiesItemGroups>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  id: string,
  params?: GetIdentitiesItemGroupsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getIdentitiesItemGroups>>,
        TError,
        TData
      >
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetIdentitiesItemGroupsQueryOptions(
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
 * Add or remove the identity to/from a group.
 * @summary Add or remove the identity to/from a group.
 */
export const patchIdentitiesItemGroups = (
  id: string,
  identityGroupsPatchRequestBody: IdentityGroupsPatchRequestBody,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<void>> => {
  return axios.patch(
    `/identities/${id}/groups`,
    identityGroupsPatchRequestBody,
    options,
  );
};

export const getPatchIdentitiesItemGroupsMutationOptions = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchIdentitiesItemGroups>>,
    TError,
    { id: string; data: IdentityGroupsPatchRequestBody },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchIdentitiesItemGroups>>,
  TError,
  { id: string; data: IdentityGroupsPatchRequestBody },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchIdentitiesItemGroups>>,
    { id: string; data: IdentityGroupsPatchRequestBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return patchIdentitiesItemGroups(id, data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchIdentitiesItemGroupsMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchIdentitiesItemGroups>>
>;
export type PatchIdentitiesItemGroupsMutationBody =
  IdentityGroupsPatchRequestBody;
export type PatchIdentitiesItemGroupsMutationError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Add or remove the identity to/from a group.
 */
export const usePatchIdentitiesItemGroups = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchIdentitiesItemGroups>>,
    TError,
    { id: string; data: IdentityGroupsPatchRequestBody },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const mutationOptions = getPatchIdentitiesItemGroupsMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * List roles assigned to the identity.
 * @summary List roles assigned to the identity.
 */
export const getIdentitiesItemRoles = (
  id: string,
  params?: GetIdentitiesItemRolesParams,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<GetIdentityRolesResponse>> => {
  return axios.get(`/identities/${id}/roles`, {
    ...options,
    params: { ...params, ...options?.params },
  });
};

export const getGetIdentitiesItemRolesQueryKey = (
  id: string,
  params?: GetIdentitiesItemRolesParams,
) => {
  return [`/identities/${id}/roles`, ...(params ? [params] : [])] as const;
};

export const getGetIdentitiesItemRolesQueryOptions = <
  TData = Awaited<ReturnType<typeof getIdentitiesItemRoles>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  id: string,
  params?: GetIdentitiesItemRolesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getIdentitiesItemRoles>>,
        TError,
        TData
      >
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetIdentitiesItemRolesQueryKey(id, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getIdentitiesItemRoles>>
  > = ({ signal }) =>
    getIdentitiesItemRoles(id, params, { signal, ...axiosOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getIdentitiesItemRoles>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetIdentitiesItemRolesQueryResult = NonNullable<
  Awaited<ReturnType<typeof getIdentitiesItemRoles>>
>;
export type GetIdentitiesItemRolesQueryError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary List roles assigned to the identity.
 */
export const useGetIdentitiesItemRoles = <
  TData = Awaited<ReturnType<typeof getIdentitiesItemRoles>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  id: string,
  params?: GetIdentitiesItemRolesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getIdentitiesItemRoles>>,
        TError,
        TData
      >
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetIdentitiesItemRolesQueryOptions(
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
 * Add or remove the identity to/from a role.
 * @summary Add or remove the identity to/from a role.
 */
export const patchIdentitiesItemRoles = (
  id: string,
  identityRolesPatchRequestBody: IdentityRolesPatchRequestBody,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<void>> => {
  return axios.patch(
    `/identities/${id}/roles`,
    identityRolesPatchRequestBody,
    options,
  );
};

export const getPatchIdentitiesItemRolesMutationOptions = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchIdentitiesItemRoles>>,
    TError,
    { id: string; data: IdentityRolesPatchRequestBody },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchIdentitiesItemRoles>>,
  TError,
  { id: string; data: IdentityRolesPatchRequestBody },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchIdentitiesItemRoles>>,
    { id: string; data: IdentityRolesPatchRequestBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return patchIdentitiesItemRoles(id, data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchIdentitiesItemRolesMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchIdentitiesItemRoles>>
>;
export type PatchIdentitiesItemRolesMutationBody =
  IdentityRolesPatchRequestBody;
export type PatchIdentitiesItemRolesMutationError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Add or remove the identity to/from a role.
 */
export const usePatchIdentitiesItemRoles = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchIdentitiesItemRoles>>,
    TError,
    { id: string; data: IdentityRolesPatchRequestBody },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const mutationOptions = getPatchIdentitiesItemRolesMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * List entitlements the identity has.
 * @summary List entitlements the identity has.
 */
export const getIdentitiesItemEntitlements = (
  id: string,
  params?: GetIdentitiesItemEntitlementsParams,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<GetIdentityEntitlementsResponse>> => {
  return axios.get(`/identities/${id}/entitlements`, {
    ...options,
    params: { ...params, ...options?.params },
  });
};

export const getGetIdentitiesItemEntitlementsQueryKey = (
  id: string,
  params?: GetIdentitiesItemEntitlementsParams,
) => {
  return [
    `/identities/${id}/entitlements`,
    ...(params ? [params] : []),
  ] as const;
};

export const getGetIdentitiesItemEntitlementsQueryOptions = <
  TData = Awaited<ReturnType<typeof getIdentitiesItemEntitlements>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  id: string,
  params?: GetIdentitiesItemEntitlementsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getIdentitiesItemEntitlements>>,
        TError,
        TData
      >
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getGetIdentitiesItemEntitlementsQueryKey(id, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getIdentitiesItemEntitlements>>
  > = ({ signal }) =>
    getIdentitiesItemEntitlements(id, params, { signal, ...axiosOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getIdentitiesItemEntitlements>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetIdentitiesItemEntitlementsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getIdentitiesItemEntitlements>>
>;
export type GetIdentitiesItemEntitlementsQueryError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary List entitlements the identity has.
 */
export const useGetIdentitiesItemEntitlements = <
  TData = Awaited<ReturnType<typeof getIdentitiesItemEntitlements>>,
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
>(
  id: string,
  params?: GetIdentitiesItemEntitlementsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getIdentitiesItemEntitlements>>,
        TError,
        TData
      >
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetIdentitiesItemEntitlementsQueryOptions(
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
 * Add or remove entitlement to/from an identity.
 * @summary Add or remove entitlement to/from an identity.
 */
export const patchIdentitiesItemEntitlements = (
  id: string,
  identityEntitlementsPatchRequestBody: IdentityEntitlementsPatchRequestBody,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<void>> => {
  return axios.patch(
    `/identities/${id}/entitlements`,
    identityEntitlementsPatchRequestBody,
    options,
  );
};

export const getPatchIdentitiesItemEntitlementsMutationOptions = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchIdentitiesItemEntitlements>>,
    TError,
    { id: string; data: IdentityEntitlementsPatchRequestBody },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchIdentitiesItemEntitlements>>,
  TError,
  { id: string; data: IdentityEntitlementsPatchRequestBody },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchIdentitiesItemEntitlements>>,
    { id: string; data: IdentityEntitlementsPatchRequestBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return patchIdentitiesItemEntitlements(id, data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchIdentitiesItemEntitlementsMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchIdentitiesItemEntitlements>>
>;
export type PatchIdentitiesItemEntitlementsMutationBody =
  IdentityEntitlementsPatchRequestBody;
export type PatchIdentitiesItemEntitlementsMutationError = AxiosError<
  BadRequestResponse | UnauthorizedResponse | NotFoundResponse | DefaultResponse
>;

/**
 * @summary Add or remove entitlement to/from an identity.
 */
export const usePatchIdentitiesItemEntitlements = <
  TError = AxiosError<
    | BadRequestResponse
    | UnauthorizedResponse
    | NotFoundResponse
    | DefaultResponse
  >,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchIdentitiesItemEntitlements>>,
    TError,
    { id: string; data: IdentityEntitlementsPatchRequestBody },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const mutationOptions =
    getPatchIdentitiesItemEntitlementsMutationOptions(options);

  return useMutation(mutationOptions);
};
