import * as React from "react";
import * as styles from "./OrdersPage.scss";
import { setTitle } from '../../../utils/container'
import { ContentTitle } from "../../labels/ContentTitle"
import { OrderSummaryCard, OrderSummaryProps, LinkTo } from '../../order/OrderSummary'

export const OrdersPage = (props: OrdersPageProps) => {

    setTitle('My RedMart Orders')

    const hasOrders = props.orders && props.orders.length > 0;

    return (
        <div className={styles.content}>
            { hasOrders &&  <div className={styles.mobile_title}><ContentTitle text="Which order do you need help with?" /></div>}
            <div className={styles.desktop_title}><ContentTitle text="My RedMart Orders" /></div>
            { hasOrders && <div className={styles.cards}>
                {props.orders.map(order => prepareOrderCard(order))}
            </div>}
            {
                !hasOrders && <div className={styles.empty_order_page}>You don't have any RedMart orders in past week.</div>
            }
        </div>
    );
}

function prepareOrderCard(order: OrderSummaryProps) {
    return <OrderSummaryCard
        linkTo={LinkTo.ORDER_HELP}
        {...order}
        key={`order-summary-${order.tradeOrderId}`}
    />;
}

OrdersPage.defaultProps = {
    orders: []
}

export interface OrdersPageProps {
    orders?: OrderSummaryProps[]
}
