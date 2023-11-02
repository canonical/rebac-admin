import Button from "@canonical/react-components/dist/components/Button";
import Col from "@canonical/react-components/dist/components/Col";
import Form from "@canonical/react-components/dist/components/Form";
import Icon from "@canonical/react-components/dist/components/Icon";
import Input from "@canonical/react-components/dist/components/Input";
import Row from "@canonical/react-components/dist/components/Row";
import classNames from "classnames";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

import Panel from "components/Panel";
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

const App = () => {
  const [showAside, setShowAside] = useState(false);
  const [menuPinned, setMenuPinned] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(true);

  return (
    <div className="l-application" role="presentation">
      <div className="l-navigation-bar">
        <Panel
          className="is-dark"
          logo={{
            component: Link,
            icon: "https://assets.ubuntu.com/v1/7144ec6d-logo-jaas-icon.svg",
            name: "https://assets.ubuntu.com/v1/2e04d794-logo-jaas.svg",
            nameAlt: "JAAS",
            to: "/",
          }}
          toggle={{
            label: "Menu",
            onClick: () => setMenuCollapsed(!menuCollapsed),
          }}
        />
      </div>
      <header
        className={classNames("l-navigation", {
          "is-collapsed": menuCollapsed,
          "is-pinned": menuPinned,
        })}
      >
        <div className="l-navigation__drawer">
          <Panel
            className="is-dark"
            controls={
              <>
                <Button
                  hasIcon
                  appearance="base"
                  className="is-dark u-no-margin u-hide--medium"
                  onClick={(evt) => {
                    setMenuCollapsed(true);
                    evt.currentTarget.blur();
                  }}
                >
                  <Icon name="close" className="is-light" />
                </Button>
                <Button
                  hasIcon
                  appearance="base"
                  className="is-dark u-no-margin u-hide--small"
                  onClick={() => {
                    setMenuPinned(!menuPinned);
                  }}
                >
                  <Icon
                    name={menuPinned ? "close" : "pin"}
                    className="is-light"
                  />
                </Button>
              </>
            }
            controlsClassName="u-hide--large"
            stickyHeader
            logo={{
              component: Link,
              icon: "https://assets.ubuntu.com/v1/7144ec6d-logo-jaas-icon.svg",
              name: "https://assets.ubuntu.com/v1/2e04d794-logo-jaas.svg",
              nameAlt: "JAAS",
              to: "/",
            }}
          >
            <div className="p-side-navigation--icons is-dark" id="drawer-icons">
              <nav aria-label="Main">
                <ul className="p-side-navigation__list">
                  <li className="p-side-navigation__item">
                    <NavLink className="p-side-navigation__link" to="/models">
                      <Icon
                        name="drag"
                        light
                        className="p-side-navigation__icon"
                      />
                      <span className="p-side-navigation__label">
                        <span className="p-side-navigation__label">Models</span>
                      </span>
                    </NavLink>
                  </li>
                  <li className="p-side-navigation__item">
                    <NavLink
                      className="p-side-navigation__link"
                      to="/controllers"
                    >
                      <Icon
                        name="menu"
                        light
                        className="p-side-navigation__icon"
                      />
                      <span className="p-side-navigation__label">
                        <span className="p-side-navigation__label">
                          Controllers
                        </span>
                      </span>
                    </NavLink>
                  </li>
                </ul>
                <ul className="p-side-navigation__list">
                  <li className="p-side-navigation__item--title">
                    <NavLink
                      className="p-side-navigation__link"
                      end
                      to={rebacAdminBaseURL}
                    >
                      <Icon
                        name="user"
                        light
                        className="p-side-navigation__icon"
                      />
                      <span className="p-side-navigation__label">
                        <span className="p-side-navigation__label">
                          Permissions
                        </span>
                      </span>
                    </NavLink>
                  </li>
                  <li className="p-side-navigation__item">
                    <AccessGovernanceLink
                      className="p-side-navigation__link"
                      baseURL={rebacAdminBaseURL}
                    />
                  </li>
                  <li className="p-side-navigation__item">
                    <AuthenticationLink
                      className="p-side-navigation__link"
                      baseURL={rebacAdminBaseURL}
                    />
                  </li>
                  <li className="p-side-navigation__item">
                    <EntitlementsLink
                      className="p-side-navigation__link"
                      baseURL={rebacAdminBaseURL}
                    />
                  </li>
                  <li className="p-side-navigation__item">
                    <GroupsLink
                      className="p-side-navigation__link"
                      baseURL={rebacAdminBaseURL}
                    />
                  </li>
                  <li className="p-side-navigation__item">
                    <ResourcesLink
                      className="p-side-navigation__link"
                      baseURL={rebacAdminBaseURL}
                    />
                  </li>
                  <li className="p-side-navigation__item">
                    <RolesLink
                      className="p-side-navigation__link"
                      baseURL={rebacAdminBaseURL}
                    />
                  </li>
                  <li className="p-side-navigation__item">
                    <UsersLink
                      className="p-side-navigation__link"
                      baseURL={rebacAdminBaseURL}
                    />
                  </li>
                </ul>
              </nav>
            </div>
          </Panel>
        </div>
      </header>
      <main className="l-main">
        <Outlet />
      </main>
      {showAside ? (
        <aside className="l-aside" id="aside-panel">
          <Panel
            controls={
              <Button
                appearance="base"
                className="u-no-margin--bottom"
                hasIcon
                onClick={() => setShowAside(false)}
              >
                <Icon name="close" />
              </Button>
            }
            title="Aside panel"
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
                id="username-stacked"
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
                id="address-optional-stacked0"
                name="address-optional-stacked"
                autoComplete="address-line1"
                stacked
              />
              <Input
                label="Address line 2"
                type="text"
                id="address-optional-stacked1"
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
        </aside>
      ) : null}
      <aside className="l-status">
        <Panel wrapContent={false}>
          <Button
            onClick={() => setShowAside(!showAside)}
            dense
            appearance="base"
            className="u-no-margin"
          >
            Toggle aside
          </Button>
        </Panel>
      </aside>
    </div>
  );
};

export default App;
