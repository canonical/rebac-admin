import cloneDeep from "clone-deep";

import { argPath } from "utils";

const urls = {
  accessGovernance: {
    index: "/access-governance",
    reports: "/access-governance/reports",
    log: "/access-governance/log",
  },
  authentication: {
    index: "/authentication",
    add: "/authentication/add",
    local: "/authentication/local",
  },
  entitlements: "/entitlements",
  groups: {
    index: "/groups",
    add: "/groups/add",
    edit: argPath<{ id: string }>("/groups/:id/edit"),
    delete: argPath<{ id: string }>("/groups/:id/delete"),
  },
  index: "/",
  resources: {
    index: "/resources",
    list: "/resources/list",
  },
  roles: {
    index: "/roles",
    add: "/roles/add",
    edit: argPath<{ id: string }>("/roles/:id/edit"),
    delete: argPath<{ id: string }>("/roles/:id/delete"),
  },
  users: {
    index: "/users",
    add: "/users/add",
    edit: argPath<{ id: string }>("/users/:id/edit"),
    delete: argPath<{ id: string }>("/users/:id/delete"),
  },
};

const prefixSection = <S extends object>(prefix: string, section: S): S => {
  for (const key in section) {
    const entry = section[key];
    if (entry && typeof entry === "object") {
      // Run the prefixer over the nested object.
      section[key] = prefixSection(prefix, entry);
    } else if (typeof entry === "function") {
      // Wrap the function in another that will prefix the result.
      section[key] = ((...args: unknown[]) =>
        `${prefix}${entry(...args)}`) as typeof entry;
    } else if (typeof entry === "string") {
      // Prefix strings.
      section[key] = `${prefix}${entry}` as typeof entry;
    }
  }
  return section;
};

export const prefixedURLs = (baseURL: string) => {
  const prefixedURLs = cloneDeep(urls);
  let prefix = baseURL.startsWith("/") ? baseURL : `/${baseURL}`;
  prefix = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
  return prefixSection(prefix, prefixedURLs);
};

export default urls;
