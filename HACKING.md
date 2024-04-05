# Developing Canonical ReBAC Admin

#### In this document:

- [Development setup](#development-setup)
- [Develop with external API](#develop-with-external-api)
  - [Proxied requests](#proxied-requests)
- [Testing in host projects](#testing-in-host-projects)
- [Serving mock API](#serving-mock-api)
- [Download openapi.yaml](#download-openapiyaml)
- [Build API files](#build-api-files)
- [Codebase and development guidelines](#codebase-and-development-guidelines)
  - [React](#react)
    - [Components](#components)
    - [Demo files](#demo-files)
      - [Demo service](#demo-service)
    - [Package files](#package-files)
      - [Common files](#common-files)
      - [Views](#views)
      - [SCSS](#scss)
  - [React Query](#react-query)
  - [TypeScript](#typescript)
  - [Testing](#testing)
    - [Test factories](#test-factories)
  - [External libraries](#external-libraries)
    - [Vanilla Framework](#vanilla-framework)
    - [Vanilla React Components](#vanilla-react-components)

## Development setup

To develop ReBAC Admin you will need to do the following steps:

1. Install Yarn.
2. Fetch this repo.
3. Run `yarn install`.
4. _Optional_: configure the project to [use an external
   API](#develop-with-external-api).
5. Now you can run the project with `yarn start`.

## Develop with external API

By default this project uses a mocked API. To develop against a real API you can
create an `.env.local` file in the root of the project and set the following
variables:

```
VITE_DEMO_API_MOCKED=false
VITE_DEMO_API_URL=http://example.com/api
```

### Proxied requests

When working with the production API you may need to proxy requests to prevent
CORS errors.

To do this you will need to set the server address to proxy requests to:

```
VITE_DEMO_API_MOCKED=false
# Set the API URL to the path that the API is served on:
VITE_DEMO_API_URL=/api/v0
# Set the proxy URL to the address of the API server:
VITE_DEMO_PROXY_API_URL=http://1.2.3.4:1234/
```

## Testing in host projects

To test ReBAC Admin in a host project you can use `yarn link`.

To use a local link, first make sure this project is set up by
running the following commands inside the rebac-admin repo:

```bash
yarn install
yarn build # or yarn build --watch if you want this project to update as you make changes.
```

Now, inside your host project run:

```bash
yarn link ~/path/to/rebac-admin --private
```

To prevent multiple copies of React being loaded and type conflicts, open
your host's package.json and link to the modules inside the rebac-admin repo:

```json
  "resolutions": {
    "@canonical/rebac-admin": "portal:/absolute/path/to/rebac-admin",
    "react": "portal:/absolute/path/to/rebac-admin/node_modules/react",
    "react-dom": "portal:/absolute/path/to/rebac-admin/node_modules/react-dom",
    "react-router-dom": "portal:/absolute/path/to/rebac-admin/node_modules/react-router-dom",
    "@types/react": "portal:/absolute/path/to/rebac-admin/node_modules/@types/react",
    "@types/react-dom": "portal:/absolute/path/to/rebac-admin/node_modules/@types/react-dom"
  }
```

Finally run:

```bash
yarn install
```

Then you should be able to run your project as normal.

When you're finished you can clean up the links by running the following in your
host project:

```bash
yarn unlink --all
```

## Serving mock API

You can test a host project using the mock API provided by this package if you
don't have an API implementation.

First checkout this repo:

```bash
git clone git@github.com:canonical/rebac-admin.git
```

Next install the dependencies:

```bash
cd rebac-admin
yarn install
```

Finally start the mock API server:

```
yarn serve-mock-api
```

Now you can use the API in your host project. If you haven't already then follow
the [install instructions](/README.md#install) to add the ReBACAdmin component
to your project.

Set the apiURL to the address and port the API is being served at. By default
the api is served using port `8412`.

```
<ReBACAdmin apiURL="http://localhost:8412/api" />
```

Load your app and you should be able to make requests to the mock API.

## Download openapi.yaml

Before starting, make sure that the following environment variables are setup
correctly either in `.env` or in `.env.local`:

- `API_SPEC_VERSION`: represents the version of the `openapi.yaml` spec file
  to download. If not provided, it defaults to `main` and the spec file from the
  `main` branch of
  [Openfga Admin Openapi Spec](https://github.com/canonical/openfga-admin-openapi-spec/tree/main)
  will be downloaded.

Once the environment variables are set up correctly, to fetch the specified
version of `openapi.yaml` spec file, run:

```bash
yarn fetch-api-spec
```

In case the GitHub Access Token isn't defined as an environment variable and/or
you want to override the GitHub Access Token defined as an environment variable,
run:

```bash
yarn fetch-api-spec INSERT_ACCESS_TOKEN
```

Replace `INSERT_ACCESS_TOKEN` with your valid GitHub Personal Access Token.

_Note: If defined in both files, environment variables defined in `.env.local`
will be given priority over those defined in `.env`._

## Build API files

To build the API files using Orval, run:

```bash
yarn build-api
```

Once the script runs successfully, the built API files can be found in `src/api`.

_Note: The API files are built from the `openapi.yaml` spec file. In case the
spec file is not present in the root of the repository, the above command will
first try to download it using the procedure described in
[Download openapi.yaml](#download-openapiyaml)._

## Codebase and development guidelines

### React

ReBAC Admin uses [React](https://react.dev/) for its component based UI. The
[Redux dev tools](https://github.com/reduxjs/redux-devtools) extension can be useful
during development.

#### Components

This project uses [function
components](https://react.dev/learn/your-first-component#defining-a-component)
and [hooks](https://react.dev/reference/react) over class based components.

It is recommended to have one component per file, and one component per
directory. A typical component directory will have the structure:

- `_component.scss` (any SCSS specific to this component)
- `Component.tsx` (the component itself)
- `Component.test.tsx` (tests specific to this component)
- `index.tsx` (export the component from this file)

#### Demo files

The `demo` folder contains an example application layout that displays the ReBAC
Admin. This can be used in development to view the admin in context and is
displayed by running `yarn start`.

All files in the `demo` folder are for development only and are not included in
the built package.

##### Demo service

The `demo` app is deployed to the Canonical web team's demo service when a PR is
created on GitHub. The demo build is configured in `vite-demo.config.ts`.

#### Package files

The package source is contained in `src` and its contents are built for the
rebac-admin package using Vite's library mode.

Components and modules that are exposed by the module should be exported in `src/index.ts`.

##### Common files

Where possible write reusable code which should live in the top level
directories e.g. `src/components`, `src/hooks`, `src/utils`.

##### Views

Distinct views of the app live in the `src/views` directory. These will usually equate to the
top level routes.

##### SCSS

Shared SCSS should live in the `src/scss` directory, but SCSS specific to a page
or component should live in the component's directory and be imported inside the
component.

### React Query

ReBAC Admin uses [React Query](https://tanstack.com/query/latest) to communicate
with the API.

Each query has a hook that has been built from the API definition and can be
found in the `src/api` sub-directories.

### TypeScript

ReBAC Admin is written in TypeScript. Wherever possible strict TypeScript
should be used.

### Testing

The admin is unit tested and interaction tested using [Vitest](https://vitest.dev/) and [React
Testing Library](https://testing-library.com/).

#### Test factories

The admin uses [Faker](https://fakerjs.dev/) test factories instead of data dumps to allow each test to
declare the data required for it to pass.

Test factories are generated from the API definition and can be found in the
`.msw.ts` files in the `src/api` sub-directories.

### External libraries

ReBAC Admin makes use of a few external libraries that are built and
maintained by Canonical.

#### Vanilla Framework

[Vanilla
Framework](https://github.com/canonical/vanilla-framework) is a CSS framework
used to provide consistency across Canonical's codebases.

#### Vanilla React Components

[Vanilla React
Components](https://github.com/canonical/react-components) is a React
implementation of Vanilla Framework and is the preferred method of consuming
Vanilla Framework elements.
