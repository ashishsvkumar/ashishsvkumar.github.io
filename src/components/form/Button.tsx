import * as React from "react";
import * as styles from "./Button.scss";
import cx from "classnames";

export const Button = (props: ButtonProps) => {
    const { isPrimary, width, height, fileProps, icon, iconProps, isDisabled, ...otherProps } = props;

    const classNames = cx({
        [styles.content]: true,
        [styles.default]: !isPrimary,
        [styles.primary]: isPrimary,
        [styles.disabled]: isDisabled
    });

    if (fileProps) {
        return (
            <label className={classNames} {...otherProps}>
                {icon && <div className={cx([styles['icon'], styles[icon]])} {...iconProps}></div>}
                <div className={styles.text}>{props.text}</div>
                <input disabled={isDisabled} type="file" hidden={true} {...fileProps} />
            </label>
        );
    }

    return (
        <button className={classNames} disabled={isDisabled} {...otherProps}>
            {icon && <div className={cx([styles['icon'], styles[icon]])} {...iconProps}></div>}
            <div className={styles.text}>{props.text}</div>
        </button>
    );
}

Button.defaultProps = {
    isPrimary: false,
    isDisabled: false
}

export const enum Icon {
    ATTACHMENT = "attachment"
}

export interface ButtonProps {
    text: string;
    isPrimary?: boolean,
    isDisabled?: boolean,
    fileProps?: {
        [propName: string]: any
    },
    icon?: Icon,
    iconProps?: { [propName: string]: any },
    [propName: string]: any
}