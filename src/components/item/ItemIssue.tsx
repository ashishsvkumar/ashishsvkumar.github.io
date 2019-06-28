import * as React from "react";
import * as styles from "./ItemIssue.scss";
import {ItemPreview, ItemPreviewProps} from './ItemPreview';
import { NumberPicker } from "../form/NumberPicker";
import { Select, SelectOption } from "../form/Select";
import { isEmptyString } from "../../utils/extras";
import { WarningIcon } from "../icons/WarningIcon";

export const ItemIssue = (props: ItemIssueProps) => {
    return (
        <div className={styles.content}>
            <div className={styles.body}>
                <div className={styles.preview}><ItemPreview {...props}/></div>
                <div className={styles.btn} onClick={props.onDelete}/>
                <div className={styles.clear}/>
            </div>
            <div className={styles.form}>
                {props.issueTypes && dropdown(props)}
                <div className={styles.picker}><NumberPicker label={props.pickerLabel} min={1} max={props.quantity} value={1} valueChanged={props.quantityChanged}/></div>
                <div className={styles.clear}/>
            </div>
        </div>
    )
};

function dropdown(props: ItemIssueProps) {
    return (
        <div className={styles.select_container}>
            <div className={styles.select_label}>What's the issue?</div>
            <div className={styles.select}>
                <Select options={props.issueTypes} value={props.selectedIssue} onChange={props.selectChanged} inputOptions={ { placeholder: "Select" } }/>
                { props.enableWarning === true && isEmptyString(props.selectedIssue) && <div className={styles.warn_text}><WarningIcon text="Please don’t leave this empty."/></div> }
            </div>
        </div>
    );
}

export interface ItemIssueProps extends ItemPreviewProps {
    issueTypes?: SelectOption[],
    pickerLabel: string,
    quantityChanged?: (oldValue: number, newValue: number) => void,
    selectChanged?: (value: string) => void,
    onDelete?: () => void,
    enableWarning?: boolean
}
