import type { NavLinkProps } from "react-router-dom";
import { NavLink } from "react-router-dom";

export type BaseLinkProps = Omit<NavLinkProps, "to"> & {
  baseURL: string;
  to: string;
};

const BaseLink = ({ baseURL, to, ...props }: BaseLinkProps) => {
  let base = baseURL.startsWith("/") ? baseURL : baseURL.slice(1);
  base = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  return <NavLink to={[base, to].join("")} {...props} />;
};

export default BaseLink;
