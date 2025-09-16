import {
  AppAside,
  ApplicationLayout,
  Icon,
  Button,
  Col,
  Form,
  Input,
  Panel,
  Row,
} from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import type { NavLinkProps } from "react-router";
import { Link, NavLink, Outlet } from "react-router";

import {
  AccessGovernanceLink,
  AuthenticationLink,
  EntitlementsLink,
  GroupsLink,
  ResourcesLink,
  RolesLink,
  UsersLink,
} from "components/links";

const rebacAdminBaseURL = "/permissions";

const App: FC = () => {
  const [showAside, setShowAside] = useState(false);
  const [asidePinned, setAsidePinned] = useState(false);

  const logo = {
    component: Link,
    icon: "https://assets.ubuntu.com/v1/7144ec6d-logo-jaas-icon.svg",
    name: "https://assets.ubuntu.com/v1/2e04d794-logo-jaas.svg",
    nameAlt: "JAAS",
    to: "/",
  };

  return (
    <ApplicationLayout<NavLinkProps>
      id="app-layout"
      logo={logo}
      navItems={[
        {
          items: [
            {
              icon: "drag",
              label: "Models",
              to: "/models",
            },
            {
              icon: "menu",
              label: "Controllers",
              to: "/controllers",
            },
            {
              icon: "user",
              label: "Permissions",
              to: rebacAdminBaseURL,
              end: true,
            },
            <AccessGovernanceLink
              className="p-side-navigation__link"
              baseURL={rebacAdminBaseURL}
              key="AccessGovernanceLink"
            />,
            <AuthenticationLink
              className="p-side-navigation__link"
              baseURL={rebacAdminBaseURL}
              key="AuthenticationLink"
            />,
            <EntitlementsLink
              className="p-side-navigation__link"
              baseURL={rebacAdminBaseURL}
              key="EntitlementsLink"
            />,
            <GroupsLink
              className="p-side-navigation__link"
              baseURL={rebacAdminBaseURL}
              key="GroupsLink"
            />,
            <ResourcesLink
              className="p-side-navigation__link"
              baseURL={rebacAdminBaseURL}
              key="ResourcesLink"
            />,
            <RolesLink
              className="p-side-navigation__link"
              baseURL={rebacAdminBaseURL}
              key="RolesLink"
            />,
            <UsersLink
              className="p-side-navigation__link"
              baseURL={rebacAdminBaseURL}
              key="UsersLink"
            />,
          ],
        },
      ]}
      navLinkComponent={NavLink}
      aside={
        showAside ? (
          <AppAside title="Aside panel" pinned={asidePinned}>
            <Panel
              controls={
                <>
                  <Button
                    onClick={() => setAsidePinned(!asidePinned)}
                    dense
                    className="u-no-margin"
                  >
                    Pin aside
                  </Button>
                  <Button
                    appearance="base"
                    className="u-no-margin--bottom"
                    hasIcon
                    onClick={() => {
                      setShowAside(false);
                      setAsidePinned(false);
                    }}
                  >
                    <Icon name="close">Close</Icon>
                  </Button>
                </>
              }
            >
              <Form stacked>
                <Input
                  label="Full name"
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  stacked
                />
                <Input
                  label="Username"
                  type="text"
                  name="username-stacked"
                  autoComplete="username"
                  aria-describedby="exampleHelpTextMessage"
                  stacked
                  help="30 characters or fewer."
                />
                <Input
                  type="text"
                  label="Email address"
                  aria-invalid="true"
                  name="username-stackederror"
                  autoComplete="email"
                  required
                  error="This field is required."
                  stacked
                />
                <Input
                  label="Address line 1"
                  type="text"
                  name="address-optional-stacked"
                  autoComplete="address-line1"
                  stacked
                />
                <Input
                  label="Address line 2"
                  type="text"
                  name="address-optional-stacked"
                  autoComplete="address-line3"
                  stacked
                />
                <Row>
                  <Col size={12}>
                    <Button
                      appearance="positive"
                      className="u-float-right"
                      name="add-details"
                    >
                      Add details
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Panel>
          </AppAside>
        ) : null
      }
      status={
        <Button
          onClick={() => setShowAside(!showAside)}
          dense
          appearance="base"
          className="u-no-margin"
        >
          Toggle aside
        </Button>
      }
    >
      <Outlet />
    </ApplicationLayout>
  );
};

export default App;
