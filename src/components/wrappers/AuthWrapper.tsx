import * as log from "loglevel";
import * as React from "react";
import { isLoggedIn, loginFrom } from "../../utils/session";
import { Link } from "react-router-dom";
import { isWindVandAvailable, initiateLogin, showToast } from "../../api/windvane";
import { basePath } from "../../config/environment";
import { refresh } from "../../utils/extras";


export const ProtectedPage: React.StatelessComponent<{}> = ({ children }) => {
  if (!isLoggedIn()) {

    if (isWindVandAvailable()) {
      log.warn("Redirecting to native login screen");
      initiateLogin(refresh);
    } else {
      log.warn("You need to be logged-in to see this screen");
      location.href = loginFrom();
    }

    return null;
  }
  return <React.Fragment>{children}</React.Fragment>;
};

export const ProtectedLink: React.StatelessComponent<ProtectedLinkProps> = (props: ProtectedLinkProps) => {

  let { to, needLogin, children, ...otherProps } = props;
  const isAbsoluteUrl = /^https?:\//.test(to);
  let useAnchor = isAbsoluteUrl;

  // If it is a relative link, then "Link" element takes care of infixing the subpath ("/customer-support")
  // But if it an absolute url (explicitly set or due to login requirement), then we need to manually include it in

  if (needLogin && !isLoggedIn()) {

    if (isWindVandAvailable()) {
      const onSuccess = () => { 

        if (/^https?:\/\//.test(to) && to.indexOf(location.origin) < 0) {
          // @ts-ignore
          window.location = to;
        } else {
          // @ts-ignore
          window.location = `${basePath.replace(/\/$/g, '')}${to}`; 
        }

      }
      return <a href="javascript:void(0)" {...otherProps} onClick={() => initiateLogin(onSuccess)}>{children}</a>;
    }

    if (/^https?:\/\//.test(to) && to.indexOf(location.origin) < 0) {
      to = loginFrom(to);
    } else {
      to = loginFrom(`${location.origin}${basePath.replace(/\/$/g, '')}${to}`);
    }

    useAnchor = true;
  }

  if (to === null) {
    return <div {...otherProps}>{children}</div>;
  }

  return useAnchor ? <a href={to} {...otherProps}>{children}</a> : <Link to={to} {...otherProps}>{children}</Link>
}

export interface ProtectedLinkProps {
  to: string,        // either relative url like "/orders", "/feedback" (don't use /customer-support/ subpath), or absolute url
  needLogin?: boolean,
  [props: string]: any
}

ProtectedLink.defaultProps = {
  needLogin: false
}
