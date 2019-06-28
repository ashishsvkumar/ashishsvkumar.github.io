import * as React from "react";
import * as styles from "./PopupPage.scss";
import cx from 'classnames';

export const PopupPage = (props: PopupPageProps) => {

    const { show, popupStyle, children } = props;


    if (show) {
        setImmediate(() => { 
            document.body.classList.add('modal-open'); 
        })
    } else {
        document.body.classList.remove('modal-open');
    }

    const classNames = cx({
        [styles.overlay]: popupStyle === Style.OVERLAY,
        [styles.fullscreen]: popupStyle === Style.FULLSCREEN,
        [styles.show]: show
    })

    return <div className={classNames}>{...children}</div>
}


export const enum Style {
    FULLSCREEN = "fullscreen",
    OVERLAY = "overlay"
}

export interface PopupPageProps {
    popupStyle: Style,
    show: boolean,
    [props: string]: any
}
