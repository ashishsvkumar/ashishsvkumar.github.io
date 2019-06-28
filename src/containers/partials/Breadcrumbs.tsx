import * as React from "react";
import * as styles from "./Breadcrumbs.scss";
import cx from 'classnames';
import { BreadcrumbEntry, breadcrumbState } from "../../store/breadcrumb/types";
import { connect } from "react-redux";
import { ApplicationState } from "../../store";
import { ProtectedLink } from "../../components/wrappers/AuthWrapper";

const Breadcrumbs = (props: BreadcrumbProps) => {
    return (
        <div className={styles.content}>
            <div>
                <a href="https://lazada.sg" className={cx([styles.link])} key="link-home">Home</a>
                {prepareBreadcrumbs(props)}
            </div>
        </div>
    )
};

function prepareBreadcrumbs({breadcrumbs}: BreadcrumbProps) {
    const all = [{text: 'RedMart Help Center', url: '/', needLogin: false}].concat(breadcrumbs);
    return all.map((crumb, index) => prepareBreadcrumb(crumb, index, index === all.length - 1))
}

function prepareBreadcrumb(crumb: BreadcrumbEntry, index: number, isLast: boolean) {
    const className = cx({[styles.link]: true, [styles.dark]: isLast});
    return (
        <React.Fragment key={`fragment-${index}`}>
            <span className={styles.separator} key={`separator-${index}`}>/</span>
            <ProtectedLink className={className} key={`link-${index}`} to={crumb.url} needLogin={crumb.needLogin}>{crumb.text}</ProtectedLink>
        </React.Fragment>
    );
}

type BreadcrumbProps = breadcrumbState;

const maptStateToProps = ({ breadcrumbs }: ApplicationState) => {
    return breadcrumbs;
}

export default connect(maptStateToProps, null)(Breadcrumbs);
