import * as React from "react";
import * as styles from "./ContactUs.scss";
import cx from 'classnames';
import { Link } from "react-router-dom";
import { Constants } from "../../config/constants";

export const ContactUs = (props: ContactUsProps) => {

    const referrer = `/contact?referrer=${location.pathname}`
    const text = /\/orders\/\d+/.test(location.pathname) ? 'If you need more help for this order,' : 'If you need help for your orders,';

    return (
        <div className={cx(styles.content)}>
            <div className={styles.only_mobile}>
                <div className={styles.link_to_contact}>
                    <span>{text}</span> <Link to="/orders">click here</Link>.
                    <br/><br/>
                    <span>For further help</span> <Link to={referrer}>click here</Link>.
                </div>
            </div>
            <div className={styles.only_desktop}>
                <div className={cx([styles.only_desktop, styles.title])}>Want to talk to someone?</div>
                <div className={styles.subtitle}>Can’t find the answer you are looking for RedMart? Chat with our friendly Customer Support officers.</div>
                <div className={styles.btns}>
                    <div className={styles.btn} onClick={props.onChatClick}>
                        <div className={styles.chat} />
                        <div className={styles.label}>{props.chatMessage}</div>
                    </div>
                </div>
                <div className={styles.subtext}>{Constants.OPERATION_TIME}</div>
                <br/>
                <div className={styles.card_subtitle} style={{marginTop: 0}}>Still Need Help? <span className={styles.more} onClick={props.onMoreClick}>Call us.</span></div>
            </div>
        </div>
    )
};

export const PopupText = () => {
    return (
        <div style={{ border: '1px solid #ddd', padding: '12px 14px', fontSize: '14px' }}>
            <div style={{ fontSize: '14px', marginBottom: '12px', color: '#333' }}>Our Customer Service Hotline:</div>
            <a href={`tel:${Constants.CS_PHONE_PLAIN}`} style={{ fontSize: '14px', color: '#FF330C', fontWeight: 'bold', display: 'inline-block', marginRight: '12px' }}>{Constants.CS_PHONE_PLAIN_FORMATTED}</a>
            <span style={{ color: '#666', display: 'inline-block', fontSize: '12px' }}>{Constants.CALL_OPERATION_TIME}</span>
            <div style={{marginTop: '8px', fontWeight: 'bold'}}>We are currently experiencing high call volume. Please chat with us for a faster response to your query.</div>
        </div>
    );
}

export interface ContactUsProps {
    onChatClick: () => void,
    onMoreClick: () => void,
    chatMessage: string
}
