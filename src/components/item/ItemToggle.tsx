import * as React from "react";
import * as styles from "./ItemToggle.scss";
import { ItemPreviewProps, ItemPreview } from "./ItemPreview";
import { Checkbox, CheckboxProps } from "../form/Checkbox"

export const ItemToggle = (props: ItemToggleProps) => {
    const { isChecked, ...previewProps } = props;

    return (
        <div className={styles.content} onClick={props.onToggle}>
            <div className={styles.checkbox}><Checkbox isChecked={isChecked} /></div>
            <div className={styles.body}><ItemPreview {...previewProps} /></div>
            <div className={styles.clear} />
        </div>
    )
}

ItemToggle.defaultProps = {
    isChecked: false
}

export type ItemToggleProps = ItemPreviewProps & CheckboxProps;
