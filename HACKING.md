# Developing Canonical ReBAC Admin

#### In this document:

- [Development setup](#development-setup)
  - [VS Code](#vs-code)
- [Download openapi.yaml](#download-openapiyaml)
- [Build API files](#build-api-files)

## Development setup

To develop ReBAC Admin you will need to do the following steps:

1. Install Yarn.
2. Fetch this repo.
3. Run `yarn install`.
4. Now you can run the project with `yarn start`.
5. If using VS Code you need to follow the [additional steps](#vs-code).

### VS Code

VS Code and Yarn require some additional configuration to work together when
using Yarn PnP. Follow the steps in the
[Yarn docs](https://yarnpkg.com/getting-started/editor-sdks#vscode).

## Download openapi.yaml

Before starting, make sure that the following environment variables are setup
correctly either in `.env` or in `.env.local`:

- `API_SPEC_VERSION`: represents the version of the `openapi.yaml` spec file
  to download. If not provided, it defaults to `main` and the spec file from the
  `main` branch of
  [Openfga Admin Openapi Spec](https://github.com/canonical/openfga-admin-openapi-spec/tree/main)
  will be downloaded.
- `GITHUB_ACCESS_TOKEN`: represents the valid GitHub Personal Access Token with
  read access to the
  [Openfga Admin Openapi Spec](https://github.com/canonical/openfga-admin-openapi-spec/)
  repository. You are required to provide this token either as an environment
  variable or as the sole argument for the command mentioned below.

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

Once the script runs succesfully, the built API files can be found in `src/api`.

_Note: The API files are built from the `openapi.yaml` spec file. In case the
spec file is not present in the root of the repository, the above command will
first try to download it using the procedure described in
[Download openapi.yaml](#download-openapiyaml)._
