import type { FC } from "react";

import urls from "urls";

import BaseLink from "./BaseLink";
import type { BaseLinkProps } from "./BaseLink/BaseLink";

type LinkProps = Omit<BaseLinkProps, "to">;

export const IndexLink: FC<LinkProps> = (props) => (
  <BaseLink {...props} to={urls.index}>
    Canonical ReBAC Admin
  </BaseLink>
);

export const AccessGovernanceLink: FC<LinkProps> = (props) => (
  <BaseLink {...props} to={urls.accessGovernance.index}>
    Access Governance
  </BaseLink>
);

export const AuthenticationLink: FC<LinkProps> = (props) => (
  <BaseLink {...props} to={urls.authentication.index}>
    Authentication
  </BaseLink>
);

export const EntitlementsLink: FC<LinkProps> = (props) => (
  <BaseLink {...props} to={urls.entitlements}>
    Entitlements
  </BaseLink>
);

export const GroupsLink: FC<LinkProps> = (props) => (
  <BaseLink {...props} to={urls.groups.index}>
    Groups
  </BaseLink>
);

export const ResourcesLink: FC<LinkProps> = (props) => (
  <BaseLink {...props} to={urls.resources.index}>
    Resources
  </BaseLink>
);

export const RolesLink: FC<LinkProps> = (props) => (
  <BaseLink {...props} to={urls.roles.index}>
    Roles
  </BaseLink>
);

export const UsersLink: FC<LinkProps> = (props) => (
  <BaseLink {...props} to={urls.users.index}>
    Users
  </BaseLink>
);
