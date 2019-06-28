import * as React from "react";
import cx from "classnames";
import * as styles from "./ArrowIcon.scss";

export interface ArrowIconProps {
    direction?: Direction
    width?: number
    size?: number
    color?: string,
    [propName: string]: any
};

const defaultProps: ArrowIconProps = {
    direction: Direction.RIGHT,
    width: 1,
    size: 3,
    color: "#999"
}

export const enum Direction {
    LEFT = "left",
    RIGHT = "right",
    UP = "up",
    DOWN = "down"
}

export const ArrowIcon = (props: ArrowIconProps) => {
    const { direction, width, size, color, ...otherProps } = props;

    const style = {
        border: `solid ${color}`,
        borderWidth: `0 ${width}px ${width}px 0`,
        padding: `${size}px`
    };

    return (
        <div style={style} {...otherProps} className={cx([styles.arrow, styles[direction]])} />
    );
}

ArrowIcon.defaultProps = defaultProps;
