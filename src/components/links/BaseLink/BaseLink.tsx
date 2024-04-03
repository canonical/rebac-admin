import { Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { PropsWithChildren } from "react";
import type { NavLinkProps } from "react-router-dom";
import { NavLink } from "react-router-dom";

export type BaseLinkProps = Omit<NavLinkProps, "to" | "children"> &
  PropsWithChildren & {
    baseURL: string;
    icon?: string;
    iconIsLight?: boolean;
    to: string;
  };

const BaseLink = ({
  baseURL,
  children,
  icon,
  iconIsLight,
  to,
  ...props
}: BaseLinkProps) => (
  <NavLink
    to={[baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL, to].join("")}
    {...props}
  >
    {icon ? (
      <>
        <Icon
          className={classNames("p-side-navigation__icon", {
            "is-light": iconIsLight,
          })}
          name={icon}
        />{" "}
      </>
    ) : null}
    {children}
  </NavLink>
);

export default BaseLink;
