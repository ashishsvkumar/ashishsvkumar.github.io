import * as React from "react";
import { ProtectedLink } from "../wrappers/AuthWrapper";
import * as styles from "./OrderSummary.scss";
import { ArrowIcon } from "../icons/ArrowIcon";
import * as moment from "moment";
import cx from "classnames";
import { RedMartOrder } from "../../store/package/types";
import { prepareOrderDetailsLink, HelpLink } from "../pages/order/OrderHelpLandingPage";
import { isEmpty } from "lodash";

export const enum LinkTo {
    ORDER_HELP = "order-help",
    NONE = "none",
    ORDER_DETAIL = "order-details"
}

export class OrderSummary extends React.Component<OrderSummaryProps, OrderSummaryState> {

    static defaultProps = {
        isAsap: false,
        linkTo: LinkTo.ORDER_HELP
    }

    constructor(props: OrderSummaryProps) {
        super(props);
    }

    prepareItemthumnail = (url: string, index: number) => {
        const showCount: boolean = index === 3 && index < this.props.items.length - 1;
        if (url === null) {
            return (
                <div className={cx({[styles.thumbail_holder]: true, [styles.fodder]: true})} key={`item-thumbnail-${url}-${index}`} />
            );
        }

        return (
            <div className={styles.thumbail_holder} key={`item-thumbnail-${url}-${index}`}>
                <div className={styles.thumbail} style={{ backgroundImage: `url("${url}")` }}>
                 {showCount && <div className={styles.count_holder}></div>}
                 {showCount && <div className={styles.count}>+{this.props.items.length - 3}</div>}
                </div>
            </div>
        )
    }

    trimSlot = () => {

        if (this.props.deliverySlot.indexOf('Placed on') === 0) {
            return  moment(this.props.deliverySlot, 'DD MMM YYYY HH:mm:ss').format('ddd DD MMM');
        }

        return this.props.deliverySlot.replace('Get by', '').replace('Delivered on', '');
    }

    label = () => {
        return this.props.deliverySlot === 'Cancelled' ? "Placed On" : "Delivery Time";
    }

    statusColor = () => {
        switch (this.props.status) {
            case "Payment pending":
                return "#f29d38";
            case "Refunded":    
            case "Delivered":
                return "#89a836";
            case "Cancelled":
                return "#999";
            case "Cancellation initiated":
                return "#999";
            case "Processing":
            case "Shipped":
            default:
                return "#008996";
        }
    }

    shouldShowOrderLink = () => {
        return this.props.linkTo === LinkTo.ORDER_DETAIL && !(!isEmpty(document.referrer) && (document.referrer.indexOf('/support') < 0));
    }

    render() {
        const { status, items, linkTo, showMultipleActions = false } = this.props;
        const thumbnailClass = cx({ [styles.thumbnails]: true, [styles.greyscale]: status === 'Cancelled' })
        const itemsForThumbnail = items.concat([null, null, null]).slice(0, 4)

        return (
            <React.Fragment>
                <div className={styles.slot}>
                    <div className={styles.time}>{this.trimSlot()}</div>
                    <div className={cx([styles.status, styles.only_mobile])} style={{ color: this.statusColor() }}>{status}</div>
                    <div className={styles.clear}></div>
                </div>
                <div className={thumbnailClass}>
                    {itemsForThumbnail.map(im => im === null ? null : im.thumbnail).map((url, index) => this.prepareItemthumnail(url, index))}
                    {linkTo === LinkTo.ORDER_HELP && !showMultipleActions && <div className={styles.help_btn}>Get Help</div>}
                    {showMultipleActions && <div className={cx([styles.actions, styles.only_desktop])}>{prepareExtraLink(this.props)}</div>}
                    {this.shouldShowOrderLink() && <div className={cx(styles.help)}>View Order Details</div>}
                    <div className={cx([styles.status, styles.only_desktop])} style={{ color: this.statusColor() }}>{status}</div>
                    <div className={styles.clear}></div>
                </div>
                <div className={styles.clear}></div>
            </React.Fragment>
        )
    }
}

export const OrderSummaryCard = (props: OrderSummaryProps) => {
    return (
        <ProtectedLink to={prepareOrderHelpLink(props.linkTo, props.tradeOrderId)} needLogin={true} className={cx([styles.content, styles.card])}>
            <OrderSummary {...props} />
        </ProtectedLink>
    )
}

export const OrderSummarySubcard = (props: OrderSummaryProps) => {
    return (
        <ProtectedLink to={prepareOrderHelpLink(props.linkTo, props.tradeOrderId)} needLogin={true} className={cx([styles.content, styles.subcard])}>
            <OrderSummary {...props} />
        </ProtectedLink>
    )
}

export const RecentOrderCard = (props: OrderSummaryProps) => {
    return (
        <div className={cx([styles.content, styles.card, styles.pack])}>
            <div className={cx([styles.recent, styles.only_mobile])}>&nbsp;</div>
            <OrderSummarySubcard {...props} showMultipleActions={true}/>
            <div className={cx([styles.actions, styles.only_mobile])}>{prepareExtraLink(props)}</div>
            <ProtectedLink className={styles.all_orders} to="/orders">
                <div className={styles.help}><span>View More Orders</span></div>
                <div className={styles.arrow}><ArrowIcon /></div>
                <div className={styles.arrow_2}><ArrowIcon /></div>
                <div className={styles.clear}></div>
            </ProtectedLink>
        </div>
    )
}

function prepareOrderHelpLink(linkTo: LinkTo, tradeOrderId: string) {
    if (linkTo === LinkTo.ORDER_HELP) {
        return `/orders/${tradeOrderId}`;
    } else if (linkTo === LinkTo.ORDER_DETAIL) {
        return prepareOrderDetailsLink(tradeOrderId);
    } else {
        return null;
    }
}

function prepareExtraLink(props: OrderSummaryProps) {
    return (
        <React.Fragment>
            { helpLinks(props).filter(link => link.shouldEnable())
                .map(link => <ProtectedLink className={styles.action} to={link.url} key={link.url}>
                        <div>{link.text}</div><div className={styles.arrow}><ArrowIcon /></div>
                    </ProtectedLink>) 
            }
        </React.Fragment>
    );
}

interface OrderSummaryState {

}

interface ExtraProps {
    linkTo?: LinkTo,
    showMultipleActions?: boolean
}

export type OrderSummaryProps = RedMartOrder & ExtraProps;



//-------------------

const helpLinks = (order: RedMartOrder): HelpLink[] => [
    { 
        text: "Report missing items", 
        url: `/orders/${order.tradeOrderId}/help/missing`, 
        shouldEnable: () => ["Delivered"].indexOf(order.status) >= 0 && !isEmpty(order.refundableItems)
    },
    { 
        text: "Report an issue with received items", 
        url: `/orders/${order.tradeOrderId}/help/damaged`, 
        shouldEnable: () => ["Delivered"].indexOf(order.status) >= 0 && !isEmpty(order.refundableItems)
    },
    {
        text: (["Delivered"].indexOf(order.status) >= 0 && !isEmpty(order.refundableItems)) ? 'More Help' : 'Get Help',
        url: `/orders/${order.tradeOrderId}`,
        shouldEnable: () => true
    }
];