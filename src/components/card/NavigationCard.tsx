import * as React from "react";
import { ArrowIcon } from "../icons/ArrowIcon";
import { ProtectedLink } from "../wrappers/AuthWrapper";
import * as styles from "./NavigationCard.scss";
import { isLoggedIn } from "../../utils/session"
import cx from "classnames";

export const enum Theme {
    STRIP = "strip",
    CARD = "card"
}

export const NavigationCard = (props: NavigationCardProps) => {

    const classNames = cx([styles.content, styles[props.theme]]);

    return (
        <ProtectedLink to={props.to} needLogin={props.needLogin} className={classNames}>
            <div className={styles.text}>{props.text}</div>
            <div className={styles.arrow}><ArrowIcon /></div>
            {props.needLogin && !isLoggedIn() && <div className={styles.loginButton}>Login</div>}
            <div className={styles.clear} />
        </ProtectedLink>
    )
};

export interface NavigationCardProps {
    text: string,
    to: string,
    needLogin?: boolean,
    theme?: Theme
}

NavigationCard.defaultProps = {
    needLogin: false,
    theme: Theme.CARD
}
