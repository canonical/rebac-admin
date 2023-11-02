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

export default urls;
