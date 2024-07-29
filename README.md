# Canonical ReBAC Admin

This is a shared UI for managing ReBAC permissions.

- [Install](#install)
- [Displaying the component](#displaying-the-component)
  - [Import CSS](#import-css)
- [Config](#config)
- [Navigation](#navigation)
- [Limiting access](#limiting-access)
- [React Query](#react-query)

## Install

You can add the rebac-admin package with:

```bash
yarn add @canonical/rebac-admin
```

You will also need the following peer dependencies if you don't have them already:

```bash
yarn add @canonical/react-components @types/react @types/react-dom react react-dom vanilla-framework react-router-dom axios @tanstack/react-query formik yup
```

## Displaying the component

The ReBAC admin is displayed using a single component. This component will
handle routing based on the URL it is displayed at. If using react-router
then this route should end with `/*` so that the admin component can receive
child routes.

Make sure to also [import the css](#import-css).

```jsx
import { ReBACAdmin } from "@canonical/rebac-admin";
import { Route, Routes } from "react-router-dom";

const App = (): JSX.Element => (
  <Routes>
    ...
    <Route
      path="/permissions/*"
      element={<ReBACAdmin apiURL="http://example.com/api" />}
    />
    ...
  </Routes>
);
```

If the host project is not using React Router then the `ReBACAdmin` component
will need to be wrapped in a router, with `basename` set to the path that the
admin component is displayed at.

```jsx
import { ReBACAdmin } from "@canonical/rebac-admin";
import { BrowserRouter } from "react-router-dom";

const Permissions = (): JSX.Element => (
  <BrowserRouter basename="/permissions">
    <ReBACAdmin apiURL="http://example.com/api" />
  </BrowserRouter>
);
```

### Import CSS

Inside your main CSS file add the following:

```css
@import "@canonical/rebac-admin/dist/rebac-admin.css";
```

## Config

The following props can be provided to the `ReBACAdmin` component to configure the admin.

| Prop     | Description                                                                          | Examples                       |
| :------- | :----------------------------------------------------------------------------------- | :----------------------------- |
| apiURL   | The absolute URL of the ReBAC API, including domain if the API is hosted externally. | http://example.com/api/, /api/ |
| asidePanelId | The element ID to use to render aside panels into. Should not begin with "#".        | app-aside                      |
| logLevel | The level of logging to be used by the logger. (optional; default value: "silent")   | trace, debug, error, silent    |

The available `logLevel` options are `trace`, `debug`, `info`, `warn`, `error`
and `silent`. `trace` displays all logs, while `silent` disables everything.
Every other option displays every log of the same level and higher. All options
are passed as a string of lowercase letters.

## Navigation

Links to each subsection of the ReBAC admin will need to be displayed within
the host app's navigation.

The rebac-admin package exposes an object of urls. This object contains not only
the top level URLs, but also the subsections should you wish to provide deep
links to the Admin.

The top level links wrap a `NavLink` component from React Router and require a
`baseURL` prop that should be set to the location that the `ReBACAdmin`
component is rendered at.

```jsx
import {
  AccessGovernanceLink,
  AuthenticationLink,
  EntitlementsLink,
  GroupsLink,
  ResourcesLink,
  RolesLink,
  UsersLink,
} from "@canonical/rebac-admin";

const Nav = (): JSX.Element => (
  <>
    <AccessGovernanceLink baseURL="/permissions" />
    <AuthenticationLink baseURL="/permissions" />
    <EntitlementsLink baseURL="/permissions" />
    <GroupsLink baseURL="/permissions" />
    <ResourcesLink baseURL="/permissions" />
    <RolesLink baseURL="/permissions" />
    <UsersLink baseURL="/permissions" />
  </>
);
```

The URLs can be accessed through the `url` function that takes a base URL
string that, like the links above, should be set to the location that the `ReBACAdmin`
component is rendered at.

Some URLs are functions that take an object of the params required by the
URL. These params are provided in the function signatures.

```jsx
import { urls } from "@canonical/rebac-admin";

const Links = (): JSX.Element => {
  const adminURLs = urls("/permissions");
  return (
    <>
      <a href={adminURLs.users.add}>Add user</a>
      <a href={adminURLs.users.edit({ id: "abc" })}>Edit user</a>
    </>
  );
};

```

## Limiting access

The admin component should only be displayed to users that have access to manage
permissions. Determining if the user has the correct permissions needs to be
handled in the host app's data layer in the same way that the host would limit
other UI access.

For example, Juju Dashboard can use the existing controller API to check OpenFGA
relations. Using that API the dashboard can check the user's relations and
determine if it should render the `ReBACAdmin` component and associated
navigation.

## React Query

ReBAC Admin will use the QueryClient from the host application if it exists.
This allows you to have central control over caching, error handling etc.

**IMPORTANT:** If you've set up React Query you **MUST** set `staleTime` to some
non-zero value so that queries are cached ([by default](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults) queries are not cached) to prevent nested queries from causing
infinite loops.

```
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
    },
  },
});
```