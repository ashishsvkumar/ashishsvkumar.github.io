import * as React from "react";
import * as styles from "./WarningIcon.scss";
import { isEmptyString } from "../../utils/extras";

export const WarningIcon = (props: WarningIconProps) => {
    const {text} = props;

    return (
        <div className={styles.content}>
            <div className={styles.icon}/>
           {!isEmptyString(text) && <div className={styles.text}>{text}</div>}
        </div>
    )
}

export interface WarningIconProps {
    text?: string
}