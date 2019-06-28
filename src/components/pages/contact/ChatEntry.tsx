import * as React from "react";
import * as styles from "./ChatEntry.scss";
import cx from 'classnames';
import { currentEnvironment, Environments, isMobile } from "../../../config/environment";
import { setTitle } from "../../../utils/container";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { showMessage } from "../../../store/alert/actions";
import { PopupText } from "../../../components/card/ContactUs";
import { setBreadcrumbs } from "../../../store/breadcrumb/actions";
import { BreadcrumbEntry } from "../../../store/breadcrumb/types";
import { ContentTitle } from "../../labels/ContentTitle";
import { ChatState } from "../../../store/chat/types";
import { ApplicationState } from "../../../store";
import { isLoggedIn } from "../../../utils/session";
import { isEmpty } from 'lodash';
import { fetchRedMartOrders } from "../../../store/package/actions"
import { Constants } from "../../../config/constants";
import { ProtectedLink } from "../../wrappers/AuthWrapper";
import { trackPageView, trackEvent } from "../../../utils/tracker";


class ChatEntry extends React.Component<ChatEntryProps, {}> {
    
    constructor(props: ChatEntryProps) {
        super(props);
    }

    componentWillMount() {
        setTitle('Contact RedMart');
        this.props.setBreadcrumbs([
            { text: 'Contact RedMart', url: location.href, needLogin: false }
        ]);

        if (this.props.shouldFetchOrders) {
            this.props.fetchRedMartOrders();
        }

        trackPageView('Contact RedMart')
    }

    ordersLink = () => {
        if (currentEnvironment === Environments.production) {
            return isMobile() ? 'https://my-m.lazada.sg/order/order-management' : 'https://my.lazada.sg/customer/order/index/'
        } else {
            return isMobile() ? 'https://my-p.lazada.sg/order/order-management' : 'https://my.lazada.sg/customer/order/index'
        }
    }

    prepareCard = (title: string, subtitle: string, url: string, needLogin: boolean) => {
        const frag = (
            <React.Fragment>
                <div className={styles.card_title}>{title}</div>
                <div className={styles.card_subtitle}>{subtitle}</div>
            </React.Fragment>
        );

        return <ProtectedLink needLogin={needLogin} to={url} className={styles.card}>{frag}</ProtectedLink>;
    }

    onChat = () => {
        if (this.props.chat.loaded) {
            const match = (this.props.location.search || 'foo-bar').match(/tradeOrderId=(\d+)/);

            if (!isEmpty(match) && match.length >= 2) {
                this.props.chat.snapEngageInstance.setCustomField('OrderNumber', `${match[1]}`);
            } else if (!isEmpty(this.props.recentOrder)) {
                this.props.chat.snapEngageInstance.setCustomField('OrderNumber', `${this.props.recentOrder}`);
            }
            
            this.props.chat.snapEngageInstance.startLink();
            trackEvent('Chat', 'click', 'Contact RedMart')
        }
    }

    onMore = () => {
        this.props.showMessage('Contact Us', PopupText(), 'Close');
        trackEvent('Phone', 'click', 'Contact RedMart')
    }
    
    render() {
        return (
            <div className={styles.container}>
                <div className={cx([styles.only_desktop])}><ContentTitle text="Contact RedMart"/></div>
                <div className={styles.content}>
                    <div className={styles.title}>Hi, how can we help you?</div>
                    <div className={styles.cards}>
                        {this.prepareCard('Report an issue for my received order', 'Let us know about the missing or damaged items', '/orders', true)}
                        {this.prepareCard('Update my delivery instructions', 'Updating shipping address and phone number is not supported', '/category/202557897/RedMart+Delivery/faq/360021238994/How+do+I+update+my+delivery+information%3F', false)}
                        {this.prepareCard('Cancel my order', 'Only supported 17 hours before your delivery', '/category/202592867/Placing+an+Order/faq/360019789213/How+can+I+cancel+my+order%3F', false)}
                    </div>
                    <div className={styles.others}>
                        <span>I have another question</span>
                        <Link to="/" className={styles.link_back}>Browse Help Center &nbsp;&nbsp;❯</Link>
                    </div>
                </div>
                {/* <div className={styles.content}>
                    <div className={styles.title}>Top Questions</div>
                    <div className={styles.cards}>
                        {this.prepareCard('What happens if I cancel an order that I applied a voucher to?', '', '/category/202592867/Placing+an+Order/faq/360019817993/What+happens+if+I+cancel+an+order+that+I+applied+a+voucher+to%3F', false)}
                        {this.prepareCard("Why was my order cancelled even though I didn't cancel it myself?", '', '/category/202592867/Placing+an+Order/faq/360019778634/Why+was+my+order+cancelled+even+though+I+didn%27t+cancel+it+myself%3F', false)}
                        {this.prepareCard('I am a LiveUp member. Why are some of my credits missing?', '', '/category/202558047/About+RedMart+&+Lazada+Integration/faq/360019818833/+I+am+a+LiveUp+member.+Why+are+some+of+my+credits+missing%3F', false)}
                    </div>
                </div> */}
                <div className={styles.content}>
                    <div className={styles.title} aria-label="CONTACT US">Contact Us</div>
                    <div style={{padding: '0 2px'}}>
                        <div className={styles.card_subtitle}>Can't find the answer you are looking for? Contact us through <b>Live Chat</b> and we will assist you.</div>
                        <div className={styles.btn} onClick={this.onChat}>
                            <div className={styles.center}>
                                <div className={styles.icon}/>
                                <div className={styles.btn_text}>Chat Now</div>
                                <div className={styles.clear}/>
                            </div>
                        </div>
                        <div className={styles.timings}>{Constants.OPERATION_TIME}</div>
                        <br/>
                        <div className={styles.card_subtitle} style={{marginTop: 0}}>Still Need Help? <span className={styles.more} onClick={this.onMore}>Call us.</span></div>
                    </div>
                </div>
            </div>
        )
    }
}

interface PropsFromUrl {
    location: {
        search: string
    }
}

interface PropsFromDispatch {
    showMessage: (title: string, message: any, btnText: string) => void,
    setBreadcrumbs: (breadcrumbs: BreadcrumbEntry[]) => void,
    fetchRedMartOrders: () => void
}

interface PropsFromState {
    chat: ChatState,
    shouldFetchOrders: boolean,
    recentOrder?: string
}

type ChatEntryProps = PropsFromDispatch & PropsFromState & PropsFromUrl;

const mapDispatchToProps = {
    showMessage: showMessage,
    setBreadcrumbs: setBreadcrumbs,
    fetchRedMartOrders: fetchRedMartOrders
}

const maptStateToProps = ({ chat, redmartOrders }: ApplicationState) => {
    const shouldFetchOrders = isLoggedIn() && !redmartOrders.fetching && isEmpty(redmartOrders.orders);
    const orders = isEmpty(redmartOrders.orders) ? [] : redmartOrders.orders;

    return {
        chat: chat,
        shouldFetchOrders: shouldFetchOrders,
        recentOrder: isEmpty(orders) ? undefined : '' + orders[0].tradeOrderId
    };
}

export default connect(maptStateToProps, mapDispatchToProps)(ChatEntry);
