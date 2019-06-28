import * as React from "react";
import * as styles from "./ItemPreview.scss";
import cx from "classnames";
import {truncate} from 'lodash';

export class ItemPreview extends React.Component<ItemPreviewProps, ItemPreviewState> {

    constructor(props: ItemPreviewProps) {
        super(props);
    }

    render() {
        const { name, unitPrice, quantity, thumbnail } = this.props;
        const classNames = cx({ [styles.content]: true });

        return (
            <div className={classNames}>
                <div className={styles.thumbnail_holder}><div className={styles.thumbnail} style={{ backgroundImage: `url("${thumbnail}")` }} /></div>
                <div className={styles.body}>
                    <div className={styles.name}>{truncate(name, { length: 60 })}</div>
                    <div className={styles.price}>{`${unitPrice} x ${quantity}`}</div>
                </div>
                <div className={styles.clear} />
            </div>
        )
    }
}

interface ItemPreviewState {
}

export interface ItemPreviewProps {
    sku: string,
    name: string,
    unitPrice: string,
    quantity: number,
    thumbnail: string,
    selectedQuantity?: number,
    selectedIssue?: string
}