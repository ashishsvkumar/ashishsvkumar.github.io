import * as React from "react";
import { Button } from "../form/Button";
import * as styles from "./NotificationCard.scss";
import { Alert } from "../../store/alert/types";

export const NotificationCard = (props: Alert) => {

    const { title, message, btnText, onClick } = props;

    return (
        <div className={styles.content}>
            {title && <div className={styles.title}>{title}</div>}
            {message && <div className={styles.message}>{message}</div>}
            {btnText && <div className={styles.only_mobile}><Button text={btnText} isPrimary={true} style={{ width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0, boxShadow: 'none' }} onClick={onClick} /></div>}
            {btnText && <div className={styles.only_desktop}><Button text={btnText} isPrimary={true} style={{ margin: '30px 10px 8px auto', padding: '15px 50px' }} onClick={onClick} /></div>}
        </div>
    )
};
