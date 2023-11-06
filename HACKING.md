# Developing Canonical ReBAC Admin

#### In this document:

- [Development setup](#development-setup)
- [Testing in host projects](#testing-in-host-projects)
  - [Install from repo](#install-from-repo)
  - [Local link](#local-link)
- [Testing private repository access](#testing-private-repository-access)
- [Download openapi.yaml](#download-openapiyaml)
- [Build API files](#build-api-files)

## Development setup

To develop ReBAC Admin you will need to do the following steps:

1. Install Yarn.
2. Fetch this repo.
3. Run `yarn install`.
4. Now you can run the project with `yarn start`.

## Testing in host projects

To test ReBAC Admin in a host project you can either use a repo/branch directory
from GitHub, or to develop locally you can use `yarn link`.

### Install from repo

To install from a GitHub repo make sure you [have private repository
access](#testing-private-repository-access). Now you can add the package with:

```bash
yarn add @canonical/rebac-admin@git+ssh://git@github.com:<username>/rebac-admin.git#<branch>
```

Or if the project already uses rebac-admin you can change the line in
package.json:

```bash
"@canonical/rebac-admin": "git+ssh://git@github.com:<username>/rebac-admin.git#<branch>",
```

### Local link

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

## Testing private repository access

To be able to install from a private GitHub repository make sure you have
[ssh keys for GitHub set up](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys)
on the machine or container you're using to install the
package. You can test this with:

```bash
git ls-remote git@github.com:canonical/rebac-admin.git
```

If successful you should see a list of refs.

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
  repository. For instance, you can provide a
  [personal access token (classic)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#personal-access-tokens-classic)
  with "full control of private repositories" scope. You are required to provide
  this token either as an environment variable or as the sole argument for the
  command mentioned below.

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
