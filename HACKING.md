# Developing Canonical ReBAC Admin

#### In this document:

- [Development setup](#development-setup)
- [Testing in host projects](#testing-in-host-projects)
  - [Install from repo](#install-from-repo)
  - [Local link](#local-link)
- [Testing private repository access](#testing-private-repository-access)

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
    "@types/react": "portal:/absolute/path/to/rebac-admin/node_modules/@types/react",
    "@types/react-dom": "portal:/absolute/path/to/rebac-admin/node_modules/@types/react-dom"
  }
```

Finally run:

```bash
yarn install
```

Then you should be able to run your project as normal.

When you're finished you can clean up the links by running the following in your host project:

```bash
yarn unlink --all
```

## Testing private repository access

To be able to install from a private GitHub repository make sure you have [ssh
keys for GitHub set up](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys) on the machine or container you're using to install the
package. You can test this with:

```bash
git ls-remote git@github.com:canonical/rebac-admin.git
```

If successful you should see a list of refs.
