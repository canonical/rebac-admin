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
export type GetResources200 = Response & Resources;

/**
 * The number of records to return per response
 */
export type PaginationSizeParameter = number;

export type GetResourcesParams = {
  /**
   * The number of records to return per response
   */
  size?: PaginationSizeParameter;
  /**
   * The record offset to return results from
   */
  page?: PaginationPageParameter;
};

export type GetEntitlements200 = Response & EntityEntitlements;

export type GetEntitlementsParams = {
  /**
   * The number of records to return per response
   */
  size?: PaginationSizeParameter;
  /**
   * The record offset to return results from
   */
  page?: PaginationPageParameter;
  /**
   * A string to filter results by
   */
  filter?: FilterParamParameter;
};

export type GetRolesIdGroups200 = Response & Groups;

export type GetRolesIdGroupsParams = {
  /**
   * The number of records to return per response
   */
  size?: PaginationSizeParameter;
  /**
   * The record offset to return results from
   */
  page?: PaginationPageParameter;
};

export type GetRolesIdEntitlements200 = Response & Entitlements;

export type GetRolesIdEntitlementsParams = {
  /**
   * The number of records to return per response
   */
  size?: PaginationSizeParameter;
  /**
   * The record offset to return results from
   */
  page?: PaginationPageParameter;
};

export type GetRolesId200 = Response & Roles;

export type GetRoles200 = Response & Roles;

export type GetRolesParams = {
  /**
   * The number of records to return per response
   */
  size?: PaginationSizeParameter;
  /**
   * The record offset to return results from
   */
  page?: PaginationPageParameter;
  /**
   * A string to filter results by
   */
  filter?: FilterParamParameter;
};

export type GetGroupsIdIdentities200 = Response & Identities;

export type GetGroupsIdIdentitiesParams = {
  /**
   * The number of records to return per response
   */
  size?: PaginationSizeParameter;
  /**
   * The record offset to return results from
   */
  page?: PaginationPageParameter;
};

export type GetGroupsIdEntitlements200 = Response & Entitlements;

export type GetGroupsIdEntitlementsParams = {
  /**
   * The number of records to return per response
   */
  size?: PaginationSizeParameter;
  /**
   * The record offset to return results from
   */
  page?: PaginationPageParameter;
};

export type GetGroupsIdRoles200 = Response & Roles;

export type GetGroupsId200 = Response & Groups;

export type GetGroups200 = Response & Groups;

export type GetUsersIdEntitlements200 = Response & Entitlements;

export type GetUsersIdEntitlementsParams = {
  /**
   * The number of records to return per response
   */
  size?: PaginationSizeParameter;
  /**
   * The record offset to return results from
   */
  page?: PaginationPageParameter;
};

export type GetUsersIdRoles200 = Response & Roles;

export type GetUsersIdRolesParams = {
  /**
   * The number of records to return per response
   */
  size?: PaginationSizeParameter;
  /**
   * The record offset to return results from
   */
  page?: PaginationPageParameter;
};

export type GetUsersIdGroups200 = Response & Groups;

export type GetUsersIdGroupsParams = {
  /**
   * The number of records to return per response
   */
  size?: PaginationSizeParameter;
  /**
   * The record offset to return results from
   */
  page?: PaginationPageParameter;
};

export type GetUsersId200 = Response & Users;

export type GetUsers200 = Response & Users;

export type GetUsersParams = {
  /**
   * The number of records to return per response
   */
  size?: PaginationSizeParameter;
  /**
   * The record offset to return results from
   */
  page?: PaginationPageParameter;
  /**
   * A string to filter results by
   */
  filter?: FilterParamParameter;
};

export type GetAuthenticationId200 = Response & IdentityProviders;

export type GetAuthentication200 = Response & IdentityProviders;

export type GetAuthenticationParams = {
  /**
   * The number of records to return per response
   */
  size?: PaginationSizeParameter;
  /**
   * The record offset to return results from
   */
  page?: PaginationPageParameter;
};

export type GetAuthenticationProvidersParams = {
  /**
   * The number of records to return per response
   */
  size?: PaginationSizeParameter;
  /**
   * The record offset to return results from
   */
  page?: PaginationPageParameter;
};

/**
 * A string to filter results by
 */
export type FilterParamParameter = string;

/**
 * The record offset to return results from
 */
export type PaginationPageParameter = number;

export type _ResponseMeta = {
  page: number;
  size: number;
  total: number;
};

export interface Response {
  _links: _ResponseLinks;
  _meta: _ResponseMeta;
  message: string;
  status: number;
}

/**
 * Unexpected error
 */
export type DefaultResponse = Response;

/**
 * Not found
 */
export type NotFoundResponse = Response;

/**
 * Unauthorized
 */
export type UnauthorizedResponse = Response;

/**
 * Bad Request
 */
export type BadRequestResponse = Response;

export type _ResponseLinksNext = {
  href: string;
};

export type _ResponseLinks = {
  next: _ResponseLinksNext;
};

export interface Resource {
  entity: Entity;
  id: string;
  name: string;
  parent: Resource;
}

export interface Resources {
  data: Resource[];
}

export interface EntityEntitlements {
  data: EntityEntitlementsDataItem[];
}

export type Entitlement = string;

export interface Entitlements {
  data: Entitlement[];
}

export type Entity = string;

export type EntityEntitlementsDataItem = {
  entitlement?: Entitlement;
  entity?: Entity;
};

export interface IdentitiesPatchRequest {
  identities: string[];
}

export type Identity = string;

export interface Identities {
  data: Identity[];
}

export type EntitlementsPatchRequestPermissionsItem = {
  object: string;
  relation: string;
};

export interface EntitlementsPatchRequest {
  permissions: EntitlementsPatchRequestPermissionsItem[];
}

export interface RoleObject {
  id: string;
  name: string;
}

export type Role = string;

export interface RolesPostRequest {
  roles: string[];
}

export interface Roles {
  data: Role[];
}

export interface GroupObject {
  name: string;
}

export type Group = string;

export interface Groups {
  data: Group[];
}

export interface User {
  addedBy: string;
  certificate?: string;
  email: string;
  firstName?: string;
  groups?: number;
  id?: string;
  joined?: string;
  lastLogin?: string;
  lastName?: string;
  permissions?: number;
  roles?: number;
  source: string;
}

export interface Users {
  data: User[];
}

export enum IdentityProviderSyncMode {
  import = "import",
}
export interface IdentityProvider {
  acceptsPromptNone?: boolean;
  accountLinkingOnly?: boolean;
  clientID?: string;
  clientSecret?: string;
  disableUserInfo?: boolean;
  enabled?: boolean;
  id?: string;
  name?: string;
  redirectUrl?: string;
  storeTokens?: boolean;
  storeTokensReadable?: boolean;
  syncMode?: IdentityProviderSyncMode;
  trustEmail?: boolean;
  userCount?: number;
}

export interface IdentityProviders {
  data: IdentityProvider[];
}
