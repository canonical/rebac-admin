import ReBACAdmin from "components/ReBACAdmin";

import Button from "@canonical/react-components/dist/components/Button";
import Col from "@canonical/react-components/dist/components/Col";
import Form from "@canonical/react-components/dist/components/Form";
import Icon from "@canonical/react-components/dist/components/Icon";
import Input from "@canonical/react-components/dist/components/Input";
import Row from "@canonical/react-components/dist/components/Row";
import classNames from "classnames";
import { useState } from "react";

const App = () => {
  const [showAside, setShowAside] = useState(false);
  const [menuPinned, setMenuPinned] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(true);

  return (
    <div className="l-application" role="presentation">
      <div className="l-navigation-bar">
        <div className="p-panel is-dark">
          <div className="p-panel__header">
            <a className="p-panel__logo" href="#test">
              <img
                className="p-panel__logo-icon"
                src="https://assets.ubuntu.com/v1/7144ec6d-logo-jaas-icon.svg"
                alt=""
                width="24"
                height="24"
              />
              <img
                className="p-panel__logo-name is-fading-when-collapsed"
                src="https://assets.ubuntu.com/v1/2e04d794-logo-jaas.svg"
                alt="JAAS"
                height="16"
              />
            </a>
            <div className="p-panel__controls">
              <span
                role="button"
                tabIndex={0}
                className="p-panel__toggle"
                onClick={() => setMenuCollapsed(!menuCollapsed)}
                onKeyDown={() => setMenuCollapsed(!menuCollapsed)}
              >
                Menu
              </span>
            </div>
          </div>
        </div>
      </div>

      <header
        className={classNames("l-navigation", {
          "is-collapsed": menuCollapsed,
          "is-pinned": menuPinned,
        })}
      >
        <div className="l-navigation__drawer">
          <div className="p-panel is-dark">
            <div className="p-panel__header is-sticky">
              <a className="p-panel__logo" href="#test">
                <img
                  className="p-panel__logo-icon"
                  src="https://assets.ubuntu.com/v1/7144ec6d-logo-jaas-icon.svg"
                  alt=""
                  width="24"
                  height="24"
                />
                <img
                  className="p-panel__logo-name is-fading-when-collapsed"
                  src="https://assets.ubuntu.com/v1/2e04d794-logo-jaas.svg"
                  alt="JAAS"
                  height="16"
                />
              </a>
              <div className="p-panel__controls u-hide--large">
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
              </div>
            </div>
            <div className="p-panel__content">
              <div
                className="p-side-navigation--icons is-dark"
                id="drawer-icons"
              >
                <nav aria-label="Main">
                  <ul className="p-side-navigation__list">
                    <li className="p-side-navigation__item">
                      <a className="p-side-navigation__link" href="#test">
                        <Icon
                          name="drag"
                          light
                          className="p-side-navigation__icon"
                        />
                        <span className="p-side-navigation__label">
                          <span className="p-side-navigation__label">
                            Models
                          </span>
                        </span>
                      </a>
                    </li>
                    <li className="p-side-navigation__item">
                      <a className="p-side-navigation__link" href="#test">
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
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="l-main">
        <ReBACAdmin />
      </main>
      {showAside ? (
        <aside className="l-aside" id="aside-panel">
          <div className="p-panel">
            <div className="p-panel__header">
              <h4 className="p-panel__title">Aside panel</h4>
              <div className="p-panel__controls">
                <Button
                  appearance="base"
                  className="u-no-margin--bottom"
                  hasIcon
                  onClick={() => setShowAside(false)}
                >
                  <Icon name="close" />
                </Button>
              </div>
            </div>
            <div className="p-panel__content">
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
            </div>
          </div>
        </aside>
      ) : null}
      <aside className="l-status">
        <div className="p-panel">
          <Button
            onClick={() => setShowAside(!showAside)}
            dense
            appearance="base"
            className="u-no-margin"
          >
            Toggle aside
          </Button>
        </div>
      </aside>
    </div>
  );
};

export default App;
