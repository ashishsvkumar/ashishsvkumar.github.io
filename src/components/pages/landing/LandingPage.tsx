import * as React from "react";
import * as styles from "./LandingPage.scss";
import { setTitle } from '../../../utils/container'
import { NavigationCard, Theme } from '../../card/NavigationCard'
import { ContentTitle } from "../../labels/ContentTitle"
import { RecentOrderCard, LinkTo } from '../../order/OrderSummary'
import cx from 'classnames';
import ContactUs from "../../../containers/partials/ContactUs";
import { RedMartOrder } from "../../../store/package/types";
import {isEmpty} from 'lodash';
import { isLoggedIn } from "../../../utils/session";

export const LandingPage = (props: LandingPageProps) => {

    const { recentOrder } = props;
    setTitle('RedMart Help Center')

    return (
    
        <div className={styles.content}>
            <div className={styles.hue_box}>
                {props.userName && <div className={styles.callout}>{`Hi ${props.userName}, what can we help you with?`}</div>}
                {!props.userName && <div className={styles.callout}>Hi, what can we help you with?</div>}
            </div>
            <div className={styles.cards}>
                <div className={styles.panel}>
                    <div className={styles.title}><ContentTitle text="Get help for your RedMart orders" /></div>
                    <div className={styles.first_card}>
                        {getFirstCard(recentOrder)}
                    </div>
                </div>
                <div className={styles.panel}>
                    <div className={styles.title}><ContentTitle text="FAQs" /></div>
                    <div className={cx([styles.other_cards, styles.only_mobile])}>
                        <NavigationCard text="About RedMart & Lazada Integration" to="/category/202558047/About+RedMart+&+Lazada+Integration" theme={Theme.STRIP}/>
                        <NavigationCard text="Placing an Order" to="/category/202592867/Placing+an+Order"  theme={Theme.STRIP}/>
                        <NavigationCard text="RedMart Delivery" to="/category/202557897/RedMart+Delivery"  theme={Theme.STRIP}/>
                        <NavigationCard text="Products on RedMart" to="/category/202601828/Products+on+RedMart"  theme={Theme.STRIP}/>
                        <NavigationCard text="About RedMart" to="/category/202592837/About-RedMart"  theme={Theme.STRIP}/>
                    </div>
                    <div className={cx([styles.other_cards, styles.only_desktop])}>
                        <NavigationCard text="About RedMart & Lazada Integration" to="/category/202558047/About+RedMart+&+Lazada+Integration"/>
                        <NavigationCard text="Placing an Order" to="/category/202592867/Placing+an+Order"/>
                        <NavigationCard text="RedMart Delivery" to="/category/202557897/RedMart+Delivery"/>
                        <NavigationCard text="Products on RedMart" to="/category/202601828/Products+on+RedMart"/>
                        <NavigationCard text="About RedMart" to="/category/202592837/About-RedMart"/>
                    </div>
                </div>
                <div className={styles.only_desktop}><ContactUs /></div>
            </div>
        </div>
    );
}

function getFirstCard(recentOrder: RedMartOrder = null) {
    if (!isLoggedIn()) {
        return <NavigationCard text="Login to view your orders" to="/orders" needLogin={true} />
    } else if (isEmpty(recentOrder)) {
        return <NavigationCard text="Past orders" to="/orders" needLogin={true} />
    } else {
        return <RecentOrderCard {...recentOrder} linkTo={LinkTo.ORDER_HELP} />
    }
}

LandingPage.defaultProps = {
    isLoggedIn: false
}

export interface LandingPageProps {
    isLoggedIn: boolean,
    recentOrder?: RedMartOrder,
    userName: string
}