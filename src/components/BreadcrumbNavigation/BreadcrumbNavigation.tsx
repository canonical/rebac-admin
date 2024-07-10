import { Button, Icon } from "@canonical/react-components";

import { type Props } from "./types";

import "./_breadcrumb-navigation.scss";

const BreadcrumbNavigation = ({ backTitle, onBack, title, titleId }: Props) => {
  return (
    <nav className="p-breadcrumbs breadcrumb-navigation">
      <ol className="p-breadcrumbs__items">
        {backTitle ? (
          <li className="p-breadcrumbs__item">
            <Button
              className="u-no-margin--bottom"
              appearance="link"
              onClick={() => onBack?.()}
            >
              <Icon name="chevron-left" /> {backTitle}
            </Button>
          </li>
        ) : null}
        <li className="p-breadcrumbs__item">
          <span className="p-heading--4" id={titleId}>
            {title}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;
