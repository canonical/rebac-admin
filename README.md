# Canonical ReBAC Admin

This is a shared UI for managing ReBAC permissions.

## Install

First, make sure you have [ssh keys for GitHub set up](HACKING.md#testing-private-repository-access).

Now you can add the rebac-admin package with:

```bash
yarn add @canonical/rebac-admin@git+ssh://git@github.com:canonical/rebac-admin.git
```

You will also need the following peer dependencies if you don't have them already:

```bash
yarn add @canonical/react-components @types/react @types/react-dom react react-dom vanilla-framework react-router-dom
```

## Config

The following props can be provided to the `ReBACAdmin` component to configure the admin.

| Prop   | Description                                                                          | Examples                       |
| :----- | :----------------------------------------------------------------------------------- | :----------------------------- |
| apiURL | The absolute URL of the ReBAC API, including domain if the API is hosted externally. | http://example.com/api/, /api/ |
