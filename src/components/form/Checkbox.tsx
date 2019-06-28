import * as React from "react";
import * as styles from "./Checkbox.scss";
import cx from "classnames";

export const Checkbox = (props: CheckboxProps) => {
    const { radius, isChecked, ...otherProps } = props;

    const classNames = cx({ [styles.checkbox]: true, [styles.checked]: isChecked })
    const style = {width: `${radius}px`, height: `${radius}px`};

    return <div className={classNames} style={style} {...otherProps}/>;
}

Checkbox.defaultProps = {
    isChecked: false,
    radius: 18
}

export interface CheckboxProps {
    isChecked?: boolean,
    radius?: number,
    onToggle?: () => void,
    [propName: string]: any
}
